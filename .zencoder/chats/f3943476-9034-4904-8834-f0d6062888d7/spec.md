# Technical Specification - Contact Form & Welcome Emails

## 1. Technical Context
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
- **Backend**: Vercel Edge Functions (JavaScript).
- **Database**: Supabase.
- **Email Service**: Resend.
- **DNS Provider**: Cloudflare.

## 2. Implementation Approach

### 2.1 DNS Fix (Infrastructure)
Based on the screenshots, the DNS records on Cloudflare for `wild-fitness.com` need to match exactly what Resend expects.
- **DKIM**: The `resend._domainkey` TXT record value must match the one provided by Resend.
- **SPF/MX**: The `send` subdomain records (TXT and MX) must be correctly configured and set to "DNS only" (grey cloud) in Cloudflare.
- **Verification**: Once DNS records are updated, "Verify" must be clicked in the Resend dashboard.

### 2.2 Backend (`api/send-welcome-email.js`)
- Ensure `RESEND_API_KEY` is correctly set in Vercel environment variables.
- The `FROM_EMAIL` is currently `Wild Fitness <noreply@wild-fitness.com>`. This matches the verified domain.
- The endpoint already handles:
    - User welcome email.
    - Admin notification email.
    - Input validation.
- **Improvements**: Add more detailed logging for Resend API responses to help debug if the DNS fix doesn't immediately resolve the issue.

### 2.3 Frontend (`script.js`)
- The current implementation already collects all necessary fields.
- It sequentially calls Supabase (`saveContactSubmission`) and then the Vercel API.
- **Improvements**: Ensure the `level` field from the form is correctly mapped to the `service` column in Supabase (as seen in `supabase-config.js:191`).

## 3. Source Code Structure Changes
No major structure changes are required, only potential logic refinements in `api/send-welcome-email.js` for better error reporting.

## 4. Delivery Phases

### Phase 1: DNS & Environment Verification
- Verify DNS records in Cloudflare against Resend requirements.
- Ensure `RESEND_API_KEY` is present in the environment.

### Phase 2: Backend Refinement
- Update `api/send-welcome-email.js` with improved error logging.

### Phase 3: Frontend Verification
- Test the form end-to-end and verify Supabase insertion and Email delivery.

## 5. Verification Approach
- **Manual Test**: Submit the form on the live/preview site.
- **Logs**: Check Vercel function logs for API response details.
- **Supabase**: Verify the record appears in `contact_submissions` table.
- **Inboxes**: Check both the user's email and `info@wild-fitness.com` for the emails.
