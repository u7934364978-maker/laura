# Product Requirements Document (PRD) - Contact Form & Welcome Emails

## 1. Overview
The goal of this feature is to ensure the contact form on the Wild Fitness website is fully functional and sends automated welcome emails to users upon registration/contact.

## 2. User Stories
- As a user, I want to be able to fill out a contact form and receive a confirmation email.
- As an administrator, I want to receive a notification email when a new contact form is submitted.
- As an owner, I want the emails to be sent from my domain (`wild-fitness.com`) and not be marked as spam.

## 3. Requirements

### 3.1 DNS Configuration (Highest Priority)
The domain `wild-fitness.com` must be correctly verified on Resend to ensure high deliverability and avoid "Failed" status.
- **DKIM**: Update Cloudflare TXT record for `resend._domainkey` with the correct value provided by Resend.
- **SPF**: Update Cloudflare TXT record for `send` with the correct SPF value.
- **MX**: Ensure the `send` MX record is correctly configured for Resend.

### 3.2 Frontend Contact Form
- The form should capture: Name, Email, Phone, Location, Level, and Message.
- The form should display a loading state while sending.
- The form should display a success message upon successful submission.
- The form should handle errors gracefully and provide feedback to the user.

### 3.3 Backend API
- The `/api/send-welcome-email` endpoint should:
    - Validate input data.
    - Send a welcome email to the user using a branded template.
    - Send a notification email to the administrator.
    - Log success/failure for debugging.

## 4. Acceptance Criteria
- [ ] Domain `wild-fitness.com` shows "Verified" status in Resend dashboard (manual verification required after DNS changes).
- [ ] Contact form submission successfully triggers both welcome and notification emails.
- [ ] Emails are received in the inbox (not spam) and show the correct sender information.
- [ ] Frontend displays appropriate success/error messages.
