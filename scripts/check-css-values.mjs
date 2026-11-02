// Guard: component CSS may only use tokens, never raw colours or sizes, so every component follows the brand switch.
// Allowed: var(--…), color-mix(), 0, 1px/2px hairlines, %, fr, unitless numbers, currentColor, transparent, inherit,
// calc() of allowed operands, and keywords (none, auto, solid, …). Flagged: hex/rgb/hsl/… colours, named colours,
// and length literals (px, rem, em, vw, vh, …) other than the hairlines.
// At-rule preludes (@media (min-width: …)) are not checked: media queries cannot use var().
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { globFiles } from './glob-files.mjs';

const NAMED_COLORS = `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown
burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray
darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue
darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite
forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory
khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen
lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime
limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue
mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive
olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum
powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue
slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke
yellow yellowgreen canvas canvastext highlight highlighttext buttonface buttontext linktext graytext field fieldtext`.split(/\s+/);

const LENGTH_UNITS = 'px|rem|em|vw|vh|vmin|vmax|svw|svh|lvw|lvh|dvw|dvh|cqw|cqh|cqi|cqb|cqmin|cqmax|ch|ex|lh|rlh|cap|ic|pt|pc|cm|mm|q|in';
const HAIRLINE = /^[12]px$/;

const DECLARATION = /(--[\w-]+|[a-z-]+)\s*:\s*([^;{}]+)(?=[;}])/gi;
const COLOR_FUNCTION = /(?<![\w-])(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|device-cmyk)\(/gi;
const HEX_COLOR = /#[0-9a-f]{3,8}(?![\w-])/gi;
const LENGTH = new RegExp(String.raw`(?<![\w.#-])[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?(${LENGTH_UNITS})(?![\w-])`, 'gi');
const NAMED_COLOR = new RegExp(String.raw`(?<![\w.#-])(${NAMED_COLORS.join('|')})(?![\w(-])`, 'gi');

// Blank out comments, keeping offsets (and so line numbers) intact.
function blank(css) {
  const spaces = (match) => match.replace(/[^\n]/g, ' ');
  return css.replace(/\/\*[\s\S]*?\*\//g, spaces);
}

function maskValue(value) {
  const spaces = (match) => ' '.repeat(match.length);
  return value
    .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, spaces)
    .replace(/url\([^)]*\)/gi, spaces)
    .replace(/--[\w-]+/g, spaces);
}

export function checkCssText(css, file = '') {
  const source = blank(css);
  const offences = [];
  for (const declaration of source.matchAll(DECLARATION)) {
    const valueStart = declaration.index + declaration[0].length - declaration[2].length;
    const masked = maskValue(declaration[2]);
    const flag = (match, text = match[0]) => {
      const position = valueStart + match.index;
      offences.push({ file, line: source.slice(0, position).split('\n').length, value: text.trim() });
    };
    for (const match of masked.matchAll(HEX_COLOR)) flag(match);
    for (const match of masked.matchAll(COLOR_FUNCTION)) flag(match, `${match[1]}(`);
    for (const match of masked.matchAll(LENGTH)) {
      if (!HAIRLINE.test(match[0]) && !/^[+-]?0*\.?0+[a-z]+$/i.test(match[0])) flag(match);
    }
    for (const match of masked.matchAll(NAMED_COLOR)) flag(match);
  }
  return offences;
}

export function checkCssValues(globPattern) {
  return globFiles(globPattern)
    .sort()
    .flatMap((file) => checkCssText(readFileSync(file, 'utf8'), file.replaceAll('\\', '/')));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const offences = checkCssValues(process.argv[2] ?? 'components/**/*.css');
  for (const { file, line, value } of offences) console.error(`${file}:${line}  ${value}`);
  process.exit(offences.length ? 1 : 0);
}
