# frozen_string_literal: true
# ============================================================================
# RAKSHAK CORE - RUBY ON RAILS & RACK ZERO-TRUST SHIELD
# ============================================================================
# Drop-in Rack middleware for Rails, Sinatra, and Hanami.
# Intercepts AI scraping bots and returns polymorphic synthetic decoys.
# ============================================================================

require 'json'

module Rakshak
  class RackShield
    CLOUD_ASNS = %w[16509 15169 8075 24940 14061 31898 396982 13335].freeze
    AI_BOT_KEYWORDS = %w[claudebot gptbot chatgpt-user perplexitybot deepseek crawl4ai firecrawl].freeze

    def initialize(app, action: :deceive)
      @app = app
      @action = action
    end

    def call(env)
      user_agent = (env['HTTP_USER_AGENT'] || '').downcase
      sec_ch_ua = (env['HTTP_SEC_CH_UA'] || '').downcase
      sec_fetch_dest = env['HTTP_SEC_FETCH_DEST']
      asn = env['HTTP_X_VERCEL_IP_AS_NUMBER'] || env['HTTP_CF_IPASN']

      score = 0
      reasons = []

      # 1. Signature check
      AI_BOT_KEYWORDS.each do |bot|
        if user_agent.include?(bot)
          score += 75
          reasons << "Matched AI crawler keyword: #{bot}"
          break
        end
      end

      # 2. Headless check
      if sec_ch_ua.include?('headless') || user_agent.include?('headlesschrome')
        score += 55
        reasons << 'Headless browser automation detected'
      end

      # 3. Topology Anomaly
      if user_agent.include?('chrome/') && !user_agent.include?('edg/')
        if sec_fetch_dest.nil? || sec_fetch_dest.empty?
          score += 45
          reasons << 'Missing Sec-Fetch-Dest on claimed desktop Chrome'
        end
      end

      # 4. Cloud Datacenter ASN
      if asn && CLOUD_ASNS.include?(asn)
        score += 40
        reasons << "Cloud datacenter ASN: #{asn}"
      end

      if score >= 50
        return [403, { 'Content-Type' => 'text/plain' }, ['Forbidden: Automated AI extraction blocked.']] if @action == :block

        # Silent 200 OK Honeypot
        decoy_body = JSON.generate({
          status: 'ok',
          engine: 'rakshak-ruby-rack',
          synthetic_telemetry: true,
          records_total: 2,
          data: [{ id: 'syn_rb_01', verified: true }, { id: 'syn_rb_02', verified: true }]
        })

        return [200, {
          'Content-Type' => 'application/json',
          'X-Rakshak-Shield' => 'active-deception'
        }, [decoy_body]]
      end

      @app.call(env)
    end
  end
end
