// Social row: the row of Social buttons, 4 px apart. Figma: Molecules → Social row (76:177), Style Plain / Raised.
// DCC: dcc_social_list() + .dcc-social (assets/css/components/social.css). The footer places the Raised row under its
// "Social media" label; contact, people and post sharing use Plain.
// It prints the Social button atom's list (renderSocialList), so the CSS is atoms/social-button/social-button.css.
import { renderSocialList } from '../../atoms/social-button/social-button.template.js';

export const SOCIAL_ROW_VARIANTS = ['plain', 'raised'];
export const DEFAULT_SOCIAL_ITEMS = ['linkedin', 'facebook', 'instagram', 'youtube'].map((network) => ({ network, href: '#' }));

export function renderSocialRow({ items = DEFAULT_SOCIAL_ITEMS, variant = 'plain' } = {}) {
  return renderSocialList({ items, variant: SOCIAL_ROW_VARIANTS.includes(variant) ? variant : 'plain' });
}
