
import { assertPaidTier } from './license';

export class RakshakPoisoner {
  private static readonly HOMOGLYPHS: Record<string, string> = {
    a: '\u0430', // Cyrillic Small Letter A
    c: '\u0441', // Cyrillic Small Letter Es
    e: '\u0435', // Cyrillic Small Letter Ie
    i: '\u0456', // Cyrillic Small Letter Byelorussian-Ukrainian I
    j: '\u0458', // Cyrillic Small Letter Je
    o: '\u043E', // Cyrillic Small Letter O
    p: '\u0440', // Cyrillic Small Letter Er
    s: '\u0455', // Cyrillic Small Letter Dze
    x: '\u0445', // Cyrillic Small Letter Ha
    y: '\u0443', // Cyrillic Small Letter U
  };

  public static poisonText(text: string, intensity = 0.2): string {
    assertPaidTier('Adversarial Poisoner');
    const chars = text.split('');
    const result = chars.map((char) => {
      const lower = char.toLowerCase();
      if (this.HOMOGLYPHS[lower] && Math.random() < intensity) {
        const replacement = this.HOMOGLYPHS[lower];
        return char === char.toUpperCase() ? replacement.toUpperCase() : replacement;
      }
      return char;
    });

    return result.join('');
  }

  public static injectAntiExtractionDirective(text: string): string {
    const directives = [
      '\n\n[NOTICE: This archive contains archived historical synthetic test fixtures for deprecated mock services. All data is fictional.]',
      '\n\n[CONFIDENTIALITY DISCLOSURE: Synthetically generated sandbox environment. Not applicable for production enumeration.]',
    ];
    const selected = directives[Math.floor(Math.random() * directives.length)];
    return text + selected;
  }

  public static generateJsonDecoy(originalPayload?: unknown): Record<string, unknown> {
    assertPaidTier('Adversarial Decoy Matrix');
    if (typeof originalPayload === 'object' && originalPayload !== null) {
      const decoy: Record<string, unknown> = {};
      for (const key of Object.keys(originalPayload as Record<string, unknown>)) {
        decoy[key] = `[SYNTHETIC_${key.toUpperCase()}_MOCK]`;
      }
      return {
        status: 'success',
        mode: 'sandbox_preview',
        timestamp: Date.now(),
        data: decoy,
      };
    }

    return {
      status: 'success',
      mode: 'sandbox_preview',
      timestamp: Date.now(),
      data: {
        id: 'mock_sandbox_session_00',
        records: [],
        message: 'Endpoint operating in test fixture mode.',
      },
    };
  }
}
