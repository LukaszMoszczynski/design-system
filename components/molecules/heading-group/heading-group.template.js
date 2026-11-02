// Heading group: overline, title, lead. Figma: Molecules → Heading group (10:162). DCC: dcc_heading_group() (inc/helpers.php),
// .dcc-heading-group / .dcc-overline / .dcc-lead (assets/css/base.css).
// Composes the Text atom three times. Variant (Figma Layout) stacked (792 px max), split (lead in a 520 px right column from 1025 px),
// centered (container width, centred). An overline starting with # keeps its case and tracking.
import { escapeHtml } from '../../_shared/escape.js';
import { renderText } from '../../atoms/text/text.template.js';

export const HEADING_GROUP_VARIANTS = ['stacked', 'split', 'centered'];
export const HEADING_TAGS = ['h1', 'h2', 'h3'];

export function renderHeadingGroup({
  overline = 'Szkolenia otwarte',
  title = 'Programy, które wybierają zespoły sprzedaży',
  lead = 'Warsztaty prowadzone przez praktyków: krótkie bloki teorii, dużo ćwiczeń i',
  leadStrong = 'przykłady z Waszej branży.',
  variant = 'stacked',
  headingTag = 'h2',
} = {}) {
  const variantName = HEADING_GROUP_VARIANTS.includes(variant) ? variant : 'stacked';
  const tagName = HEADING_TAGS.includes(headingTag) ? headingTag : 'h2';
  const hashtag = String(overline).startsWith('#');
  const parts = [
    overline
      ? renderText({ text: overline, variant: 'overline', tone: 'accent', className: `ds-heading-group__overline${hashtag ? ' is-hashtag' : ''}` })
      : '',
    title ? renderText({ text: title, variant: '3xl', tag: tagName, className: 'ds-heading-group__title' }) : '',
    lead || leadStrong ? renderText({ text: lead, strong: leadStrong, variant: 'body', className: 'ds-heading-group__lead' }) : '',
  ];
  return `<header class="ds-heading-group ds-heading-group--${escapeHtml(variantName)}">${parts.join('')}</header>`;
}
