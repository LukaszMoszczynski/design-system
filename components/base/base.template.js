// Markup sample for base.css: page defaults for headings, text, links and code.
// Convention for every component: <name>.template.js exports render<PascalName>(args) returning an HTML string.
import { escapeHtml } from '../_shared/escape.js';

export function renderBase({ heading = 'Zażółć gęślą jaźń', text = 'Pchnąć w tę łódź jeża lub ośm skrzyń fig.' } = {}) {
  return `<main style="padding: var(--space-gutter)">
  <h1>${escapeHtml(heading)}</h1>
  <h2>${escapeHtml(heading)}</h2>
  <h3>${escapeHtml(heading)}</h3>
  <h4>${escapeHtml(heading)}</h4>
  <h5>${escapeHtml(heading)}</h5>
  <p>${escapeHtml(text)} <a href="#base">Link w tekście</a>, <code>var(--font-mono)</code>.</p>
</main>`;
}
