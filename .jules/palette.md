# Palette's Journal - Chain Reaction Game UX & Accessibility Insights

## 2025-02-15 - [Keyboard Navigable Color Selectors & Screen Reader Grid Cells]
**Learning:**
1. Popups/swatches relying purely on CSS mouse `group-hover:block` or `group-hover:grid` are completely inaccessible to screen reader and keyboard-only players. Using `group-focus-within:grid` lets nested interactive elements like color option buttons become visible and focused via keyboard tab-order dynamically.
2. In visual matrix-based or grid-based games like Chain Reaction, standard grid buttons are completely silent to screen readers. Enriching grid buttons with dynamic ARIA labels explaining their exact coordinates, owner names/colors, orb counts, and instability state ensures visually impaired players can completely track the gameplay.
3. Every custom select or text input must be explicitly associated with a label using corresponding `id` and `htmlFor` attributes to meet baseline WCAG standards.

**Action:**
1. Transform color-picking swatches into interactive buttons that display options on focus or hover.
2. Formulate explicit, rich screen reader labels for game cells: e.g., `Cell at Row 0, Column 0. 1 green orb. Critical mass is 2.`
3. Link form labels with inputs properly.
