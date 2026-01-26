# Product Requirements Document (PRD) - Web Audit & Improvements

## Project Overview
The goal is to perform a comprehensive audit of the "Wild Fitness - Laura Ramírez" website and implement improvements, focusing on UX/UI, mobile design, and general code cleanliness.

## Goals
1.  **Improve UX/UI**: Enhance the visual appeal and user experience, especially on mobile devices.
2.  **Optimize Mobile Design**: Ensure the site is fully responsive and provides a seamless experience on all screen sizes.
3.  **Code & File Cleanup**: Remove redundant documentation and test files to improve maintainability.
4.  **Performance & SEO**: Address basic performance and SEO inconsistencies discovered during the audit.

## Audit Findings (Current Issues)
1.  **Redundant Files**: Multiple instructional markdown files and debug/test HTML files clutter the root directory.
2.  **Image Optimization**: Hero image is large (377KB) and lacks modern format (WebP).
3.  **UI/UX Small Fixes**:
    *   WhatsApp link missing `target="_blank"`.
    *   Header transition could be smoother.
    *   Mobile menu push effect could be more polished.
4.  **Consistency**:
    *   Domain name inconsistencies in meta tags (`wildbreathing.com` vs `wild-fitness.com`).
    *   Mixed language in some labels (ARIA labels).

## Functional Requirements
1.  **File Cleanup**: Delete unnecessary `.md` and `test-*.html` files.
2.  **Image Optimization**: Convert large images to WebP and update references.
3.  **UI Improvements**:
    *   Fix target attributes for external links.
    *   Refine mobile menu transitions.
    *   Improve visual hierarchy on mobile (spacing, font sizes).
4.  **Technical Debt**:
    *   Consolidate or modularize CSS if possible (or at least clean up unused styles).
    *   Fix meta tag inconsistencies.

## Non-Functional Requirements
1.  **Accessibility**: Maintain or improve WCAG 2.1 compliance.
2.  **Performance**: Improve PageSpeed scores (LCP, FID, CLS).
3.  **Responsiveness**: Flawless experience on mobile devices.

## Success Criteria
- [ ] Redundant files removed.
- [ ] Improved mobile lighthouse scores for UX/UI.
- [ ] Consistent domain and language across all pages.
- [ ] Polished mobile navigation.
