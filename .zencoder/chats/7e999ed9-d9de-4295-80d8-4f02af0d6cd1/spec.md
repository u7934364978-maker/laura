# Technical Specification - Trustpilot Integration

## Technical Context
- **Framework**: Static HTML/CSS/JS.
- **Third-party Library**: Trustpilot TrustBox Bootstrap script (already included in `index.html`).
- **Target File**: `index.html`, `styles.css`.

## Implementation Approach
1.  **Widget Selection**: Use a Trustpilot "Carousel" or "Micro Review Count" widget. Since the user wants to "add reviews", a Carousel or Grid widget that shows actual text is preferred.
    - Template ID for Carousel: `53aa891200006400057a1601` (typical Carousel) or `54ad5dfc97464c09706a2124` (Micro Star).
    - We will use a standard Carousel widget to show 3-5 reviews.
2.  **Section Creation**: Create a new `<section class="testimonials">` in `index.html`.
3.  **Placement**: Insert the section before the footer or after the "Qui sóc" section to build social proof early.
4.  **Styling**: Add minimal CSS to `styles.css` to ensure the section has proper padding and alignment, matching the site's design.

## Source Code Structure Changes
- **index.html**: Add a new section for reviews.
- **styles.css**: Add styles for the testimonials section.

## Delivery Phases
1.  **Phase 1: Widget Configuration**: Select and configure the TrustBox widget code.
2.  **Phase 2: HTML Implementation**: Add the section and widget div to `index.html`.
3.  **Phase 3: CSS Styling**: Ensure the section matches the site's layout.
4.  **Phase 4: Verification**: Test responsiveness and widget loading.

## Verification Approach
- **Visual Inspection**: Check the home page for the reviews widget.
- **Mobile Test**: Ensure the Carousel/Grid scales correctly on small screens.
- **Link Check**: Verify the "Trustpilot" link leads to the correct business profile.
