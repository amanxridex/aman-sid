// ==============================================================================
// RAKSHAK DEFENSE SUITE - LINE-RATE EBPF/XDP PACKET SCRUBBING ENGINE
// File: packages/rakshaksdkv1/cpp/src/rakshak_ebpf_xdp_filter.cpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#include "rakshak_ebpf_xdp_filter.hpp"
#include <random>
#include <chrono>
#include <cstring>

namespace rakshak {
namespace native {

static uint64_t current_time_millis() {
    return std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::steady_clock::now().time_since_epoch()).count();
}

XdpPacketFilter::XdpPacketFilter(uint32_t max_rate_per_sec, uint32_t burst_limit)
    : max_rate_per_sec_(max_rate_per_sec), burst_limit_(burst_limit) {
    std::random_device rd;
    std::mt19937_64 gen(rd());
    cookie_secret_key_ = gen();
}

XdpPacketFilter::~XdpPacketFilter() = default;

void XdpPacketFilter::blacklist_ip(uint32_t ip, uint32_t mask_bits) {
    uint32_t mask = (mask_bits == 0) ? 0 : (~0U << (32 - mask_bits));
    blacklist_table_[ip & mask] = mask;
}

void XdpPacketFilter::unban_ip(uint32_t ip) {
    blacklist_table_.erase(ip);
    rate_table_.erase(ip);
}

XdpAction XdpPacketFilter::inspect_packet(const PacketMeta& meta) {
    total_packets_.fetch_add(1, std::memory_order_relaxed);

    // Fast check: Blacklist table
    for (const auto& kv : blacklist_table_) {
        if ((meta.src_ip & kv.second) == kv.first) {
            total_dropped_.fetch_add(1, std::memory_order_relaxed);
            return XdpAction::XDP_DROP;
        }
    }

    uint64_t now = current_time_millis();
    auto& entry = rate_table_[meta.src_ip];

    if (entry.is_quarantined) {
        if (now - entry.last_seen_ms < 60000) { // 60s quarantine window
            total_dropped_.fetch_add(1, std::memory_order_relaxed);
            return XdpAction::XDP_DROP;
        }
        entry.is_quarantined = false;
        entry.tokens = burst_limit_;
        entry.drop_count = 0;
    }

    // Token bucket replenish
    uint64_t elapsed_ms = now - entry.last_seen_ms;
    if (elapsed_ms > 0) {
        uint32_t replenish = static_cast<uint32_t>((elapsed_ms * max_rate_per_sec_) / 1000);
        if (replenish > 0) {
            entry.tokens = std::min(burst_limit_, entry.tokens + replenish);
            entry.last_seen_ms = now;
        }
    }

    if (entry.tokens > 0) {
        entry.tokens--;
        return XdpAction::XDP_PASS;
    } else {
        entry.drop_count++;
        if (entry.drop_count > 50) {
            entry.is_quarantined = true;
        }
        total_dropped_.fetch_add(1, std::memory_order_relaxed);
        return XdpAction::XDP_DROP;
    }
}

uint32_t XdpPacketFilter::compute_syn_cookie(uint32_t src_ip, uint16_t src_port, uint32_t dst_ip, uint16_t dst_port, uint32_t client_isn) {
    // 32-bit SipHash-derived SYN Cookie with secret key
    uint64_t h = cookie_secret_key_;
    h ^= (static_cast<uint64_t>(src_ip) << 32) | dst_ip;
    h = (h << 13) | (h >> 51);
    h ^= (static_cast<uint64_t>(src_port) << 16) | dst_port;
    h ^= client_isn;

    // FNV mix
    h ^= (h >> 33);
    h *= 0xff51afd7ed558ccdULL;
    h ^= (h >> 33);

    return static_cast<uint32_t>(h ^ (h >> 32));
}

bool XdpPacketFilter::validate_syn_cookie(uint32_t src_ip, uint16_t src_port, uint32_t dst_ip, uint16_t dst_port, uint32_t ack_num, uint32_t client_isn) {
    uint32_t expected_cookie = compute_syn_cookie(src_ip, src_port, dst_ip, dst_port, client_isn);
    // TCP ACK sequence number must be expected_cookie + 1
    return (ack_num == expected_cookie + 1);
}

} // namespace native
} // namespace rakshak
