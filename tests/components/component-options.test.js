// The component options the sections use instead of restyling component internals (Task 9 fix round 1).
import { describe, expect, it } from 'vitest';
import { renderText } from '../../components/atoms/text/text.template.js';
import { renderButton } from '../../components/atoms/button/button.template.js';
import { renderLink } from '../../components/atoms/link/link.template.js';
import { renderBadgeCircular } from '../../components/molecules/badge-circular/badge-circular.template.js';
import { renderNumberedList } from '../../components/molecules/numbered-list/numbered-list.template.js';

describe('component options', () => {
  it('Text: 2xl-medium and lead-large variants, mobile adds a phone style (not the same one, not an unknown one)', () => {
    expect(renderText({ text: 'A', variant: '2xl-medium' })).toBe('<p class="ds-text ds-text--2xl-medium">A</p>');
    expect(renderText({ text: 'A', variant: 'lead-large' })).toContain('ds-text--lead-large');
    expect(renderText({ text: 'A', variant: '4xl', mobile: 'overline', tone: 'accent' })).toBe('<p class="ds-text ds-text--4xl ds-text--mobile-overline ds-text--accent">A</p>');
    expect(renderText({ text: 'A', variant: 'body', mobile: 'body' })).not.toContain('mobile');
    expect(renderText({ text: 'A', mobile: 'huge' })).not.toContain('mobile');
  });

  it('Button: accentIcon (not on a pill) and uppercase', () => {
    expect(renderButton({ variant: 'light', accentIcon: true })).toContain('class="ds-button ds-button--light ds-button--accent-icon"');
    expect(renderButton({ shape: 'pill', accentIcon: true })).not.toContain('accent-icon');
    expect(renderButton({ uppercase: true })).toContain('ds-button--uppercase');
    expect(renderButton()).toBe(renderButton({ accentIcon: false, uppercase: false }));
  });

  it('Link: uppercase on a link and on the span look', () => {
    expect(renderLink({ text: 'Zadzwoń', variant: 'arrow', uppercase: true })).toContain('<a class="ds-link ds-link--arrow ds-link--uppercase"');
    expect(renderLink({ text: 'X', href: '', uppercase: true })).toContain('<span class="ds-link ds-link--inline ds-link--uppercase">');
    expect(renderLink()).not.toContain('uppercase');
  });

  it('Badge/Circular: the accent variant', () => {
    expect(renderBadgeCircular({ variant: 'accent', id: 'a' })).toContain('class="ds-badge-circular ds-badge-circular--accent"');
    expect(renderBadgeCircular({ id: 'b' })).not.toContain('--accent');
  });

  it('Numbered list: one row per item, numbered from 1, with the 2XL medium text', () => {
    const markup = renderNumberedList({ items: ['Pierwszy', 'A & B'] });
    expect(markup.match(/<li class="ds-numbered-list__item">/g)).toHaveLength(2);
    expect(markup).toContain('<span class="ds-letter-circle ds-letter-circle--step">2</span>');
    expect(markup).toContain('<span class="ds-text ds-text--2xl-medium ds-numbered-list__text">A &amp; B</span>');
  });
});
