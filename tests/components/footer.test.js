// Footer template: pure markup (no script; every column is open, as in Figma).
import { describe, expect, it } from 'vitest';
import { renderFooter } from '../../components/organisms/footer/footer.template.js';

describe('footer template', () => {
  it('renders the newsletter form, the columns and the legal line', () => {
    const markup = renderFooter();
    expect(markup).toMatch(/^<footer class="ds-footer">/);
    expect(markup).toContain('<form class="ds-footer__form"');
    expect(markup).toContain('ds-newsletter-field');
    expect(markup).toContain('href="tel:+48600000000"');
    expect(markup).toContain('href="mailto:biuro@dcc.pl"');
    expect(markup).toContain('ds-social-button--raised');
    expect(markup).toContain('aria-label="Menu w stopce"');
    expect(markup.match(/ds-link--footer/g)).toHaveLength(10);
  });

  it('leaves out the newsletter panel and escapes text', () => {
    const markup = renderFooter({ newsletter: null, about: '<b>"A"</b> & B', tag: 'div' });
    expect(markup).not.toContain('ds-footer__newsletter');
    expect(markup).toMatch(/^<div class="ds-footer">/);
    expect(markup).toContain('&lt;b&gt;&quot;A&quot;&lt;/b&gt; &amp; B');
  });
});
