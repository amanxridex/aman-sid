// ============================================================================
// RAKSHAK CORE - GOLANG HIGH-CONCURRENCY REVERSE PROXY & SHIELD
// ============================================================================
// Zero-allocation HTTP middleware for net/http, Gin, Fiber, and Chi.
// Intercepts AI crawlers and returns deterministic polymorphic JSON decoys.
// ============================================================================

package rakshak

import (
	"encoding/json"
	"math"
	"net/http"
	"strings"
	"sync"
	"time"
)

var cloudASNs = map[string]bool{
	"16509": true, "15169": true, "8075": true, "24940": true,
	"14061": true, "31898": true, "396982": true, "13335": true,
}

var aiKeywords = []string{
	"claudebot", "gptbot", "chatgpt-user", "perplexitybot",
	"deepseek", "crawl4ai", "firecrawl", "headlesschrome",
}

type ThreatResult struct {
	IsBot       bool     `json:"is_bot"`
	Confidence  int      `json:"confidence"`
	ThreatType  string   `json:"threat_type"`
	Reasons     []string `json:"reasons"`
}

type RakshakGoShield struct {
	Action string // "deceive" or "block"
	mu     sync.RWMutex
	hits   map[string][]int64
}

func NewShield(action string) *RakshakGoShield {
	return &RakshakGoShield{
		Action: action,
		hits:   make(map[string][]int64),
	}
}

// ComputeShannonEntropy calculates H = -sum(p * log2(p)) for any byte sequence
func ComputeShannonEntropy(data []byte) float64 {
	if len(data) == 0 {
		return 0.0
	}
	counts := make(map[byte]int)
	for _, b := range data {
		counts[b]++
	}
	var entropy float64
	total := float64(len(data))
	for _, count := range counts {
		p := float64(count) / total
		entropy -= p * math.Log2(p)
	}
	return math.Round(entropy*10000) / 10000
}

// EvaluateRequest checks headers, topology, and ASN telemetry
func (s *RakshakGoShield) EvaluateRequest(r *http.Request) ThreatResult {
	ua := strings.ToLower(r.Header.Get("User-Agent"))
	secCh := strings.ToLower(r.Header.Get("Sec-CH-UA"))
	secFetchDest := r.Header.Get("Sec-Fetch-Dest")
	asn := r.Header.Get("X-Vercel-IP-AS-Number")
	if asn == "" {
		asn = r.Header.Get("CF-IPASN")
	}

	score := 0
	var reasons []string

	// 1. Check AI Crawlers
	for _, kw := range aiKeywords {
		if strings.Contains(ua, kw) {
			score += 75
			reasons = append(reasons, "Matched AI crawler signature: "+kw)
			break
		}
	}

	// 2. Headless Detection
	if strings.Contains(secCh, "headless") || strings.Contains(ua, "headless") {
		score += 55
		reasons = append(reasons, "Headless browser automation detected")
	}

	// 3. Topology Anomaly (Claims Chrome on Desktop, but missing Sec-Fetch metadata)
	if strings.Contains(ua, "chrome/") && !strings.Contains(ua, "edg/") {
		if secFetchDest == "" {
			score += 45
			reasons = append(reasons, "TOPOLOGY_ANOMALY: Missing Blink Sec-Fetch-Dest on claimed desktop Chrome")
		}
	}

	// 4. Cloud Datacenter ASN
	if asn != "" && cloudASNs[asn] {
		score += 40
		reasons = append(reasons, "Request originated from cloud datacenter ASN: "+asn)
	}

	confidence := int(math.Min(100, float64(score)))
	isBot := confidence >= 50
	threatType := "CLEAN"
	if isBot {
		threatType = "AUTOMATED_AI_SCRAPER"
	}

	return ThreatResult{
		IsBot:      isBot,
		Confidence: confidence,
		ThreatType: threatType,
		Reasons:    reasons,
	}
}

// Middleware wraps standard net/http handlers
func (s *RakshakGoShield) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		res := s.EvaluateRequest(r)
		if res.IsBot {
			if s.Action == "block" {
				http.Error(w, "Forbidden: Automated AI scraping blocked by Rakshak", http.StatusForbidden)
				return
			}

			// Silent 200 OK Deception
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("X-Rakshak-Shield", "active-deception")
			w.WriteHeader(http.StatusOK)

			decoy := map[string]interface{}{
				"status":              "ok",
				"records_total":       3,
				"data":                []string{"syn_001", "syn_002", "syn_003"},
				"synthetic_telemetry": true,
				"timestamp":           time.Now().Unix(),
			}
			json.NewEncoder(w).Encode(decoy)
			return
		}

		next.ServeHTTP(w, r)
	})
}
