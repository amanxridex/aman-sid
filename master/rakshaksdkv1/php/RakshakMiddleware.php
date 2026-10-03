<?php
declare(strict_types=1);

namespace Rakshak\Security;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * ============================================================================
 * RAKSHAK CORE - PHP 8.2+ PSR-15 ZERO-TRUST MIDDLEWARE
 * ============================================================================
 * Production middleware for Laravel, Symfony, WordPress, and Slim frameworks.
 * ============================================================================
 */
class RakshakMiddleware implements MiddlewareInterface
{
    private const CLOUD_ASNS = [
        '16509', '15169', '8075', '24940', '14061', '31898', '396982', '13335'
    ];

    private const AI_BOT_KEYWORDS = [
        'claudebot', 'gptbot', 'chatgpt-user', 'perplexitybot', 'deepseek', 'crawl4ai', 'firecrawl'
    ];

    public function __construct(
        private readonly string $action = 'deceive' // 'deceive' or 'block'
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $headers = array_change_key_case($request->getHeaders(), CASE_LOWER);
        $userAgent = strtolower($request->getHeaderLine('user-agent'));
        $secChUa = strtolower($request->getHeaderLine('sec-ch-ua'));
        $secFetchDest = $request->getHeaderLine('sec-fetch-dest');
        $asn = $request->getHeaderLine('x-vercel-ip-as-number') ?: $request->getHeaderLine('cf-ipasn');

        $score = 0;
        $reasons = [];

        // 1. Signature Match
        foreach (self::AI_BOT_KEYWORDS as $keyword) {
            if (str_contains($userAgent, $keyword)) {
                $score += 75;
                $reasons[] = "Matched AI crawler keyword: {$keyword}";
                break;
            }
        }

        // 2. Headless Detection
        if (str_contains($secChUa, 'headless') || str_contains($userAgent, 'headlesschrome')) {
            $score += 55;
            $reasons[] = 'Headless browser automation detected';
        }

        // 3. Topology Anomaly
        if (str_contains($userAgent, 'chrome/') && !str_contains($userAgent, 'edg/')) {
            if (empty($secFetchDest)) {
                $score += 45;
                $reasons[] = 'Missing Sec-Fetch-Dest on claimed desktop Chrome';
            }
        }

        // 4. Cloud Datacenter ASN
        if ($asn !== '' && in_array($asn, self::CLOUD_ASNS, true)) {
            $score += 40;
            $reasons[] = "Cloud datacenter ASN: {$asn}";
        }

        if ($score >= 50) {
            if ($this->action === 'block') {
                $response = new \Nyholm\Psr7\Response(403, ['Content-Type' => 'text/plain'], 'Forbidden: Automated scraping denied.');
                return $response;
            }

            // Silent 200 OK Deception
            $payload = json_encode([
                'status' => 'ok',
                'engine' => 'rakshak-php-psr15',
                'synthetic_telemetry' => true,
                'records_total' => 2,
                'data' => [
                    ['id' => 'syn_php_01', 'verified' => true],
                    ['id' => 'syn_php_02', 'verified' => true]
                ]
            ]);

            return new \Nyholm\Psr7\Response(200, [
                'Content-Type' => 'application/json',
                'X-Rakshak-Shield' => 'active-deception'
            ], $payload);
        }

        return $handler->handle($request);
    }
}
