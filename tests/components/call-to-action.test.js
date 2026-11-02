// Call to action template: pure markup (the reveal motion is base/reveal.js, tested in reveal.test.js).
import { describe, expect, it } from 'vitest';
import { CTA_VARIANTS, renderCallToAction } from '../../components/organisms/call-to-action/call-to-action.template.js';

describe('call to action template', () => {
  it('renders every variant with its own copy and the reveal hook', () => {
    CTA_VARIANTS.forEach((variant) => {
      const markup = renderCallToAction({ variant });
      expect(markup).toContain(`ds-cta--${variant}`);
      expect(markup).toContain('data-ds-reveal');
    });
    expect(renderCallToAction({ variant: 'light' })).toContain('A Ty jakie masz wyzwania?');
  });

  it('an empty title / subtitle / text (a cleared control) falls back to the variant copy', () => {
    const markup = renderCallToAction({ variant: 'large', title: '', subtitle: '', text: '' });
    expect(markup).toContain('Nie wiesz, od czego zacząć?');
    expect(markup).toContain('ds-cta__subtitle');
    expect(markup).toContain('ds-cta__text');
  });

  it('falls back to large and escapes text', () => {
    const markup = renderCallToAction({ variant: 'nope', title: '<b>"T"</b>', text: 'A & B' });
    expect(markup).toContain('ds-cta--large');
    expect(markup).toContain('&lt;b&gt;&quot;T&quot;&lt;/b&gt;');
    expect(markup).toContain('A &amp; B');
  });

  it('picks the button style per variant and text links for image', () => {
    const styles = (variant) => [...renderCallToAction({ variant }).matchAll(/ds-button--(primary|accent|light)/g)].map((match) => match[1]);
    expect(styles('large')).toEqual(['light', 'light']);
    expect(styles('gradient')).toEqual(['accent', 'light']);
    expect(styles('light')).toEqual(['accent', 'primary']);
    expect(renderCallToAction({ variant: 'image' })).toContain('ds-link--brand');
    expect(styles('image')).toEqual([]);
  });

  it('shows the subtitle only on large and gradient, the badge only on large', () => {
    expect(renderCallToAction({ variant: 'band', subtitle: 'Pod' })).not.toContain('ds-cta__subtitle');
    expect(renderCallToAction({ variant: 'gradient' })).toContain('ds-cta__subtitle');
    expect(renderCallToAction({ variant: 'large' })).toContain('ds-badge-circular');
    expect(renderCallToAction({ variant: 'image' })).not.toContain('ds-badge-circular');
  });
});
