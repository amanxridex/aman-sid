# ============================================================================
# RAKSHAK CORE - TERRAFORM HCL CLOUD WAF ORCHESTRATION
# Target: AWS WAF v2 / CloudFront / Application Load Balancer
# Purpose: Infrastructure-as-Code automated defense against AI scraper botnets
# ============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_wafv2_web_acl" "rakshak_shield" {
  name        = "rakshak-zero-trust-ai-shield"
  description = "Rakshak automated zero-trust perimeter against autonomous AI crawlers"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "RakshakGlobalWebAclMetrics"
    sampled_requests_enabled   = true
  }

  # Rule 1: Intercept Known AI Crawler User-Agents
  rule {
    name     = "Rakshak-Block-Known-AICrawlers"
    priority = 10

    action {
      block {
        custom_response {
          response_code = 403
          custom_response_body_key = "rakshak_block_page"
        }
      }
    }

    statement {
      regex_match_statement {
        field_to_match {
          single_header {
            name = "user-agent"
          }
        }
        regex_string = "(?i)(claudebot|gptbot|chatgpt-user|perplexitybot|deepseek|crawl4ai|firecrawl)"
        text_transformation {
          priority = 0
          type     = "NONE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RakshakKnownAICrawlersBlocked"
      sampled_requests_enabled   = true
    }
  }

  # Rule 2: Rate Limit Burst Extractors (> 100 requests per 5 minutes per IP)
  rule {
    name     = "Rakshak-RateLimit-AggressiveScraping"
    priority = 20

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 100
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RakshakRateLimitTriggered"
      sampled_requests_enabled   = true
    }
  }

  custom_response_body {
    key          = "rakshak_block_page"
    content      = "{\"error\": \"Access denied by Rakshak Zero-Trust Shield\"}"
    content_type = "APPLICATION_JSON"
  }
}
