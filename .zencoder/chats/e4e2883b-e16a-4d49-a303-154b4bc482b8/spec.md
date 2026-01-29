# Technical Specification - Fix Specialty Images

## Context
The website uses a custom script `script.js` for image loading optimization and scroll animations. The specialties section in `index.html` has 4 cards with images that are reportedly not visible.

## Proposed Changes

### 1. HTML Update (`index.html`)
- Update the images in the specialties section to use the `<picture>` element pattern, consistent with other parts of the site.
- Ensure the classes used are consistent with the `script.js` expectations if any.
- Add `.fade-in-up` class to `.specialty-card` and add `.specialties-grid` to the `IntersectionObserver` in `script.js` to ensure they are properly animated and made visible.

### 2. JavaScript Update (`script.js`)
- Add `.specialties-grid` to the `animateElements` selection to ensure the section is properly observed for animations.
- Refactor the image error handling to be more robust and avoid unnecessary fallbacks for local images.

### 3. CSS Update (`styles.css`)
- Ensure `.specialty-image` has a background color during loading to improve UX.
- Verify that no global styles are inadvertently hiding these specific images.

## Verification Plan
- Manual verification by checking the specialties section.
- Inspect the DOM to ensure classes `image-loaded` and `is-visible` are correctly applied.
- Run `npm run lint` if available to ensure code quality.
