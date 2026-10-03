// ==============================================================================
// RAKSHAK DEFENSE SUITE - TLS CLIENT HELLO FINGERPRINT (JA3/JA4) GUARD
// File: packages/rakshaksdkv1/cpp/include/rakshak_tls_traffic_guard.hpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#ifndef RAKSHAK_TLS_TRAFFIC_GUARD_HPP
#define RAKSHAK_TLS_TRAFFIC_GUARD_HPP

#include <cstdint>
#include <string>
#include <vector>
#include <unordered_set>

namespace rakshak {
namespace native {

struct TlsClientHelloInfo {
    uint16_t tls_version;
    std::vector<uint16_t> cipher_suites;
    std::vector<uint16_t> extensions;
    std::vector<uint16_t> elliptic_curves;
    std::vector<uint8_t> ec_point_formats;
    std::string sni_hostname;
    std::string alpn_protocol;
};

struct Ja3FingerprintResult {
    std::string ja3_string;
    std::string ja3_hash_md5;
    std::string ja4_string;
    bool is_known_scraper;
    bool is_headless_browser;
    std::string matched_bot_family;
};

class TlsTrafficGuard {
public:
    TlsTrafficGuard();
    ~TlsTrafficGuard();

    // Parses raw TLS Client Hello record bytes
    bool parse_client_hello(const uint8_t* record_bytes, size_t length, TlsClientHelloInfo& out_info);

    // Computes JA3 and JA4 fingerprint hashes
    Ja3FingerprintResult evaluate_tls_fingerprint(const TlsClientHelloInfo& info);

    // Adds malicious bot JA3 MD5 hashes to high-speed lookup set
    void register_scraper_signature(const std::string& ja3_md5, const std::string& family_name);

private:
    std::unordered_set<std::string> known_scraper_ja3_;
};

} // namespace native
} // namespace rakshak

#endif // RAKSHAK_TLS_TRAFFIC_GUARD_HPP
