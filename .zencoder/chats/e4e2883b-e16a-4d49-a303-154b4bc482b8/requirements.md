# Product Requirements Document (PRD) - Fix Specialty Images

## Problem Statement
The images in the section "Àrees en les quals puc ajudar-te a millorar" (Specialties section) are not visible on the website.

## Scope
- Identify why the images `spec-strength.jpg`, `spec-trail.jpg`, `spec-mountain.jpg`, and `spec-yoga.jpg` are not displaying in the `index.html` file.
- Fix the visibility issue.
- Ensure the images are properly optimized (using `<picture>` and `.webp` if possible, following the project's patterns).
- Add missing icons if they were intended to be part of the design (based on CSS patterns).

## Research Findings
- The images exist in the `images/` directory.
- The paths in `index.html` are correct.
- The CSS for `.specialty-image` and `.specialty-image img` seems correct.
- `script.js` has an image loading optimization and error handling mechanism that might be interfering.
- The `specialty-icon` class exists in CSS but is missing in HTML.
- Other sections use `<picture>` with `.webp` fallbacks, but this section does not.

## Requirements
1. The 4 specialty images must be visible to the user.
2. The images should follow the same pattern as other images in the site (using `<picture>` for `.webp` support).
3. (Optional/Clarify) If icons are missing from the design, they should be added to match the CSS intent.

## Decisions / Assumptions
- I will assume the user wants the images to be visible and properly integrated into the site's design.
- I will convert the images to use the `<picture>` pattern for consistency.
- I will investigate if the `IntersectionObserver` in `script.js` needs to be aware of these cards for proper animation (consistency with other sections).
