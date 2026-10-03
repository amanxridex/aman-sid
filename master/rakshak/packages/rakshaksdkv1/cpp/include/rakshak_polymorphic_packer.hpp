// ==============================================================================
// RAKSHAK DEFENSE SUITE - POLYMORPHIC PACKER & CODE MUTATION ENGINE
// File: packages/rakshaksdkv1/cpp/include/rakshak_polymorphic_packer.hpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#ifndef RAKSHAK_POLYMORPHIC_PACKER_HPP
#define RAKSHAK_POLYMORPHIC_PACKER_HPP

#include <cstdint>
#include <vector>
#include <string>

namespace rakshak {
namespace native {

struct PackedPayload {
    std::vector<uint8_t> decrypted_stub;
    std::vector<uint8_t> encrypted_payload;
    uint32_t mutation_seed;
    uint32_t junk_bytes_count;
};

class PolymorphicPacker {
public:
    PolymorphicPacker();
    ~PolymorphicPacker();

    // Generates mutated polymorphic decryptor stub with random junk instructions
    std::vector<uint8_t> generate_decryptor_stub(uint32_t key, size_t payload_len);

    // Encrypts bytecode with rolling XOR-CBC cipher and embeds polymorphic decryptor
    PackedPayload pack_binary(const uint8_t* raw_code, size_t raw_len, uint32_t seed);

    // Inserts harmless non-functional assembly instructions (NOP sled alternatives)
    void insert_junk_instructions(std::vector<uint8_t>& buffer, size_t count);

    // Substitutes x64 registers randomly across generation
    uint8_t select_random_register(uint8_t excluded_reg);

private:
    uint32_t prng_state_;
    uint32_t next_random();
};

} // namespace native
} // namespace rakshak

#endif // RAKSHAK_POLYMORPHIC_PACKER_HPP
