# Accessibility Compliance (a11y) - CarbonOS AI

This document outlines the WCAG 2.2 AA and WAI-ARIA implementations designed to achieve a 100/100 accessibility rating.

## 1. Programmatic Label Associations
All forms, sliders, and selectors explicitly link text descriptions to control inputs:
* **Dashboard log inputs**: Linked via matching `htmlFor` and `id` bindings.
* **Twin simulation parameters**: Linked via matching `htmlFor` and `id` bindings.
* **Digital footprint calculators**: Linked via matching `htmlFor` and `id` bindings.

## 2. ARIA Landmarks & Attributes
Screen reader tags are integrated across interactive zones:
* **Coach text inputs**: Configured with `aria-label="Ask sustainability coach a question"`.
* **Receipt file uploader**: Configured with `aria-label="Upload receipt image or PDF file"`.
* **Side navigation**: Landmarks configured with `aria-current="page"` and `aria-label`.

## 3. Reduced Motion Support
CSS styling adapts dynamically to device preference queries:
* **Pre-reduced motion overrides**: Freezes all ambient background glows and typing/float indicators (`prefers-reduced-motion: reduce`) immediately.
