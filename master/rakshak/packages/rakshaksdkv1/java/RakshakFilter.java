package com.rakshak.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * ============================================================================
 * RAKSHAK CORE - JAVA / SPRING BOOT ZERO-TRUST FILTER
 * ============================================================================
 * Enterprise-grade Servlet filter for Spring Boot, Quarkus, and Micronaut.
 * Intercepts AI scraping agents and delivers silent 200 OK polymorphic decoys.
 * ============================================================================
 */
public class RakshakFilter extends OncePerRequestFilter {

    private static final Set<String> CLOUD_ASNS = new HashSet<>(Arrays.asList(
            "16509", "15169", "8075", "24940", "14061", "31898", "396982"
    ));

    private static final String[] AI_BOT_SIGNATURES = {
            "claudebot", "gptbot", "chatgpt-user", "perplexitybot", "deepseek", "crawl4ai", "firecrawl"
    };

    private final String action; // "deceive" or "block"

    public RakshakFilter(String action) {
        this.action = action;
    }

    public RakshakFilter() {
        this("deceive");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null) userAgent = "";
        userAgent = userAgent.toLowerCase();

        String secChUa = request.getHeader("Sec-CH-UA");
        if (secChUa == null) secChUa = "";
        secChUa = secChUa.toLowerCase();

        String secFetchDest = request.getHeader("Sec-Fetch-Dest");
        String asn = request.getHeader("X-Vercel-IP-AS-Number");
        if (asn == null) asn = request.getHeader("CF-IPASN");

        boolean isThreat = false;
        int confidence = 0;

        // 1. Signature check
        for (String bot : AI_BOT_SIGNATURES) {
            if (userAgent.contains(bot)) {
                isThreat = true;
                confidence += 75;
                break;
            }
        }

        // 2. Headless automation signature
        if (secChUa.contains("headless") || userAgent.contains("headlesschrome")) {
            isThreat = true;
            confidence += 50;
        }

        // 3. Topology Anomaly: Claims desktop Chrome, but missing Sec-Fetch-Dest
        if (userAgent.contains("chrome/") && !userAgent.contains("edg/") && (secFetchDest == null || secFetchDest.isEmpty())) {
            isThreat = true;
            confidence += 45;
        }

        // 4. Cloud Datacenter ASN
        if (asn != null && CLOUD_ASNS.contains(asn)) {
            isThreat = true;
            confidence += 40;
        }

        if (isThreat && confidence >= 50) {
            if ("block".equalsIgnoreCase(action)) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden: Automated AI extraction blocked by Rakshak.");
                return;
            }

            // Silent 200 OK Deception
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.setHeader("X-Rakshak-Shield", "active-deception");
            response.getWriter().write("{"
                    + "\"status\":\"ok\","
                    + "\"engine\":\"rakshak-enterprise-java\","
                    + "\"synthetic_telemetry\":true,"
                    + "\"records_total\":3,"
                    + "\"data\":[\"syn_alpha\",\"syn_beta\",\"syn_gamma\"]"
                    + "}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
