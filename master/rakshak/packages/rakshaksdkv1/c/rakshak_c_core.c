#include "rakshak_c_core.h"
#include <string.h>
#include <math.h>

static const int CLOUD_ASNS[] = {
    16509, 14618, 15169, 396982, 8075, 8074, 12076, 24940, 14061, 31898, 13335
};

static bool is_known_cloud_asn(int asn) {
    size_t count = sizeof(CLOUD_ASNS) / sizeof(CLOUD_ASNS[0]);
    for (size_t i = 0; i < count; ++i) {
        if (CLOUD_ASNS[i] == asn) return true;
    }
    return false;
}

double rakshak_c_shannon_entropy(const uint8_t* stream, size_t length) {
    if (!stream || length == 0) return 0.0;

    uint32_t counts[256] = {0};
    for (size_t i = 0; i < length; ++i) {
        counts[stream[i]]++;
    }

    double entropy = 0.0;
    double inv_len = 1.0 / (double)length;

    for (int i = 0; i < 256; ++i) {
        if (counts[i] > 0) {
            double p = (double)counts[i] * inv_len;
            entropy -= p * (log(p) / log(2.0));
        }
    }
    return entropy;
}

rakshak_c_eval_t rakshak_c_evaluate(
    const char* user_agent,
    const char* sec_ch_ua,
    const char* sec_fetch_dest,
    int asn_number
) {
    rakshak_c_eval_t res = {0.0, false, 0, "CLEAN_TRAFFIC"};

    if (!user_agent) user_agent = "";
    if (!sec_ch_ua) sec_ch_ua = "";
    if (!sec_fetch_dest) sec_fetch_dest = "";

    // 1. Check AI Crawler signatures
    if (strstr(user_agent, "ClaudeBot") || strstr(user_agent, "GPTBot") || strstr(user_agent, "PerplexityBot")) {
        res.is_bot = true;
        res.confidence_score = 99;
        res.flag_reason = "CONFIRMED_LLM_CRAWLER_SIGNATURE";
        return res;
    }

    // 2. Headless signature
    if (strstr(sec_ch_ua, "Headless") || strstr(user_agent, "HeadlessChrome")) {
        res.is_bot = true;
        res.confidence_score = 90;
        res.flag_reason = "HEADLESS_BROWSER_AUTOMATION";
        return res;
    }

    // 3. Topology Anomaly: Claims Chrome on desktop, but Sec-Fetch-Dest missing
    if (strstr(user_agent, "Chrome/") && !strstr(user_agent, "Edg/")) {
        if (strlen(sec_fetch_dest) == 0) {
            res.is_bot = true;
            res.confidence_score = 80;
            res.flag_reason = "MISSING_SEC_FETCH_DEST_TOPOLOGY_ANOMALY";
            return res;
        }
    }

    // 4. Cloud Datacenter ASN
    if (is_known_cloud_asn(asn_number)) {
        res.is_bot = true;
        res.confidence_score = 65;
        res.flag_reason = "CLOUD_DATACENTER_IP_TRAFFIC";
        return res;
    }

    return res;
}

int rakshak_c_inject_canary(
    const char* src_text,
    const char* canary_tag,
    char* dest_buffer,
    size_t dest_capacity
) {
    if (!src_text || !canary_tag || !dest_buffer || dest_capacity == 0) return -1;

    size_t src_len = strlen(src_text);
    size_t canary_len = strlen(canary_tag);
    size_t required = src_len + (canary_len * 8 * 3) + 1; // 3 bytes per zero-width character

    if (dest_capacity < required) return -2; // Buffer overflow prevention

    // Copy prefix until first space
    const char* space = strchr(src_text, ' ');
    if (!space) {
        strcpy(dest_buffer, src_text);
        return (int)src_len;
    }

    size_t prefix_len = (size_t)(space - src_text) + 1;
    memcpy(dest_buffer, src_text, prefix_len);
    char* ptr = dest_buffer + prefix_len;

    // Inject binary zero-width stream
    for (size_t i = 0; i < canary_len; ++i) {
        uint8_t byte = (uint8_t)canary_tag[i];
        for (int b = 7; b >= 0; --b) {
            if ((byte >> b) & 1) {
                // U+200C: 0xE2 0x80 0x8C
                *ptr++ = (char)0xE2;
                *ptr++ = (char)0x80;
                *ptr++ = (char)0x8C;
            } else {
                // U+200B: 0xE2 0x80 0x8B
                *ptr++ = (char)0xE2;
                *ptr++ = (char)0x80;
                *ptr++ = (char)0x8B;
            }
        }
    }

    // Copy remaining suffix
    strcpy(ptr, space + 1);
    return (int)strlen(dest_buffer);
}
