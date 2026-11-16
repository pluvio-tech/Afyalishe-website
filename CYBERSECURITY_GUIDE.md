# Afyalishe Wellness LTD — Cybersecurity & Anti-Phishing Hardening Guide

This document details the enterprise cybersecurity measures implemented in the Afyalishe Wellness codebase, along with recommended Cloudflare and DNS security configurations to eliminate phishing, hacker exploits, and data tampering.

---

## 1. Implemented Codebase & Edge Protections

### A. Strict HTTP Security Headers (`_headers` & `functions/_middleware.js`)
| Security Header | Value | Threat Mitigated |
| :--- | :--- | :--- |
| **Content-Security-Policy (CSP)** | `default-src 'self'; script-src 'self' ...; frame-ancestors 'none';` | Blocks Cross-Site Scripting (XSS), malicious script injection, and third-party data exfiltration. |
| **X-Frame-Options** | `DENY` | Completely blocks **Clickjacking** and malicious iframe embedding (hackers cannot overlay transparent buttons over the site). |
| **Strict-Transport-Security (HSTS)** | `max-age=31536000; includeSubDomains; preload` | Enforces HTTPS strictly, preventing SSL stripping, session interception, and Man-in-the-Middle (MITM) attacks. |
| **X-Content-Type-Options** | `nosniff` | Prevents browser MIME-type confusion attacks (executable scripts disguised as images). |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Prevents sensitive order and token parameters in URLs from leaking to external referrers. |
| **Cross-Origin-Opener-Policy (COOP)** | `same-origin` | Isolates the browsing context, neutralizing **Reverse Tabnabbing** phishing attacks where a opened link redirects the parent tab. |
| **Cross-Origin-Resource-Policy (CORP)**| `same-origin` | Prevents cross-origin read attacks and unauthorized asset embedding. |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=()` | Denies access to hardware sensors and device APIs often probed by phishing scripts. |

### B. Client-Side Link & Form Hardening
- **Anti-Reverse Tabnabbing:** Every external anchor link across all 10 HTML templates and dynamic JavaScript renderers now enforces `rel="noopener noreferrer"`.
- **Anti-Bot Honeypots:** Contact and consultation forms incorporate invisible trap fields (`_bot_trap`) that immediately identify and neutralize automated spam/phishing submission bots without friction to human users.
- **Input Sanitization:** Strips HTML tags, prevents script injection, and validates Kenyan phone numbers (`+254 7XX...` / `+254 1XX...`) and emails before transmission.

### C. Serverless Backend Edge Protection (`functions/api/`)
- **`functions/_middleware.js`:** Inspects incoming edge requests for SQL injection signatures (`union select`), path traversal (`../`), and script injection before routing to application code. Enforces host header validation against DNS rebinding.
- **`functions/api/order-validate.js`:** Server-authoritative price validation. Prevents client-side price tampering by recalculating line items and delivery fees on the server.
- **`functions/api/mpesa-stk.js`:** Safely handles Safaricom Daraja STK Push requests. Keeps sensitive API consumer keys and passkeys encrypted in Cloudflare environment secrets (never exposed to client JavaScript).
- **`functions/api/contact.js`:** Serverless inquiry ingestion with payload size caps (1500 chars) and sanitization.

---

## 2. Recommended Cloudflare Edge Security Settings

When your site is connected to Cloudflare, activate these 5 settings in the Cloudflare Dashboard:

### 1. Enable Bot Fight Mode
- **Navigate to:** `Security` &rarr; `Bots`
- **Action:** Toggle **Bot Fight Mode** to **ON**.
- **Protection:** Automatically challenges or blocks malicious scrapers, dictionary attack bots, and credential stuffers before they hit your site.

### 2. Configure Web Application Firewall (WAF) Rule for Kenya
- **Navigate to:** `Security` &rarr; `WAF` &rarr; `Custom Rules` &rarr; `Create Rule`
- **Rule Name:** `Protect Checkout & Contact API`
- **Field:** `URI Path` contains `/api/`
- **Action:** Set **Rate Limiting** (e.g., maximum 10 requests per 1 minute per IP address). This stops brute-force STK push spam and contact form flooding.

### 3. Force HTTPS & Minimum TLS Version
- **Navigate to:** `SSL/TLS` &rarr; `Edge Certificates`
- **Always Use HTTPS:** Toggle **ON**.
- **Minimum TLS Version:** Select **TLS 1.2** or **TLS 1.3** (disables vulnerable legacy TLS 1.0 and 1.1).
- **Opportunistic Encryption:** Toggle **ON**.

### 4. Enable DNSSEC (DNS Security Extensions)
- **Navigate to:** `DNS` &rarr; `Settings` &rarr; `DNSSEC`
- **Action:** Click **Enable DNSSEC**.
- **Protection:** Cryptographically signs your DNS records, preventing hackers from executing DNS cache poisoning or hijacking `afyalishewellness.co.ke` traffic to a fake phishing server.

---

## 3. Brand Anti-Phishing & Email Spoofing Defense (DMARC, SPF, DKIM)

Phishing attacks commonly forge legitimate company emails (e.g., sending fake emails from `orders@afyalishewellness.co.ke` asking customers to pay to a scammer's personal phone number). Add these 3 TXT records in your Cloudflare DNS table:

### 1. SPF (Sender Policy Framework) Record
Authorizes only your designated mail servers (e.g. Google Workspace or Zoho Mail) to send emails for your domain.
- **Type:** `TXT`
- **Name:** `@` (or `afyalishewellness.co.ke`)
- **Content:** `v=spf1 include:_spf.google.com ~all` *(adjust if using Zoho or cPanel mail)*

### 2. DMARC (Domain-based Message Authentication, Reporting & Conformance) Record
Instructs all email providers worldwide (Gmail, Yahoo, Safaricom Mail, Outlook) to reject forged emails claiming to be from Afyalishe.
- **Type:** `TXT`
- **Name:** `_dmarc`
- **Content:**
  ```
  v=DMARC1; p=reject; rua=mailto:security@afyalishewellness.co.ke; pct=100; aspf=s; adkim=s;
  ```
  > `p=reject` ensures that any email failing SPF/DKIM authentication is blocked before reaching the recipient's inbox.

### 3. DKIM (DomainKeys Identified Mail)
Generated from your email provider and published as a `TXT` or `CNAME` record in Cloudflare DNS to cryptographically sign every legitimate outgoing email.

---

## 4. Environment Variables Setup (For Safaricom Daraja API)

In the Cloudflare Dashboard:
1. Go to **Workers & Pages** &rarr; Select your `afyalishe-redesign` project.
2. Navigate to **Settings** &rarr; **Environment Variables**.
3. Under **Production**, click **Add Variable** (Select **Encrypt** for each):
   - `SAFARICOM_CONSUMER_KEY`: Your Safaricom Daraja App Consumer Key
   - `SAFARICOM_CONSUMER_SECRET`: Your Safaricom Daraja App Consumer Secret
   - `SAFARICOM_PASSKEY`: Your Lipa Na M-Pesa Online Passkey
   - `SAFARICOM_SHORTCODE`: Your M-Pesa Business Paybill / Till Number (e.g., `174379`)
4. Save and Deploy.
