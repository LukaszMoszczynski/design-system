// The `state` control of a Playground story: default, hover or focus, forced on the component without moving the mouse.
//
// It uses the same mechanism as storybook-addon-pseudo-states' `globals.pseudo`: the addon rewrites every stylesheet so
// that `:hover` also matches `.pseudo-hover` and `:focus-visible` `.pseudo-focus-visible`; this decorator puts those
// classes on the story's targets. It does not write the `pseudo` global itself, because that global is sticky (see
// components/README.md, Story contract): the forced state would leak into the next story. The class lives on the story's
// own DOM, so it ends with the render.
//
// Usage in a stories file:
//   import { STATE_ARG_TYPES } from '../../../.storybook/state.js';
//   argTypes: { ...STATE_ARG_TYPES, … }, args: { state: 'default', … },
//   parameters: { stateTargets: ['.ds-card-program'] }   // the elements that take the state (default: the first ds- element)
export const STATES = ['default', 'hover', 'focus'];

const PSEUDO_CLASSES = { hover: 'pseudo-hover', focus: 'pseudo-focus-visible' };

export const STATE_ARG_TYPES = {
  state: {
    control: 'inline-radio',
    options: STATES,
    description: 'Forced interaction state (Figma State). Default is at rest.',
    table: { category: 'Story' },
  },
};

export const withForcedState = (storyFn, context) => {
  const result = storyFn();
  const pseudoClass = PSEUDO_CLASSES[context.args?.state];
  if (!pseudoClass || !(result instanceof Element)) return result;
  const targets = context.parameters.stateTargets ?? ['[class*="ds-"]'];
  const elements = context.parameters.stateTargets
    ? targets.flatMap((selector) => [...result.querySelectorAll(selector)])
    : [result.querySelector(targets[0])].filter(Boolean);
  elements.forEach((element) => element.classList.add(pseudoClass));
  return result;
};

// Overview grids show the states side by side: forceState(markup, 'hover', ['.ds-card-program']) returns the markup with
// the pseudo class on the matching elements (the first ds- element when no selector is given).
export function forceState(markup, state, selectors) {
  const pseudoClass = PSEUDO_CLASSES[state];
  if (!pseudoClass) return markup;
  const template = document.createElement('template');
  template.innerHTML = markup;
  const elements = selectors
    ? selectors.flatMap((selector) => [...template.content.querySelectorAll(selector)])
    : [template.content.querySelector('[class*="ds-"]')].filter(Boolean);
  elements.forEach((element) => element.classList.add(pseudoClass));
  return template.innerHTML;
}

// A labelled cell of an Overview grid.
// `wide`: the cell takes the whole row (a two-column list, a row layout).
export const overviewCell = (label, markup, wide = false) =>
  `<figure style="margin: 0; display: grid; gap: var(--space-8); align-content: start${wide ? "; grid-column: 1 / -1" : ""}"><figcaption style="font: 12px/1.4 system-ui, sans-serif; color: var(--color-text-muted)">${label}</figcaption>${markup}</figure>`;

export const overviewGrid = (cells, minimum = '240px') =>
  `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(${minimum}, 100%), 1fr)); gap: var(--space-32) var(--space-24); align-items: start; padding: var(--space-24) var(--space-gutter)">${cells.join('')}</div>`;
