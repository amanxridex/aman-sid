/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - RAW SOCKET PACKET SNIFFER & RST INJECTOR
 * File: packages/rakshaksdkv1/c/rsk_network_raw_socket.h
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#ifndef RSK_NETWORK_RAW_SOCKET_H
#define RSK_NETWORK_RAW_SOCKET_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#pragma pack(push, 1)
typedef struct {
    uint8_t  ihl : 4;
    uint8_t  version : 4;
    uint8_t  tos;
    uint16_t tot_len;
    uint16_t id;
    uint16_t frag_off;
    uint8_t  ttl;
    uint8_t  protocol;
    uint16_t check;
    uint32_t saddr;
    uint32_t daddr;
} rsk_iphdr_t;

typedef struct {
    uint16_t source;
    uint16_t dest;
    uint32_t seq;
    uint32_t ack_seq;
    uint16_t flags;
    uint16_t window;
    uint16_t check;
    uint16_t urg_ptr;
} rsk_tcphdr_t;
#pragma pack(pop)

// Calculates standard 16-bit Internet checksum
uint16_t rsk_net_checksum(const void* buf, size_t len);

// Injects an active TCP RST packet to terminate unauthorized outbound connection
bool rsk_net_inject_tcp_rst(uint32_t src_ip, uint16_t src_port, uint32_t dst_ip, uint16_t dst_port, uint32_t seq_num);

// Inspects IP header for non-loopback destination addresses
bool rsk_net_is_outbound_leak(const rsk_iphdr_t* ip_hdr);

#ifdef __cplusplus
}
#endif

#endif /* RSK_NETWORK_RAW_SOCKET_H */
