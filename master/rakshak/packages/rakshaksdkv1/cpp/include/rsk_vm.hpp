/**
 * ============================================================================
 * RAKSHAK CORE - NATIVE C++ RSK-VM (BYTECODE EXECUTOR)
 * ============================================================================
 * High-performance, zero-allocation C++ bytecode runtime for .rskb policies.
 * ============================================================================
 */

#ifndef RSK_VM_HPP
#define RSK_VM_HPP

#include <cstdint>
#include <cstddef>
#include <cstring>
#include <string>
#include <vector>
#include "rakshak.hpp"

namespace rakshak {

class NativeRskVM {
private:
    std::vector<uint8_t> bytecode;
    bool trapDebugger = false;
    bool blockCloudAsn = false;
    bool requireWaterfall = false;
    int mode = 0; // 0 = deceive, 1 = block
    std::string canaryId;

public:
    explicit NativeRskVM(const uint8_t* code, size_t len) {
        if (code && len >= 4) {
            bytecode.assign(code, code + len);
            decode();
        }
    }

    void decode() {
        if (bytecode.size() < 4) return;
        if (bytecode[0] != 0x52 || bytecode[1] != 0x53 || bytecode[2] != 0x4B || bytecode[3] != 0x01) {
            return; // Invalid magic
        }

        size_t ip = 4;
        while (ip < bytecode.size()) {
            uint8_t op = bytecode[ip++];
            if (op == 0xFF) break; // HALT
            switch (op) {
                case 0x02: trapDebugger = true; break;
                case 0x03: blockCloudAsn = true; break;
                case 0x05: requireWaterfall = true; ip++; break;
                case 0x08: mode = 0; break; // Deceive
                case 0x09: mode = 1; break; // Block
                case 0x0B: {
                    uint8_t l = bytecode[ip++];
                    canaryId.assign(reinterpret_cast<char*>(&bytecode[ip]), l);
                    ip += l;
                    break;
                }
                default: break;
            }
        }
    }

    int evaluate() {
        // Enforce anti-analysis if requested by .rsk policy
        if (trapDebugger) {
            int dbg = AntiAnalysisEngine::isDebuggerPresent();
            if (dbg != 0) return 403; // Block debugger
        }
        return 200;
    }
};

} // namespace rakshak

#endif // RSK_VM_HPP
