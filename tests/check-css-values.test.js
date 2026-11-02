import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { globFiles } from '../scripts/glob-files.mjs';
import { checkCssSelectors, checkCssText, checkCssValues } from '../scripts/check-css-values.mjs';

const values = (css) => checkCssText(css).map((offence) => offence.value);

describe('checkCssText', () => {
  it('flags hex colours', () => {
    expect(checkCssText('.a {\n  color: #fff;\n}')).toEqual([{ file: '', line: 2, value: '#fff' }]);
  });

  it('flags px, rem, em, vw and vh literals', () => {
    expect(values('.a { padding: 12px 1rem; margin: 2em; width: 50vw; height: 100vh }')).toEqual(['12px', '1rem', '2em', '50vw', '100vh']);
  });

  it('flags colour functions and named colours', () => {
    expect(values('.a { color: rgb(0 0 0); background: hsl(10 20% 30%); border-color: red }')).toEqual(['rgb(', 'hsl(', 'red']);
  });

  it('flags a literal inside calc() and inside a var() fallback', () => {
    expect(values('.a { margin: calc(var(--space-4) + 8px); color: var(--color-x, #000) }')).toEqual(['8px', '#000']);
  });

  it('allows signed hairlines but not other signed lengths', () => {
    expect(values('.a { margin: -1px; outline-offset: -2px; inset: +1px }')).toEqual([]);
    expect(values('.a { margin: -3px }')).toEqual(['-3px']);
  });

  it('flags colour literals inside a data URI, encoded or not', () => {
    const tick = `.a { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none'%3E%3Cpath stroke='white' d='M0 0'/%3E%3C/svg%3E") }`;
    expect(values(tick)).toEqual(["data: stroke='white"]);
    expect(values(`.a { mask: url('data:image/svg+xml,<svg fill="%23fff"></svg>') }`)).toEqual(['data: fill="#fff']);
    expect(values(`.a { mask: url("data:image/svg+xml,<svg style='color:red'></svg>") }`)).toEqual(['data: color:red']);
  });

  it('allows currentColor, none and transparent inside a data URI', () => {
    expect(values(`.a { mask: url("data:image/svg+xml,<svg fill='none' stroke='currentColor'><stop stop-color='transparent'/></svg>") }`)).toEqual([]);
  });

  it('flags a literal in a custom property definition', () => {
    expect(values('.a { --gap: 12px }')).toEqual(['12px']);
  });

  it('allows hairlines, tokens, color-mix and keywords', () => {
    const css = `.a {
      border: 1px solid var(--color-border-default);
      outline: 2px solid currentColor;
      background: color-mix(in srgb, var(--color-brand-primary) 20%, transparent);
      margin: 0 auto;
      padding: 0px;
      width: calc(100% - var(--space-4));
      grid-template-columns: 1fr 2fr;
      line-height: 1.5;
      opacity: 0.5;
      color: inherit;
      display: none;
      transition: opacity 200ms ease;
      box-shadow: var(--shadow-card);
      font-family: var(--font-body);
    }`;
    expect(checkCssText(css)).toEqual([]);
  });

  it('does not take selectors, class names, comments, strings, urls or media queries for values', () => {
    const css = `/* color: #fff; padding: 12px */
      @media (min-width: 768px) { .red:hover, .a-12px { content: "red 12px #fff"; background: url(red-12px.svg) } }`;
    expect(checkCssText(css)).toEqual([]);
  });

  it('reports the line of a multi-line value', () => {
    expect(checkCssText('.a {\n  margin:\n    0\n    12px;\n}')).toEqual([{ file: '', line: 4, value: '12px' }]);
  });
});

describe('checkCssValues', () => {
  let directory;
  beforeAll(() => {
    directory = mkdtempSync(join(tmpdir(), 'check-css-'));
    mkdirSync(join(directory, 'nested'));
    writeFileSync(join(directory, 'nested', 'bad.css'), '.ds-a { color: #fff }\n');
    writeFileSync(join(directory, 'good.css'), '.ds-a { border: 1px solid var(--color-border-default) }\n');
  });
  afterAll(() => rmSync(directory, { recursive: true, force: true }));

  it('scans every file of a glob and names the file', () => {
    const offences = checkCssValues(`${directory.replaceAll('\\', '/')}/**/*.css`);
    expect(offences).toHaveLength(1);
    expect(offences[0]).toMatchObject({ line: 1, value: '#fff' });
    expect(offences[0].file).toMatch(/nested\/bad\.css$/);
  });

  it('passes for the real component CSS, and scans real files', () => {
    const files = globFiles('components/**/*.css');
    expect(files).toContain('components/base/base.css');
    expect(files).toContain('components/_template/_template.css');
    expect(checkCssValues('components/**/*.css')).toEqual([]);
  });
});

describe('checkCssSelectors', () => {
  const selectors = (css) => checkCssSelectors(css).map((offence) => offence.value);

  it('flags classes without the ds- prefix, with the line', () => {
    expect(checkCssSelectors('.ds-a { color: inherit }\n.button,\n.card .ds-b { color: inherit }')).toEqual([
      { file: '', line: 2, value: '.button' },
      { file: '', line: 3, value: '.card' },
    ]);
  });

  it('allows ds- classes, pseudo-classes, state classes on a ds- compound, and element selectors', () => {
    const css = `.ds-a:hover, .ds-a.is-open, .ds-a.has-icon > .ds-b::before, button.ds-c:not(.x), a[href^='#.nope'] { color: inherit }
      @media (min-width: 768px) { .ds-a { color: inherit } }
      @keyframes ds-spin { from { opacity: 0 } 50% { opacity: 1 } }`;
    expect(selectors(css)).toEqual([]);
  });

  it('flags a bare state class and a state class beside a foreign class', () => {
    expect(selectors('.is-open { color: inherit } .card.is-open { color: inherit }')).toEqual(['.is-open', '.card', '.is-open']);
  });

  it('flags data-brand in any selector', () => {
    expect(selectors(":root[data-brand='dcc'] .ds-a { color: inherit }")).toEqual(['data-brand']);
    expect(selectors('.ds-a[data-brand] { color: inherit }')).toEqual(['data-brand']);
  });

  it('does not read declarations or comments as selectors', () => {
    expect(selectors('/* .nope { } */ .ds-a { background: url(x.svg); content: ".nope" }')).toEqual([]);
  });
});
