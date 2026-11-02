# Label

Figma: Atoms → Link · Label → Label (`4:56`). DCC: `.dcc-odznaka` (assets/css/components/odznaka.css).
CSS: `atoms/label/label.css`. No JS.

`renderLabel({ text, variant })` → `<span class="ds-label ds-label--accent">Polecane</span>`.
Variants: `accent` (polecane), `primary` (akcja), `inverse` (promocja: inverse surface with inverse text, so it stays
readable in Dark). The shop's Badge pill (`atoms/badge-pill`) prints this markup.

WordPress: `esc_html()` for the text.
