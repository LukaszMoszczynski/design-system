// @vitest-environment happy-dom
// "Show code" on the Docs pages: the snippet is the template output a site pastes, not the decorated story DOM.
import { describe, expect, it } from 'vitest';
import { withComponentScripts } from '../.storybook/decorators.js';
import { pasteableSource } from '../.storybook/source.js';
import accordionMeta, { Playground as AccordionPlayground } from '../components/molecules/accordion/accordion.stories.js';
import { renderAccordion } from '../components/molecules/accordion/accordion.template.js';
import { renderButton } from '../components/atoms/button/button.template.js';

describe('docs source (Show code)', () => {
  // excludeDecorators makes Storybook take the code from the story's render(args), before withComponentScripts.
  const args = { ...accordionMeta.args, ...AccordionPlayground.args };
  const storyCode = accordionMeta.render(args);

  it('the decorated story DOM is what the snippet must not show (the check bites)', () => {
    const wrapper = withComponentScripts(() => storyCode);
    expect(wrapper.outerHTML).toContain('display: contents');
    expect(wrapper.outerHTML).toContain('data-ds-ready');
  });

  it('the Accordion Playground snippet is exactly the template output: no frame, no wrapper, no data-ds-ready', () => {
    const snippet = pasteableSource(storyCode);
    expect(snippet).not.toContain('data-ds-ready');
    expect(snippet).not.toContain('display: contents');
    expect(snippet).not.toContain('style="padding');
    expect(snippet).toBe(renderAccordion(args));
  });

  it('removes forced-state pseudo classes and keeps the component classes', () => {
    // The classes the state control (withForcedState) and forceState() add.
    const forced = renderButton({ text: 'Dalej' }).replace('class="ds-button ', 'class="pseudo-hover ds-button pseudo-focus-visible ');
    expect(forced).toContain('pseudo-focus-visible');
    const snippet = pasteableSource(`<div style="padding: 24px"><div style="width: 300px">${forced}</div></div>`);
    expect(snippet).toBe(renderButton({ text: 'Dalej' }));
  });

  it('keeps a wrapper that is not a style-only frame', () => {
    const markup = '<div class="ds-accordion"><p>A</p></div>';
    expect(pasteableSource(markup)).toBe(markup);
    const twoChildren = '<div style="display: grid"><p>A</p><p>B</p></div>'; // an Overview grid
    expect(pasteableSource(twoChildren)).toBe(twoChildren);
  });

  it('drops a data-ds-ready that reached the markup', () => {
    expect(pasteableSource('<div class="ds-carousel" data-ds-carousel data-ds-ready="true"></div>')).toBe('<div class="ds-carousel" data-ds-carousel></div>');
  });
});
