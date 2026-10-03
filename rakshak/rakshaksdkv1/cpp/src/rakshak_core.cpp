#define RAKSHAK_EXPORTS
#include "../include/rakshak.hpp"

// Standalone C++ entry point and test runner
#include <iostream>

int main(int argc, char** argv) {
    std::cout << "====================================================\n";
    std::cout << "  RAKSHAK C++ NATIVE DEFENSE ENGINE (v1.0)\n";
    std::cout << "  Kernel & Low-Level Binary Threat Interceptor\n";
    std::cout << "====================================================\n";

    // 1. Anti-Analysis Check
    int debugStatus = rakshak_anti_analysis_check();
    std::cout << "[INFO] Anti-Analysis Defense: " 
              << (debugStatus == 0 ? "CLEAR (No debugger attached)" : "ALERT: Debugger detected!") 
              << "\n";

    // 2. Shannon Entropy Test
    const char* sample = "4f8a1c9e2b7d3a0f";
    double entropy = rakshak_compute_shannon_entropy(sample, std::strlen(sample));
    std::cout << "[INFO] Shannon Entropy of '" << sample << "': " << entropy << " bits/symbol\n";

    // 3. Canary Stego Test
    char buffer[4096];
    int len = rakshak_embed_canary("Internal research documentation regarding proprietary weights.", "CORP_ID_9921", buffer, sizeof(buffer));
    std::cout << "[INFO] Steganographic Canary embedded (len=" << len << " bytes)\n";

    char extracted[256];
    rakshak_extract_canary(buffer, extracted, sizeof(extracted));
    std::cout << "[INFO] Extracted Forensic Canary: " << extracted << "\n";

    // 4. Adversarial Token Poisoning
    char poisoned[4096];
    rakshak_poison_tokens("This database contains secret revenue numbers and patents.", poisoned, sizeof(poisoned), 0.35f);
    std::cout << "[INFO] Adversarially Perturbed Stream: " << poisoned << "\n";

    std::cout << "====================================================\n";
    std::cout << "Engine ready for Python C-FFI / Native Linkage.\n";
    return 0;
}
