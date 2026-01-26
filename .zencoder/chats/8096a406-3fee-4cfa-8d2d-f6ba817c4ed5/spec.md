# Technical Specification - Web Audit & Improvements

## Technical Context
- **Language**: HTML5, CSS3, Vanilla JavaScript.
- **Backend**: Cloudflare Workers (for specific functionalities like contact form/payments).
- **Architecture**: Static site with client-side enhancements.

## Implementation Approach

### 1. Code & File Cleanup
- Identify and remove redundant instructional and test files.
- Consolidate CSS to reduce file size and remove conflicts.
- Remove debug logs from `script.js`.

### 2. Mobile Menu Fix (Priority)
- **Problem**: Conflicting media queries and redundant `.nav-list` definitions in `styles.css`.
- **Solution**: 
    - Consolidate all mobile navigation styles into a single, well-defined media query block (`max-width: 1024px` for tablet/mobile).
    - Ensure `.nav-toggle` is visible and `.nav-list` is correctly positioned and hidden via `transform: translateX(-100%)`.
    - Fix `z-index` layering to ensure the menu is above all other content.

### 3. Image Optimization
- Convert `hero.jpg` and other large assets to WebP using a bash script (if available) or manual replacement if few.
- Update `index.html` to use responsive images (using `srcset` or `<picture>` tag).

### 4. UX/UI Refinement
- Update all external links (WhatsApp, Instagram, etc.) to include `target="_blank"` and `rel="noopener"`.
- Smooth out header transitions.
- Polish mobile menu "push" effect to be more consistent.

### 5. SEO & Consistency
- Standardize domain references in meta tags to `wildbreathing.com`.
- Fix mixed language in ARIA labels (Catalan/Spanish/English).

## Source Code Structure Changes
- No structural changes to the directory layout, just file deletions and edits to existing `.html`, `.css`, and `.js` files.

## Delivery Phases
1.  **Cleanup Phase**: Delete redundant files.
2.  **CSS Refactor Phase**: Fix mobile menu and consolidate styles.
3.  **Optimization Phase**: Images and Meta tags.
4.  **UX Polish Phase**: Links, transitions, and language.

## Verification Approach
- **Visual Inspection**: Test mobile menu functionality in responsive mode.
- **Linting**: Run basic CSS/JS checks if available.
- **Performance**: Check file sizes after cleanup.
