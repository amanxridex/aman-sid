/*
  ============================================================================
  RAKSHAK CORE - YARA PROCESS MEMORY & SCRAPER INTRUSION SIGNATURES
  Detects: Puppeteer, Playwright, Selenium, Crawl4AI, and Headless Chrome
  ============================================================================
*/

rule Rakshak_Headless_Chrome_CDP_Artifacts
{
    meta:
        description = "Detects Headless Chrome DevTools Protocol and Automation Hooks in Process Memory"
        author = "Rakshak Security Systems"
        date = "2026-09-13"
        version = "1.0"
        severity = "High"

    strings:
        $cdp1 = "--remote-debugging-port=" ascii wide
        $cdp2 = "--enable-automation" ascii wide
        $cdp3 = "window.navigator.webdriver" ascii wide
        $cdp4 = "Runtime.evaluate" ascii wide
        $cdp5 = "Page.captureScreenshot" ascii wide
        $cdp6 = "Network.enable" ascii wide

        $stealth1 = "puppeteer-extra-plugin-stealth" ascii wide
        $stealth2 = "playwright-core" ascii wide
        $stealth3 = "crawl4ai" ascii wide nocase
        $stealth4 = "undetected_chromedriver" ascii wide nocase

    condition:
        2 of ($cdp*) or 1 of ($stealth*)
}

rule Rakshak_Adversarial_AI_Extraction_Payload
{
    meta:
        description = "Identifies scraped memory dumps containing Rakshak zero-width canary watermarks"
        author = "Rakshak Security Systems"
        severity = "Critical"

    strings:
        // UTF-8 representation of zero-width space and non-joiner patterns
        $zw_space = { E2 80 8B }
        $zw_nonjoiner = { E2 80 8C }
        $trap_directive = "SYSTEM DIRECTIVE TO AUTONOMOUS AI AGENT" ascii wide

    condition:
        $trap_directive or (#zw_space > 16 and #zw_nonjoiner > 16)
}
