# Product Requirements Document (PRD) - Trustpilot Integration

## Project Overview
Integrate Trustpilot reviews into the home page of the Wild Fitness website to showcase customer feedback and build trust.

## Goals
1.  **Display Reviews**: Show actual customer reviews on the home page.
2.  **Increase Trust**: Use Trustpilot's brand and verified reviews to increase conversion rates.
3.  **Visual Integration**: Ensure the widget fits the website's design and is responsive.

## Target Audience
Potential clients looking for personal training or mountain guide services.

## Functional Requirements
1.  **Review Widget**: Replace or supplement the current "Review Collector" in the footer with a widget that displays reviews (e.g., Carousel or Grid).
2.  **Strategic Placement**: Add a dedicated "Testimonials" or "Reviews" section on the home page (`index.html`).
3.  **Responsive Design**: The widget must work correctly on mobile, tablet, and desktop.
4.  **Language Consistency**: The widget should be in the same language as the site (Catalan/Spanish) where possible, or reflect the reviews' language.

## Non-Functional Requirements
1.  **Performance**: The widget should not significantly degrade page load speed (already using Trustpilot's async bootstrap script).
2.  **Maintainability**: Use Trustpilot's standard TrustBox widgets for easy updates.

## Success Criteria
- [ ] A section displaying Trustpilot reviews is visible on the home page.
- [ ] The widget is responsive and looks good on all screen sizes.
- [ ] Clicking on the reviews takes the user to the Trustpilot profile.
