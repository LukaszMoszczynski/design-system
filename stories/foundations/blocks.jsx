// React blocks for the Foundations MDX pages. They draw every sample with var(--token) and print the
// value the page resolves for the brand/theme picked in the toolbar (getComputedStyle on <html>).
import React, { useEffect, useState } from 'react';
import { byPrefix, groupBy } from './token-list.js';
import './foundations.css';

export const POLISH_SAMPLE = 'Zażółć gęślą jaźń';

// Re-render when the toolbar changes data-brand / data-theme on <html>.
function useBrandTheme() {
  const read = () => `${document.documentElement.dataset.brand}/${document.documentElement.dataset.theme}`;
  const [brandTheme, setBrandTheme] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setBrandTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-brand', 'data-theme'] });
    return () => observer.disconnect();
  }, []);
  return brandTheme;
}

const resolved = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function Panel({ title, children }) {
  const brandTheme = useBrandTheme();
  return (
    <section className="sb-unstyled ds-foundations" data-showing={brandTheme}>
      {title && <h3 className="ds-foundations__title">{title} <span className="ds-foundations__context">{brandTheme}</span></h3>}
      {children}
    </section>
  );
}

function TokenLabel({ token, value = resolved(token.name) }) {
  return (
    <div className="ds-token">
      <code className="ds-token__name">{token.name}</code>
      <span className="ds-token__value">{value}</span>
      {token.alias && <span className="ds-token__alias">{token.alias}</span>}
    </div>
  );
}

export function ColorGroups({ tokens, depth }) {
  return [...groupBy(tokens, depth)].map(([group, members]) => (
    <Panel key={group} title={group}>
      <div className="ds-swatches">
        {members.map((token) => (
          <div className="ds-swatch" key={token.name}>
            <div className="ds-swatch__color" style={{ background: `var(${token.name})` }} />
            <TokenLabel token={token} />
            {token.description && <p className="ds-swatch__note">{token.description}</p>}
          </div>
        ))}
      </div>
    </Panel>
  ));
}

export function FontFamilies({ tokens }) {
  const families = byPrefix(tokens, 'font.family');
  return (
    <Panel title="font.family">
      {families.map((token) => (
        <div className="ds-type-row" key={token.name}>
          <p className="ds-type-sample" style={{ fontFamily: `var(${token.name})`, fontSize: 'var(--font-size-2xl)' }}>
            {POLISH_SAMPLE} 0123456789
          </p>
          <TokenLabel token={token} />
        </div>
      ))}
    </Panel>
  );
}

// Each size is shown with the line height of the same step, when there is one.
export function TypeScale({ tokens, title, family = 'var(--font-heading)' }) {
  const lineHeights = new Map(byPrefix(tokens, 'font.line-height').map((token) => [token.path.split('.').at(-1), token]));
  return (
    <Panel title={title}>
      {byPrefix(tokens, 'font.size').map((token) => {
        const step = token.path.split('.').at(-1);
        const lineHeight = lineHeights.get(step);
        return (
          <div className="ds-type-row" key={token.name}>
            <p
              className="ds-type-sample"
              style={{ fontFamily: family, fontSize: `var(${token.name})`, lineHeight: lineHeight ? `var(${lineHeight.name})` : undefined }}
            >
              {POLISH_SAMPLE}
            </p>
            <TokenLabel token={token} />
            {lineHeight && <TokenLabel token={lineHeight} />}
          </div>
        );
      })}
    </Panel>
  );
}

export function FontWeights({ tokens }) {
  return (
    <Panel title="font.weight">
      {byPrefix(tokens, 'font.weight').map((token) => (
        <div className="ds-type-row" key={token.name}>
          <p className="ds-type-sample" style={{ fontFamily: 'var(--font-heading)', fontWeight: `var(${token.name})`, fontSize: 'var(--font-size-xl)' }}>
            {POLISH_SAMPLE}
          </p>
          <TokenLabel token={token} />
        </div>
      ))}
    </Panel>
  );
}

export function SpaceScale({ tokens, title }) {
  return (
    <Panel title={title}>
      {tokens.map((token) => (
        <div className="ds-scale-row" key={token.name}>
          <TokenLabel token={token} />
          <div className="ds-space-bar" style={{ width: `var(${token.name})` }} />
        </div>
      ))}
    </Panel>
  );
}

export function RadiusScale({ tokens, title }) {
  return (
    <Panel title={title}>
      <div className="ds-radius-grid">
        {tokens.map((token) => (
          <div className="ds-radius" key={token.name}>
            <div className="ds-radius__box" style={{ borderRadius: `var(${token.name})` }} />
            <TokenLabel token={token} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

// Shadow samples: the shadow colour token on two card elevations. Offsets and blur are sample values for
// this page only; the Figma effect styles (Shadow/Card, Shadow/Lift) are not exported as tokens yet.
export function ShadowSamples({ token }) {
  const samples = [
    { label: 'Card', shadow: `0 2px 8px color-mix(in srgb, var(${token.name}) 12%, transparent)` },
    { label: 'Lift', shadow: `0 12px 32px color-mix(in srgb, var(${token.name}) 20%, transparent)` },
  ];
  return (
    <Panel title="color.shadow">
      <div className="ds-radius-grid">
        <div className="ds-swatch">
          <div className="ds-swatch__color" style={{ background: `var(${token.name})` }} />
          <TokenLabel token={token} />
        </div>
        {samples.map((sample) => (
          <div className="ds-shadow" key={sample.label}>
            <div className="ds-shadow__box" style={{ boxShadow: sample.shadow }}>{sample.label}</div>
            <code className="ds-token__value">{sample.shadow}</code>
          </div>
        ))}
      </div>
    </Panel>
  );
}
