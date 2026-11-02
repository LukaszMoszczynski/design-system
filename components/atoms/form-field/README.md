# Form fields

Figma: Atoms → Form fields (`90:135` Field, `90:152` Checkbox, `90:163` Newsletter field, `90:164` Quantity stepper).
DCC: checkout fields (components/koszyk-strona.css), `.dcc-footer__newsletter` form (blocks/stopka), `.dcc-buy__qty` (blocks/produkt).
CSS: `atoms/form-field/form-field.css` plus `atoms/icon/icon.css`. No JS: the label floats in CSS; the stepper's buttons and
the newsletter submit are wired by the organisms (buy box, footer).

## Field — `renderFormField({ type, label, name, id, value, options, error, required })`

```html
<div class="ds-field ds-field--text">
  <div class="ds-field__box">
    <input type="email" class="ds-field__control" id="email" name="email" placeholder=" " aria-invalid="true" aria-describedby="email-message">
    <label class="ds-field__label" for="email">Adres e-mail</label>
  </div>
  <p class="ds-field__message" id="email-message">Podaj poprawny adres e-mail.</p>
</div>
```

- `type`: `text`, `email`, `tel` (class `ds-field--text`), `select` (`options: [{ value, label }]`, an empty first option,
  `.ds-field__chevron`), `textarea` (120 px), `search` (pill, magnifier, the label is the placeholder and `aria-label`).
- The label must come right after the control: it floats on `:focus` / `:not(:placeholder-shown)` (keep `placeholder=" "`);
  a select floats it unless its empty option is chosen.
- Focus: primary border + ring round the box. Error: `aria-invalid="true"` on the control → error border, label, message.

## Checkbox — `renderCheckbox({ label, name, id, checked, required })`

`<div class="ds-checkbox"><input type="checkbox" class="ds-checkbox__input" …><label class="ds-checkbox__label" for>…</label></div>`.
Links inside the label are primary (`.ds-checkbox__label a`).

## Newsletter field — `renderNewsletterField({ placeholder, name, label, submitLabel })`

`<div class="ds-newsletter-field"><input type="email" class="ds-newsletter-field__input" …><button type="submit" class="ds-newsletter-field__submit" aria-label>…</button></div>`;
put it inside the footer's `<form>`. 70 px input / 73 px submit; below 782 px both 48 px.

## Quantity stepper — `renderQuantityStepper({ value, min, max, name, label })`

`<div class="ds-quantity" data-ds-quantity>` with `button[data-ds-quantity-minus]`, `input.ds-quantity__input[type=number]`,
`button[data-ds-quantity-plus]`.

WordPress: `esc_attr()` for names, ids and values, `esc_html()` for labels and the message; WooCommerce fields can take these
classes through the `woocommerce_form_field_args` filter.
