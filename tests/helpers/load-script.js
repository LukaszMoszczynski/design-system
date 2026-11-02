// Evaluates a classic component script (no import/export) inside a happy-dom window, the way a browser loads it.
import { readFileSync } from 'node:fs';

export function loadScript(path, window) {
  window.eval(readFileSync(path, 'utf8'));
}
