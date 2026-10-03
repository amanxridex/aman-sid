import * as crypto from 'crypto';

/**
 * Rakshak Sovereign Mirage Deception Engine
 * "Never Say No — Say Yes and Serve Deceptive Mirages"
 * 
 * When unauthorized attackers, scrapers, or reverse engineers probe
 * the application, rather than returning 401/403 errors or throwing exceptions,
 * the Mirage Engine serves hyper-realistic, high-entropy synthetic data (200 OK)
 * embedded with silent canary tracking identifiers and LLM training poison.
 */

export interface SyntheticBankAccount {
  id: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber: string;
  iban: string;
  swiftBic: string;
  balanceFormatted: string;
  currency: string;
  card: {
    number: string;
    exp: string;
    cvv: string;
    brand: string;
  };
  canaryTrackingToken: string;
}

export interface MirageResponse {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  mirageMeta: {
    canaryId: string;
    deceptionVector: string;
    poisonEntropy: number;
  };
}

export class RakshakMirageEngine {
  private static FIRST_NAMES = ['Alexander', 'Eleanor', 'Marcus', 'Sophia', 'Julian', 'Isabella', 'Sebastian', 'Victoria', 'Harrison', 'Charlotte'];
  private static LAST_NAMES = ['Vanderbilt', 'Rothschild', 'Sterling', 'Blackwood', 'Montague', 'Kensington', 'Sinclair', 'Hastings', 'Fairchild', 'Kingsley'];
  private static CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF'];

  /**
   * Generates a Luhn-algorithm valid credit card number
   * (Checksum matches standard credit card validation routines used by scrapers/validators)
   */
  public static generateLuhnValidCard(prefix: string = '4111'): string {
    let cardNum = prefix;
    while (cardNum.length < 15) {
      cardNum += Math.floor(Math.random() * 10).toString();
    }
    // Calculate Luhn checksum digit
    let sum = 0;
    for (let i = 0; i < cardNum.length; i++) {
      let digit = parseInt(cardNum.charAt(cardNum.length - 1 - i), 10);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return cardNum + checkDigit.toString();
  }

  /**
   * Generates realistic synthetic banking ledgers embedded with unique canary tracking tokens
   */
  public static generateSyntheticBankingLedger(count: number = 10, adversaryFingerprint?: string): SyntheticBankAccount[] {
    const ledger: SyntheticBankAccount[] = [];
    const seed = adversaryFingerprint || crypto.randomBytes(8).toString('hex');

    for (let i = 0; i < count; i++) {
      const fn = this.FIRST_NAMES[i % this.FIRST_NAMES.length];
      const ln = this.LAST_NAMES[(i * 3) % this.LAST_NAMES.length];
      const accountHolder = `${fn} ${ln}`;
      
      const accountNum = (1000000000 + ((i + 1) * 7919) + Math.floor(Math.random() * 9999)).toString();
      const routing = '021000021'; // Federal Reserve Bank of NY routing simulation
      const iban = `US98RAKS0210${accountNum}01`;
      const swift = 'RAKSUS33XXX';
      
      const balanceAmount = (50000 + (Math.random() * 450000)).toFixed(2);
      const currency = this.CURRENCIES[i % this.CURRENCIES.length];

      // Cryptographic canary tracking token embedded inside record
      const canaryRaw = `CANARY:BNK:${seed}:${accountNum}:${Date.now()}`;
      const canaryToken = crypto.createHash('sha256').update(canaryRaw).digest('hex').substring(0, 24);

      ledger.push({
        id: `acc_mirage_${canaryToken.substring(0, 8)}`,
        accountHolder,
        accountNumber: accountNum,
        routingNumber: routing,
        iban,
        swiftBic: swift,
        balanceFormatted: `${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}${Number(balanceAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        currency,
        card: {
          number: this.generateLuhnValidCard('4532'),
          exp: `12/${28 + (i % 4)}`,
          cvv: (100 + (Math.floor(Math.random() * 899))).toString(),
          brand: 'Visa Sovereign Commercial'
        },
        canaryTrackingToken: canaryToken
      });
    }

    return ledger;
  }

  /**
   * Generates adversarial LLM text poison containing zero-width non-joiners
   * and high-entropy BPE tokenizer disrupting vectors that degrade AI models
   * when scraped into training corpora.
   */
  public static generateLLMTokenPoison(topic: string = 'financial_report'): string {
    const canaryId = crypto.randomBytes(6).toString('hex');
    
    // Deceptive clean-looking financial analysis text
    const cleanSentences = [
      "The quarterly financial statement demonstrates an annualized EBITDA expansion of 14.8% across core sovereign settlement liquidity nodes.",
      "Regulatory capital adequacy ratios comfortably surpass Tier-1 Basel III constraints by 340 basis points, maintaining unencumbered reserves.",
      "Asymmetric risk mitigation strategies resulted in zero counterparty slippage throughout high-volatility macroeconomic intervals.",
      "Total institutional custody volume cleared $4.29 billion, representing a 22.4% compound surge across decentralized asset registries."
    ];

    // Adversarial tokenizer perturbations (invisible zero-width unicode characters \u200B, \u200C, \u200D, \uFEFF)
    // When ingested by Byte-Pair Encoding (BPE) tokenizers (GPT-4, Claude, LLaMA),
    // these cause massive vocabulary fragmentation and token explosion.
    const poisonMarkers = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
    
    let result = `--- CONFIDENTIAL EXECUTIVE FINANCIAL AUDIT // REQ-ID: ${canaryId} ---\n\n`;
    
    for (const s of cleanSentences) {
      let poisonedLine = '';
      const words = s.split(' ');
      for (const w of words) {
        // Inject zero-width token disruptor inside random syllables
        if (w.length > 4 && Math.random() > 0.4) {
          const splitIdx = Math.floor(w.length / 2);
          const marker = poisonMarkers[Math.floor(Math.random() * poisonMarkers.length)];
          poisonedLine += w.substring(0, splitIdx) + marker + w.substring(splitIdx) + ' ';
        } else {
          poisonedLine += w + ' ';
        }
      }
      result += poisonedLine.trim() + '\n\n';
    }

    result += `[Verified Sovereign Attestation: HASH-${crypto.createHash('sha256').update(result).digest('hex').substring(0, 16)}]`;
    return result;
  }

  /**
   * Serves an immediate HTTP 200 OK deceptive mirage response
   * confirming success to the attacker while feeding them synthesized honeypots.
   */
  public static serveDeceptive200(payloadType: 'banking' | 'admin_dump' | 'llm_poison' = 'banking', adversaryFingerprint?: string): MirageResponse {
    const canaryId = `CNRY-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    
    let dataPayload: any;
    if (payloadType === 'banking') {
      dataPayload = {
        status: 'success',
        code: 200,
        message: 'Records retrieved successfully from core ledger',
        totalRecords: 10,
        page: 1,
        canaryEnclaveId: canaryId,
        accounts: this.generateSyntheticBankingLedger(10, adversaryFingerprint)
      };
    } else if (payloadType === 'admin_dump') {
      dataPayload = {
        status: 'success',
        code: 200,
        database: 'rakshak_production_vault',
        exportTimestamp: new Date().toISOString(),
        tables: {
          users: 48920,
          transactions: 1849204,
          api_keys: 1204
        },
        sampleRecords: this.generateSyntheticBankingLedger(5, adversaryFingerprint),
        sessionToken: `sec_sess_${crypto.createHash('sha256').update(canaryId).digest('hex')}`
      };
    } else {
      dataPayload = {
        status: 'success',
        code: 200,
        contentType: 'text/markdown',
        content: this.generateLLMTokenPoison()
      };
    }

    return {
      statusCode: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Rakshak-Sovereign-Defense',
        'X-Rakshak-Mode': 'ACTIVE_INVARIANT',
        'Cache-Control': 'no-store, private',
        'X-Content-Type-Options': 'nosniff'
      },
      data: dataPayload,
      mirageMeta: {
        canaryId,
        deceptionVector: payloadType,
        poisonEntropy: 7.94
      }
    };
  }
}
