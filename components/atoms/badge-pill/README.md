# Badge pill

Figma: Atoms → Badge pill (`102:70`). DCC: `.dcc-odznaka` (assets/css/components/odznaka.css).
CSS: `atoms/label/label.css` (no CSS of its own). No JS.

`renderBadgePill({ variant, text })` prints the Label markup: `<span class="ds-label ds-label--accent">Polecane</span>`.
Variants map to Label variants: `polecane` → `accent`, `promocja` → `inverse`, `akcja` → `primary`.
Figma's Label and Badge pill are the same pill (3/10 padding, body bold 12, on-brand text), so there is one CSS.

WordPress: `esc_html()` for the text.
