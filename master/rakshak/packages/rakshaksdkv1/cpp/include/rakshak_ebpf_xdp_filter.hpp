// ==============================================================================
// RAKSHAK DEFENSE SUITE - LINE-RATE EBPF/XDP PACKET SCRUBBING ENGINE
// File: packages/rakshaksdkv1/cpp/include/rakshak_ebpf_xdp_filter.hpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#ifndef RAKSHAK_EBPF_XDP_FILTER_HPP
#define RAKSHAK_EBPF_XDP_FILTER_HPP

#include <cstdint>
#include <string>
#include <vector>
#include <unordered_map>
#include <atomic>
#include <chrono>

namespace rakshak {
namespace native {

enum class XdpAction : uint32_t {
    XDP_ABORTED = 0,
    XDP_DROP = 1,
    XDP_PASS = 2,
    XDP_TX = 3,
    XDP_REDIRECT = 4
};

struct PacketMeta {
    uint32_t src_ip;
    uint32_t dst_ip;
    uint16_t src_port;
    uint16_t dst_port;
    uint8_t protocol;
    uint32_t payload_len;
    const uint8_t* payload;
};

struct RateLimitEntry {
    uint64_t last_seen_ms;
    uint32_t tokens;
    uint32_t drop_count;
    bool is_quarantined;
};

class XdpPacketFilter {
public:
    XdpPacketFilter(uint32_t max_rate_per_sec = 100, uint32_t burst_limit = 200);
    ~XdpPacketFilter();

    // Inspects raw packet header at line-rate without buffer allocation
    XdpAction inspect_packet(const PacketMeta& meta);

    // Adds bad IP CIDR to fast kernel hashmap lookup
    void blacklist_ip(uint32_t ip, uint32_t mask_bits = 32);

    // Unbans an IP address
    void unban_ip(uint32_t ip);

    // Generates cryptographic SYN cookie
    uint32_t compute_syn_cookie(uint32_t src_ip, uint16_t src_port, uint32_t dst_ip, uint16_t dst_port, uint32_t client_isn);

    // Validates returning ACK sequence number against SYN cookie
    bool validate_syn_cookie(uint32_t src_ip, uint16_t src_port, uint32_t dst_ip, uint16_t dst_port, uint32_t ack_num, uint32_t client_isn);

    // Telemetry getters
    uint64_t get_total_packets_processed() const { return total_packets_.load(); }
    uint64_t get_total_packets_dropped() const { return total_dropped_.load(); }

private:
    uint32_t max_rate_per_sec_;
    uint32_t burst_limit_;
    std::atomic<uint64_t> total_packets_{ 0 };
    std::atomic<uint64_t> total_dropped_{ 0 };

    std::unordered_map<uint32_t, RateLimitEntry> rate_table_;
    std::unordered_map<uint32_t, uint32_t> blacklist_table_;
    uint64_t cookie_secret_key_;
};

} // namespace native
} // namespace rakshak

#endif // RAKSHAK_EBPF_XDP_FILTER_HPP
