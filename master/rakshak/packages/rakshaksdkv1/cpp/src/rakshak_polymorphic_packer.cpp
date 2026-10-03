// ==============================================================================
// RAKSHAK DEFENSE SUITE - POLYMORPHIC PACKER & CODE MUTATION ENGINE
// File: packages/rakshaksdkv1/cpp/src/rakshak_polymorphic_packer.cpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#include "rakshak_polymorphic_packer.hpp"
#include <chrono>

namespace rakshak {
namespace native {

PolymorphicPacker::PolymorphicPacker() {
    auto now = std::chrono::high_resolution_clock::now().time_since_epoch().count();
    prng_state_ = static_cast<uint32_t>(now ^ 0x5A5A5A5AU);
}

PolymorphicPacker::~PolymorphicPacker() = default;

uint32_t PolymorphicPacker::next_random() {
    // Xorshift32 PRNG
    prng_state_ ^= prng_state_ << 13;
    prng_state_ ^= prng_state_ >> 17;
    prng_state_ ^= prng_state_ << 5;
    return prng_state_;
}

uint8_t PolymorphicPacker::select_random_register(uint8_t excluded_reg) {
    uint8_t reg;
    do {
        reg = static_cast<uint8_t>(next_random() % 8);
    } while (reg == excluded_reg || reg == 4 || reg == 5); // Exclude RSP (4) and RBP (5)
    return reg;
}

void PolymorphicPacker::insert_junk_instructions(std::vector<uint8_t>& buffer, size_t count) {
    // Variety of 1-byte, 2-byte, and 3-byte safe junk instructions
    for (size_t i = 0; i < count; ++i) {
        uint32_t choice = next_random() % 5;
        switch (choice) {
            case 0:
                buffer.push_back(0x90); // nop
                break;
            case 1:
                buffer.push_back(0x87); // xchg eax, eax
                buffer.push_back(0xC0);
                break;
            case 2:
                buffer.push_back(0x8D); // lea eax, [eax+0]
                buffer.push_back(0x40);
                buffer.push_back(0x00);
                break;
            case 3:
                buffer.push_back(0xF8); // clc (clear carry flag)
                break;
            case 4:
                buffer.push_back(0xFC); // cld (clear direction flag)
                break;
        }
    }
}

std::vector<uint8_t> PolymorphicPacker::generate_decryptor_stub(uint32_t key, size_t payload_len) {
    std::vector<uint8_t> stub;

    // Insert entry junk
    insert_junk_instructions(stub, 3);

    // mov ecx, payload_len (B9 [len])
    stub.push_back(0xB9);
    stub.push_back(static_cast<uint8_t>(payload_len & 0xFF));
    stub.push_back(static_cast<uint8_t>((payload_len >> 8) & 0xFF));
    stub.push_back(static_cast<uint8_t>((payload_len >> 16) & 0xFF));
    stub.push_back(static_cast<uint8_t>((payload_len >> 24) & 0xFF));

    insert_junk_instructions(stub, 2);

    // mov edx, key (BA [key])
    stub.push_back(0xBA);
    stub.push_back(static_cast<uint8_t>(key & 0xFF));
    stub.push_back(static_cast<uint8_t>((key >> 8) & 0xFF));
    stub.push_back(static_cast<uint8_t>((key >> 16) & 0xFF));
    stub.push_back(static_cast<uint8_t>((key >> 24) & 0xFF));

    insert_junk_instructions(stub, 4);

    return stub;
}

PackedPayload PolymorphicPacker::pack_binary(const uint8_t* raw_code, size_t raw_len, uint32_t seed) {
    PackedPayload result;
    result.mutation_seed = (seed != 0) ? seed : next_random();
    prng_state_ = result.mutation_seed;

    result.decrypted_stub = generate_decryptor_stub(result.mutation_seed, raw_len);
    result.junk_bytes_count = static_cast<uint32_t>(result.decrypted_stub.size());

    result.encrypted_payload.resize(raw_len);
    uint32_t rolling_key = result.mutation_seed;

    for (size_t i = 0; i < raw_len; ++i) {
        uint8_t key_byte = static_cast<uint8_t>((rolling_key >> ((i % 4) * 8)) & 0xFF);
        result.encrypted_payload[i] = raw_code[i] ^ key_byte;
        rolling_key = (rolling_key * 1103515245U) + 12345U; // LCG step
    }

    return result;
}

} // namespace native
} // namespace rakshak
