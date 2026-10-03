#include "rsk_runtime.h"
#include <string.h>

static const int CLOUD_ASNS[] = {
    16509, 14618, 15169, 396982, 8075, 8074, 12076, 24940, 14061, 31898, 13335
};

static bool is_datacenter_asn(int asn) {
    size_t count = sizeof(CLOUD_ASNS) / sizeof(CLOUD_ASNS[0]);
    for (size_t i = 0; i < count; ++i) {
        if (CLOUD_ASNS[i] == asn) return true;
    }
    return false;
}

int rsk_vm_init(rsk_vm_t* vm, const uint8_t* bytecode, size_t length) {
    if (!vm || !bytecode || length < 4) return -1;

    // Check magic "RSK\x01"
    if (bytecode[0] != 0x52 || bytecode[1] != 0x53 || bytecode[2] != 0x4B || bytecode[3] != 0x01) {
        return -2; // Bad magic
    }

    memset(vm, 0, sizeof(rsk_vm_t));
    vm->bytecode = bytecode;
    vm->length = length;
    vm->default_defense = RSK_ACTION_DECEIVE; // Default
    vm->min_waterfall_ratio = 0.25;
    vm->min_entropy = 1.8;
    vm->max_jitter_ms = 65;

    size_t ip = 4;
    while (ip < length) {
        uint8_t op = bytecode[ip++];
        if (op == 0xFF) break; // OP_HALT

        switch (op) {
            case 0x01: { // OP_TARGET_PATH
                if (ip >= length) return -3;
                uint8_t l = bytecode[ip++];
                ip += l; // Skip target string in embedded C parser
                break;
            }
            case 0x02: // OP_TRAP_DEBUGGER
                vm->trap_debugger = true;
                break;
            case 0x03: // OP_BLOCK_CLOUD_ASN
                vm->block_cloud_asns = true;
                break;
            case 0x04: // OP_VERIFY_TOPOLOGY
                vm->verify_topology = true;
                break;
            case 0x05: { // OP_REQUIRE_WATERFALL
                if (ip >= length) return -3;
                vm->require_waterfall = true;
                vm->min_waterfall_ratio = (double)bytecode[ip++] / 100.0;
                break;
            }
            case 0x06: { // OP_ENTROPY_BOUND
                if (ip >= length) return -3;
                vm->min_entropy = (double)bytecode[ip++] / 10.0;
                break;
            }
            case 0x07: { // OP_CLOCKWORK_JITTER
                if (ip >= length) return -3;
                vm->max_jitter_ms = (int)bytecode[ip++];
                break;
            }
            case 0x08: // OP_MODE_DECEIVE
                vm->default_defense = RSK_ACTION_DECEIVE;
                break;
            case 0x09: // OP_MODE_BLOCK
                vm->default_defense = RSK_ACTION_BLOCK;
                break;
            case 0x0A: { // OP_ADVERSARIAL_RATE
                if (ip >= length) return -3;
                ip++; // Skip rate byte
                break;
            }
            case 0x0B: { // OP_INJECT_CANARY
                if (ip >= length) return -3;
                uint8_t l = bytecode[ip++];
                if (l < sizeof(vm->canary_id)) {
                    memcpy(vm->canary_id, &bytecode[ip], l);
                    vm->canary_id[l] = '\0';
                }
                ip += l;
                break;
            }
            case 0x0C: { // OP_SYNTHESIZE_DECOY
                if (ip >= length) return -3;
                uint8_t l = bytecode[ip++];
                if (l < sizeof(vm->decoy_topic)) {
                    memcpy(vm->decoy_topic, &bytecode[ip], l);
                    vm->decoy_topic[l] = '\0';
                }
                ip += l;
                break;
            }
            default:
                break;
        }
    }
    return 0;
}

rsk_decision_t rsk_vm_execute(
    rsk_vm_t* vm,
    const char* user_agent,
    const char* sec_fetch_dest,
    int subresource_count,
    int document_count,
    int asn_number
) {
    rsk_decision_t res = {RSK_ACTION_ALLOW, 200, 0, "CLEAN_TRAFFIC", vm->canary_id, vm->decoy_topic};

    if (!vm || !user_agent) return res;
    if (!sec_fetch_dest) sec_fetch_dest = "";

    bool violation = false;
    int confidence = 0;
    const char* reason = "INVARIANT_MET";

    // 1. Signature check
    if (strstr(user_agent, "ClaudeBot") || strstr(user_agent, "GPTBot") || strstr(user_agent, "PerplexityBot")) {
        violation = true;
        confidence = 99;
        reason = "KNOWN_AI_CRAWLER_SIGNATURE";
    }

    // 2. Headless automation check
    if (!violation && strstr(user_agent, "HeadlessChrome")) {
        violation = true;
        confidence = 90;
        reason = "HEADLESS_BROWSER_AUTOMATION";
    }

    // 3. Topology check
    if (!violation && vm->verify_topology && strstr(user_agent, "Chrome/") && !strstr(user_agent, "Edg/")) {
        if (strlen(sec_fetch_dest) == 0) {
            violation = true;
            confidence = 85;
            reason = "MISSING_SEC_FETCH_DEST_INVARIANT_BREACH";
        }
    }

    // 4. Asset Waterfall Invariant check
    if (!violation && vm->require_waterfall && document_count >= 4 && subresource_count == 0) {
        violation = true;
        confidence = 95;
        reason = "ZERO_ASSET_WATERFALL_INVARIANT_BREACH";
    }

    // 5. Cloud Datacenter ASN check
    if (!violation && vm->block_cloud_asns && is_datacenter_asn(asn_number)) {
        violation = true;
        confidence = 70;
        reason = "CLOUD_DATACENTER_ASN_INVARIANT_BREACH";
    }

    if (violation) {
        res.confidence = confidence;
        res.reason = reason;
        if (vm->default_defense == RSK_ACTION_BLOCK) {
            res.action = RSK_ACTION_BLOCK;
            res.http_status = 403;
        } else {
            res.action = RSK_ACTION_DECEIVE;
            res.http_status = 200; // Silent 200 OK Deception
        }
    }

    return res;
}
