# Heading group

Figma: Molecules → Heading group (`10:162`). DCC: `dcc_heading_group()` (inc/helpers.php), `.dcc-heading-group`, `.dcc-overline`, `.dcc-lead` (assets/css/base.css).
CSS: `atoms/text/text.css` + `molecules/heading-group/heading-group.css`. No JS.

`renderHeadingGroup({ overline, title, lead, leadStrong, variant, headingTag })` →

```html
<header class="ds-heading-group ds-heading-group--stacked">
  <p class="ds-text ds-text--overline ds-text--accent ds-heading-group__overline">Szkolenia otwarte</p>
  <h2 class="ds-text ds-text--3xl ds-heading-group__title">Programy, które wybierają zespoły sprzedaży</h2>
  <p class="ds-text ds-text--body ds-heading-group__lead">Warsztaty … i <strong>przykłady z Waszej branży.</strong></p>
</header>
```

- `variant` (Figma Layout): `stacked` (792 px max), `split` (from 1025 px the lead sits in a 520 px right column 64 px away, in the text
  colour; below that it stacks), `centered` (container width, centred).
- Empty `overline` / `lead` + `leadStrong` leave the part out (Figma Show overline / Show lead). An overline that starts with
  `#` gets `is-hashtag` (no capitals, no tracking). `headingTag`: `h1`–`h3`; the look stays 3XL.
- Figma Viewport=Mobile: the same markup; the fluid type tokens give the phone sizes.
- Place it inside sectioning content (`<section>`, `<article>`, `<main>`, as the sections and the Carousel do): a
  `<header>` outside it is a banner landmark, and two of those on one page fail axe (landmark-no-duplicate-banner).

WordPress: print the three parts with `esc_html()`; the lead's closing sentence goes in `<strong>` (`wp_kses` with `strong` only).
