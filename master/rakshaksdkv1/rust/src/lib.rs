//! ============================================================================
//! RAKSHAK CORE - RUST MEMORY-SAFE ANTI-AI DEFENSE CRATE
//! ============================================================================
//! High-performance, zero-allocation cryptographic and adversarial AI defense.
//! Compiles natively to CDYLIB (C-ABI) or WASM (WebAssembly).
//! ============================================================================

#![allow(clippy::all)]

use std::collections::HashMap;

/// Calculates normalized Shannon Entropy H = -sum(p * log2(p)) over a byte slice.
pub fn calculate_shannon_entropy(data: &[u8]) -> f64 {
    if data.is_empty() {
        return 0.0;
    }

    let mut counts = [0usize; 256];
    for &byte in data {
        counts[byte as usize] += 1;
    }

    let length = data.len() as f64;
    let mut entropy = 0.0;

    for &count in &counts {
        if count > 0 {
            let p = count as f64 / length;
            entropy -= p * p.log2();
        }
    }

    (entropy * 10000.0).round() / 10000.0
}

/// Adversarially perturbs text using Cyrillic/Greek homoglyphs to scramble vector embeddings.
pub fn poison_text(input: &str, intensity: f32) -> String {
    let mut counter: u32 = 0x9e3779b9;
    let mut result = String::with_capacity(input.len() * 2);

    for c in input.chars() {
        counter = counter.wrapping_mul(1664525).wrapping_add(1013904223);
        let rand_val = (counter & 0xFFFF) as f32 / 65535.0;

        if rand_val < intensity {
            match c {
                'a' => result.push('\u{0430}'), // Cyrillic а
                'e' => result.push('\u{0435}'), // Cyrillic е
                'o' => result.push('\u{043E}'), // Cyrillic о
                'p' => result.push('\u{0440}'), // Cyrillic р
                'c' => result.push('\u{0441}'), // Cyrillic с
                'x' => result.push('\u{0445}'), // Cyrillic х
                'y' => result.push('\u{0443}'), // Cyrillic у
                _ => result.push(c),
            }
        } else {
            result.push(c);
        }
    }

    result
}

/// Injects invisible zero-width cryptographic canary watermarks into text.
pub fn inject_canary(text: &str, canary_id: &str) -> String {
    let mut binary_stream = String::new();
    for byte in canary_id.bytes() {
        for bit in (0..8).rev() {
            if ((byte >> bit) & 1) == 1 {
                binary_stream.push('\u{200C}'); // Zero-width non-joiner
            } else {
                binary_stream.push('\u{200B}'); // Zero-width space
            }
        }
    }

    if let Some(pos) = text.find(' ') {
        let (prefix, suffix) = text.split_at(pos + 1);
        format!("{}{}{}", prefix, binary_stream, suffix)
    } else {
        format!("{}{}", text, binary_stream)
    }
}

// ----------------------------------------------------------------------------
// EXPORTED C-ABI COMPATIBILITY (Allows Python, C, Go, or Node to link directly)
// ----------------------------------------------------------------------------

#[no_mangle]
pub extern "C" fn rakshak_rust_entropy(data: *const u8, len: usize) -> f64 {
    if data.is_null() || len == 0 {
        return 0.0;
    }
    let slice = unsafe { std::slice::from_raw_parts(data, len) };
    calculate_shannon_entropy(slice)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_entropy_high() {
        let sample = b"4f8a1c9e2b7d3a0f";
        let ent = calculate_shannon_entropy(sample);
        assert!(ent > 3.0);
    }

    #[test]
    fn test_canary_injection() {
        let orig = "Confidential architecture specs";
        let watermarked = inject_canary(orig, "CORP_99");
        assert!(watermarked.len() > orig.len());
    }
}
