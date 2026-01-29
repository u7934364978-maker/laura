# Full SDD workflow

## Workflow Steps

### [x] Step: Requirements

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Save the PRD to `/Users/lidia/Documents/laura/.zencoder/chats/7e999ed9-d9de-4295-80d8-4f02af0d6cd1/requirements.md`.

### [x] Step: Technical Specification

Create a technical specification based on the PRD in `/Users/lidia/Documents/laura/.zencoder/chats/7e999ed9-d9de-4295-80d8-4f02af0d6cd1/requirements.md`.

1. Review existing codebase architecture and identify reusable components
2. Define the implementation approach

Save to `/Users/lidia/Documents/laura/.zencoder/chats/7e999ed9-d9de-4295-80d8-4f02af0d6cd1/spec.md`.

### [x] Step: Planning

Create a detailed implementation plan based on `/Users/lidia/Documents/laura/.zencoder/chats/7e999ed9-d9de-4295-80d8-4f02af0d6cd1/spec.md`.

1. Break down the work into concrete tasks
2. Each task should reference relevant contracts and include verification steps
3. Replace the Implementation step below with the planned tasks

Save to `/Users/lidia/Documents/laura/.zencoder/chats/7e999ed9-d9de-4295-80d8-4f02af0d6cd1/plan.md`.

### [ ] Step: Implementation

#### 1. HTML Implementation
- [x] Add Testimonials section to `index.html` after the "Qui sóc" section.
- [x] Insert TrustBox Carousel widget (`data-template-id="53aa891200006400057a1601"`).

#### 2. CSS Styling
- [x] Add `.testimonials` styles to `styles.css`.
- [x] Ensure section padding and background consistency with existing sections.

#### 3. Verification
- [x] Verify widget renders correctly on desktop.
- [x] Verify widget responsiveness on mobile.
- [x] Check console for Trustpilot script errors.
