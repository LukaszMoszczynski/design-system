// Markup template: the single source of the component's HTML. Stories and sections import it.
// Convention: <name>.template.js exports render<PascalName>(args) returning an HTML string.
// Text args go through escapeHtml; a WordPress theme prints the same markup from render.php with esc_html().
import { escapeHtml } from '../_shared/escape.js';

export function renderExample({ text = 'Przełącznik', pressed = false } = {}) {
  return `<button type="button" class="ds-example" data-ds-example aria-pressed="${pressed ? 'true' : 'false'}">${escapeHtml(text)}</button>`;
}
