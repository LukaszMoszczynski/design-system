// "Show code" on a component's Docs page: the HTML a site pastes.
//
// preview.js sets `docs.source.excludeDecorators`, so the code is the story's own render() string (the template output),
// not the DOM after the decorators: no `<div style="display: contents">` wrapper of withComponentScripts, no
// `data-ds-ready` from init() (pasted, it would make every script skip the element), no `pseudo-*` class of the state
// control. This transform removes what only Storybook adds inside render() itself:
// - the frame: a story wraps the component in style-only `<div style="…">` elements (padding, a backdrop, a width);
// - the `pseudo-*` classes forceState() puts on an Overview grid's forced states;
// - `data-ds-ready`, in case a render() ever returns markup that already ran through init().
// Everything else stays byte for byte as the template wrote it.

const FRAME_OPEN = /^<div style="[^"]*">/;
const FRAME_CLOSE = /<\/div>$/;

const significantNodes = (parent) =>
  [...parent.childNodes].filter((node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim());

// True when the markup is exactly one `<div>` whose only attribute is `style`, with nothing around it, wrapping one
// element (a component). A style-only grid of several cells (an Overview) is left as it is.
function isFrame(markup) {
  if (!FRAME_OPEN.test(markup) || !FRAME_CLOSE.test(markup)) return false;
  const template = document.createElement('template');
  template.innerHTML = markup;
  const nodes = significantNodes(template.content);
  if (nodes.length !== 1) return false;
  const [element] = nodes;
  const isStyleOnlyDiv = element.tagName === 'DIV' && element.attributes.length === 1 && element.hasAttribute('style');
  const inner = significantNodes(element);
  return isStyleOnlyDiv && inner.length === 1 && inner[0].nodeType === Node.ELEMENT_NODE;
}

function unwrapFrames(code) {
  let markup = code.trim();
  while (isFrame(markup)) markup = markup.replace(FRAME_OPEN, '').replace(FRAME_CLOSE, '').trim();
  return markup;
}

function withoutPseudoClasses(markup) {
  return markup.replace(/ class="([^"]*)"/g, (attribute, classes) => {
    const kept = classes.split(/\s+/).filter((name) => name && !name.startsWith('pseudo-'));
    return kept.length ? ` class="${kept.join(' ')}"` : '';
  });
}

export function pasteableSource(code) {
  if (typeof code !== 'string') return code;
  return withoutPseudoClasses(unwrapFrames(code)).replace(/\s+data-ds-ready(="[^"]*")?/g, '');
}
