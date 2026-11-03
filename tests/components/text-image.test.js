// Text + image template: pure markup (the reveal motion is base/reveal.js, tested in reveal.test.js).
import { describe, expect, it } from 'vitest';
import { TEXT_IMAGE_VARIANTS, renderTextImage } from '../../components/sections/text-image/text-image.template.js';

describe('text + image template', () => {
  it('renders every variant with a Heading group and the reveal hook', () => {
    TEXT_IMAGE_VARIANTS.forEach((variant) => {
      const markup = renderTextImage({ variant });
      expect(markup).toContain(`ds-text-image--${variant}`);
      expect(markup).toContain('ds-heading-group');
      expect(markup).toContain('data-ds-reveal');
    });
    expect(renderTextImage({ variant: 'centered' })).toContain('ds-heading-group--centered');
  });

  it('image left numbers its steps with the Numbered list', () => {
    const markup = renderTextImage({ variant: 'image-left' });
    expect(markup).toContain('<div class="ds-text-image__steps"><ol class="ds-numbered-list"');
    expect(markup.match(/<li class="ds-numbered-list__item">/g)).toHaveLength(4);
    expect(markup).toContain('<span class="ds-letter-circle ds-letter-circle--step">4</span>');
    expect(renderTextImage({ variant: 'image-right', steps: ['A', 'B'] }).match(/ds-letter-circle--step/g)).toHaveLength(2);
  });

  it('picks the actions per variant: primary buttons, accent on centered, text links on panorama', () => {
    expect(renderTextImage({ variant: 'image-right' })).toContain('ds-button--primary');
    expect(renderTextImage({ variant: 'centered' })).toContain('ds-button ds-button--accent ds-button--uppercase');
    expect(renderTextImage({ variant: 'image-right' })).not.toContain('ds-button--uppercase');
    expect(renderTextImage({ variant: 'centered' })).toContain('ds-text--question ds-text--mobile-body');
    const panorama = renderTextImage({ variant: 'panorama' });
    expect(panorama.match(/ds-link--arrow ds-link--uppercase/g)).toHaveLength(2);
    expect(panorama).not.toContain('ds-button');
    expect(renderTextImage({ variant: 'image-right', actions: [] })).not.toContain('ds-text-image__buttons');
  });

  it('photos: two frames round the card and its badge; the empty frame stays without an image', () => {
    const markup = renderTextImage({ variant: 'photos', image: 'a.jpg' });
    expect(markup).toContain('ds-text-image__trio');
    expect(markup).toContain('ds-badge-circular ds-badge-circular--accent ds-text-image__badge');
    expect(markup.match(/<figure class="ds-text-image__media/g)).toHaveLength(2);
    expect(markup.match(/<img class="ds-text-image__image"/g)).toHaveLength(1);
    expect(renderTextImage({ variant: 'photos', badgeText: '' })).not.toContain('ds-badge-circular');
  });

  it('centered draws the background only when given', () => {
    expect(renderTextImage({ variant: 'centered', background: 'bg.svg' })).toContain('<img class="ds-text-image__background" src="bg.svg" alt=""');
    expect(renderTextImage({ variant: 'centered' })).not.toContain('ds-text-image__background');
  });

  it('falls back to image-right and h2, and escapes text', () => {
    const markup = renderTextImage({ variant: 'nope', headingTag: 'h5', title: '<b>"T"</b>', image: 'x.jpg', imageAlt: 'A & B' });
    expect(markup).toContain('ds-text-image--image-right');
    expect(markup).toContain('<h2 class="ds-text ds-text--3xl ds-heading-group__title">');
    expect(markup).toContain('&lt;b&gt;&quot;T&quot;&lt;/b&gt;');
    expect(markup).toContain('alt="A &amp; B"');
  });
});
