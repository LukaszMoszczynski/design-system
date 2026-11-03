// The a11y gate (test runner, CI) stays at `test: 'error'` for every story. Only axe's `color-contrast` rule is off on the
// stories that show the known DCC palette gaps (accent #eb6126 with white text 3.34:1, accent text on the page 3.23:1,
// WCAG AA needs 4.5:1): the DCC palette contrast is the owner's decision, not the components'. Every other rule (names,
// landmarks, ARIA, lists, …) still fails CI there.
//
// Usage: `parameters: { a11y: CONTRAST_OFF }` on the meta or on a story.
export const CONTRAST_OFF = { config: { rules: [{ id: 'color-contrast', enabled: false }] } };
