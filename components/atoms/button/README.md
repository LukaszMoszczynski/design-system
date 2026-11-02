# Button family

Figma: Atoms → Button (`3:125`), Button/Outline (`3:130`), Button/Arrow (`3:137`). DCC: `.dcc-btn*` and `.dcc-arrow` (assets/css/base.css).
CSS: `atoms/button/button.css` plus `atoms/icon/icon.css`. No JS.

## Button — `renderButton({ text, href, variant, shape, disabled, tag, type })` (`tag: 'span'`: the same look as a `<span>`, for the visual button inside a card that is itself the link; `type: 'submit'`: a submit button, for a form such as the Buy box)

```html
<a class="ds-button ds-button--primary" href="/oferta/">
  <span class="ds-button__label">Poznaj ofertę</span>
  <span class="ds-button__icon"><svg class="ds-icon ds-icon--arrow-diagonal" …></svg></span>
</a>
```

- `variant`: `primary` | `accent` | `light` (Figma Style) → `ds-button--{variant}`. `shape`: `arrow` (label + 44 px circle) or `pill`
  (`ds-button--pill`, no `.ds-button__icon`, label centred).
- Without `href` the element is `<button type="button">`. `disabled` (proposal): `<button disabled>`, or for a link
  `<a role="link" aria-disabled="true">` with no `href`.
- States: hover and `:focus-visible` share the primary → primary-deep gradient and the accent circle, the arrow nudges
  2 px up-right; focus adds the 2 px ring 3 px outside. Disabled is a proposal: the site has none. There is no pressed state.
- Shape of every button: `--button-radius` (Component tokens).

## Button/Outline — `renderButtonOutline({ text, href })`

`<span class="ds-button-outline">Więcej</span>` (or `<a … href>`). 1 px `currentColor` border, so inside a blue card
(the "On brand" variant) it turns white with the card's text colour.

## Button/Arrow — `renderButtonArrow({ href, ariaLabel, variant })`

`<span class="ds-button-arrow" aria-hidden="true"><svg class="ds-icon …"></svg></span>`; with `href` it is
`<a class="ds-button-arrow" href aria-label="…">` named by `ariaLabel`. `variant: 'inverted'` → `ds-button-arrow--inverted`: page-colour circle with a primary arrow
(the program card at rest). A card that wants the arrow nudge on its own hover adds
`.my-card:hover .ds-button-arrow .ds-icon { transform: translate(2px, -2px); }`.

WordPress: echo `text` with `esc_html()`, `href` with `esc_url()`; classes stay as above.
