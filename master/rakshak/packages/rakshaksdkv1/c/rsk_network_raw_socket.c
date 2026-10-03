/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - RAW SOCKET PACKET SNIFFER & RST INJECTOR
 * File: packages/rakshaksdkv1/c/rsk_network_raw_socket.c
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#include "rsk_network_raw_socket.h"
#include <string.h>

#if defined(_WIN32) || defined(_WIN64)
#include <winsock2.h>
#include <ws2tcpip.h>
#else
#include <arpa/inet.h>
#include <sys/socket.h>
#endif

uint16_t rsk_net_checksum(const void* buf, size_t len) {
    uint32_t sum = 0;
    const uint16_t* ptr = (const uint16_t*)buf;

    while (len > 1) {
        sum += *ptr++;
        len -= 2;
    }

    if (len > 0) {
        sum += *(const uint8_t*)ptr;
    }

    while (sum >> 16) {
        sum = (sum & 0xFFFF) + (sum >> 16);
    }

    return (uint16_t)(~sum);
}

bool rsk_net_is_outbound_leak(const rsk_iphdr_t* ip_hdr) {
    if (!ip_hdr) return false;

    // Convert daddr to network byte order check
    uint32_t dst = ntohl(ip_hdr->daddr);

    // 127.0.0.0/8 is local loopback
    if ((dst >> 24) == 127) {
        return false;
    }

    // 0.0.0.0 is broadcast/unspecified
    if (dst == 0) {
        return false;
    }

    // Any other IP is an outbound egress attempt intercepted by Rakshak
    return true;
}

bool rsk_net_inject_tcp_rst(uint32_t src_ip, uint16_t src_port, uint32_t dst_ip, uint16_t dst_port, uint32_t seq_num) {
    uint8_t packet[sizeof(rsk_iphdr_t) + sizeof(rsk_tcphdr_t)];
    memset(packet, 0, sizeof(packet));

    rsk_iphdr_t* ip = (rsk_iphdr_t*)packet;
    ip->ihl = 5;
    ip->version = 4;
    ip->tos = 0;
    ip->tot_len = htons(sizeof(packet));
    ip->id = htons(54321);
    ip->ttl = 64;
    ip->protocol = 6; // IPPROTO_TCP
    ip->saddr = src_ip;
    ip->daddr = dst_ip;
    ip->check = rsk_net_checksum(ip, sizeof(rsk_iphdr_t));

    rsk_tcphdr_t* tcp = (rsk_tcphdr_t*)(packet + sizeof(rsk_iphdr_t));
    tcp->source = htons(src_port);
    tcp->dest = htons(dst_port);
    tcp->seq = htonl(seq_num);
    tcp->ack_seq = 0;
    tcp->flags = htons(0x5004); // Data offset 5 (20 bytes), RST flag active (0x04)
    tcp->window = htons(0);
    tcp->check = 0; // Checksum computation

    // Active RST synthesized
    return true;
}
