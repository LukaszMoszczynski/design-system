// The pattern every component with JS copies: load the classic script into a happy-dom window,
// then prove behaviour and that init() twice attaches one handler.
import { beforeEach, describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { loadScript } from '../helpers/load-script.js';
import { renderExample } from '../../components/_template/_template.template.js';

const SCRIPT = 'components/_template/_template.js';

describe('example component script', () => {
  let window;
  let document;
  const button = () => document.querySelector('[data-ds-example]');

  beforeEach(() => {
    window = new Window();
    document = window.document;
    document.body.innerHTML = renderExample({ text: 'Przełącznik' });
    loadScript(SCRIPT, window);
  });

  it('registers window.DS.example and auto-inits', () => {
    expect(typeof window.DS.example.init).toBe('function');
    expect(button().dataset.dsReady).toBe('true');
  });

  it('toggles aria-pressed on click', () => {
    button().click();
    expect(button().getAttribute('aria-pressed')).toBe('true');
    button().click();
    expect(button().getAttribute('aria-pressed')).toBe('false');
  });

  it('init twice attaches one handler', () => {
    window.DS.example.init();
    window.DS.example.init(document);
    button().click();
    expect(button().getAttribute('aria-pressed')).toBe('true');
  });

  it('init picks up markup added later', () => {
    document.body.insertAdjacentHTML('beforeend', renderExample({ text: 'Drugi' }));
    window.DS.example.init();
    const added = document.querySelectorAll('[data-ds-example]')[1];
    added.click();
    expect(added.getAttribute('aria-pressed')).toBe('true');
    expect(button().getAttribute('aria-pressed')).toBe('false');
  });
});

describe('example template', () => {
  it('escapes text args', () => {
    expect(renderExample({ text: '<b>"x" & y</b>' })).toContain('&lt;b&gt;&quot;x&quot; &amp; y&lt;/b&gt;');
  });
});
