// Hero template: pure markup (no script; the site does not animate the hero).
import { describe, expect, it } from 'vitest';
import { HERO_VARIANTS, accentParts, renderHero } from '../../components/sections/hero/hero.template.js';

describe('hero template', () => {
  it('renders every variant with its own copy', () => {
    HERO_VARIANTS.forEach((variant) => expect(renderHero({ variant })).toContain(`ds-hero--${variant}`));
    expect(renderHero({ variant: 'contact' })).toContain('Zapraszamy do nas');
    expect(renderHero({ variant: 'subpage-violet' })).toContain('ds-hero--subpage');
  });

  it('colours the accent part of the title and the lead with the Text atom', () => {
    const large = renderHero({ variant: 'large' });
    expect(large).toMatch(/<h1 class="ds-hero__title"><span class="ds-text ds-text--4xl ds-text--mobile-3xl">Jak <\/span><span class="ds-text ds-text--4xl ds-text--mobile-3xl ds-text--accent">poukładać relacje i kompetencje<\/span>/);
    expect(renderHero({ variant: 'contact' })).toContain('ds-text--lead-large ds-text--accent">Umów się na sesję');
    // A title of its own drops the variant's accent unless one is given with it.
    expect(renderHero({ title: 'Nowy tytuł' })).not.toContain('ds-text--accent');
    expect(renderHero({ title: 'Nowy tytuł', titleAccent: 'tytuł' })).toContain('ds-text--accent">tytuł</span>');
  });

  it('the phone styles come from the Text atom: subpage title overline, subtitle body; the button has the accent circle', () => {
    const subpage = renderHero({ variant: 'subpage-violet' });
    expect(subpage).toContain('ds-text--4xl ds-text--mobile-overline');
    expect(subpage).toContain('<div class="ds-hero__subtitle"><p class="ds-text ds-text--2xl-medium ds-text--mobile-body">');
    expect(subpage).toContain('ds-text--3xl">Programy dla liderów');
    expect(renderHero()).toContain('ds-button ds-button--light ds-button--accent-icon');
  });

  it('accentParts splits round the first occurrence and drops empty parts', () => {
    expect(accentParts('Ala ma kota', 'Ala')).toEqual([{ text: 'Ala', accent: true }, { text: ' ma kota', accent: false }]);
    expect(accentParts('Ala ma kota', 'psa')).toEqual([{ text: 'Ala ma kota', accent: false }]);
    expect(accentParts('Ala', '')).toEqual([{ text: 'Ala', accent: false }]);
  });

  it('large and contact: a Light button and three tiles with h2 titles; subpages have neither', () => {
    const large = renderHero({ variant: 'large' });
    expect(large).toContain('ds-button--light');
    expect(large.match(/<li class="ds-hero__tile">/g)).toHaveLength(3);
    expect(large).toContain('<h2 class="ds-text ds-text--xl ds-card-hero-tile__title">');
    const subpage = renderHero({ variant: 'subpage-light', button: { text: 'X' }, tiles: [{}] });
    expect(subpage).not.toContain('ds-button');
    expect(subpage).not.toContain('ds-hero__tiles');
    expect(renderHero({ variant: 'large', button: null, tiles: [] })).not.toMatch(/ds-button|ds-hero__tiles/);
  });

  it('photo on large / contact (has-photo), illustration and breadcrumbs on subpages only', () => {
    expect(renderHero({ image: 'a.jpg' })).toContain('has-photo');
    expect(renderHero({ variant: 'subpage-light', image: 'a.jpg' })).not.toContain('ds-hero__photo');
    expect(renderHero({ variant: 'subpage-light', illustration: 'b.svg' })).toContain('ds-hero__illustration');
    expect(renderHero({ variant: 'large', illustration: 'b.svg' })).not.toContain('ds-hero__illustration');
    const crumbs = [{ text: 'Start', href: '/' }, { text: 'Tu' }];
    expect(renderHero({ variant: 'subpage-orange', breadcrumbs: crumbs })).toContain('ds-breadcrumbs');
    expect(renderHero({ variant: 'large', breadcrumbs: crumbs })).not.toContain('ds-breadcrumbs');
  });

  it('falls back to large and h1, and escapes text', () => {
    const markup = renderHero({ variant: 'nope', headingTag: 'h4', title: '<b>"T"</b>', imageAlt: 'A & B', image: 'x.jpg' });
    expect(markup).toContain('ds-hero--large');
    expect(markup).toContain('<h1 class="ds-hero__title">');
    expect(markup).toContain('&lt;b&gt;&quot;T&quot;&lt;/b&gt;');
    expect(markup).toContain('alt="A &amp; B"');
  });
});
