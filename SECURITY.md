# Security Architecture - CarbonOS AI

This document outlines the security controls, boundary validations, and isolation mechanisms safeguarding the CarbonOS AI platform.

## 1. HTTP Security Headers
Configured in [next.config.mjs](file:///e:/3rd%20Challenge/next.config.mjs) for all routes:
* **Content-Security-Policy (CSP)**: Strict restriction of content sources (scripts, frames, connects) to mitigate XSS and clickjacking.
* **Strict-Transport-Security (HSTS)**: Enforces TLS encryption for 2 years, including subdomains and preloads.
* **X-Frame-Options**: Set to `SAMEORIGIN` to prevent clickjacking.
* **X-Content-Type-Options**: Set to `nosniff` to protect against MIME-type sniffing.
* **Referrer-Policy**: Set to `strict-origin-when-cross-origin`.
* **Permissions-Policy**: Restricts camera, microphone, and geolocation bindings to protect user privacy.

## 2. Input Boundary Validation (Zod)
All interactive boundaries validate incoming JSON structures at runtime using Zod in [validators/index.ts](file:///e:/3rd%20Challenge/src/validators/index.ts):
* **Login validations**: Email format checks.
* **Carbon twin validations**: Prevents overflow constraints on distance or diet inputs.
* **Redemption validations**: Validates reward IDs and checks point balances against item costs to protect against balance exploits.

## 3. Environment Isolation
Sensitive configuration parameters are injected via system environment variables, keeping keys and credentials out of the public codebase.
