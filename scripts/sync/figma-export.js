// Runs inside Figma via the use_figma MCP tool (Plugin API). Read-only.
// Returns { collections: [{ name, modes, variables: [{ name, type, codeSyntax, description, valuesByMode }] }],
//           effectStyles: [{ name, description, effects: [{ type, offsetX, offsetY, blur, spread, color, colorAlias }] }] }
// colorAlias is "<Collection>/<variable name>" when the shadow colour is bound to a variable, else null.
// Optional: list collection names to export (use_figma return values are capped at 48 KB,
// so a large file is exported in several runs and the parts merged). Empty = all.
const ONLY = [];
// Optional: slice of each collection's variables (for one that is still over the cap on its own).
const FROM = 0;
const TO = Infinity;

const round = (number) => Math.round(number * 10000) / 10000;
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const result = [];

for (const collection of collections) {
  if (ONLY.length > 0 && !ONLY.includes(collection.name)) continue;
  const variables = [];
  for (const variableId of collection.variableIds.slice(FROM, TO)) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    const valuesByMode = {};
    for (const [modeId, value] of Object.entries(variable.valuesByMode)) {
      if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
        const target = await figma.variables.getVariableByIdAsync(value.id);
        const targetCollection = await figma.variables.getVariableCollectionByIdAsync(target.variableCollectionId);
        valuesByMode[modeId] = { alias: `${targetCollection.name}/${target.name}` };
      } else {
        valuesByMode[modeId] = value && typeof value === 'object'
          ? { r: round(value.r), g: round(value.g), b: round(value.b), a: round(value.a) }
          : value;
      }
    }
    variables.push({
      name: variable.name,
      type: variable.resolvedType,
      codeSyntax: (variable.codeSyntax && variable.codeSyntax.WEB) || '',
      description: variable.description || '',
      valuesByMode,
    });
  }
  result.push({
    name: collection.name,
    modes: collection.modes.map((mode) => ({ modeId: mode.modeId, name: mode.name })),
    variables,
  });
}

// Local effect styles (drop and inner shadows). Exported with every run, they are small.
const effectStyles = [];
for (const style of await figma.getLocalEffectStylesAsync()) {
  const effects = [];
  for (const effect of style.effects) {
    if (!effect.visible || (effect.type !== 'DROP_SHADOW' && effect.type !== 'INNER_SHADOW')) continue;
    let colorAlias = null;
    const bound = effect.boundVariables && effect.boundVariables.color;
    if (bound) {
      const target = await figma.variables.getVariableByIdAsync(bound.id);
      const targetCollection = await figma.variables.getVariableCollectionByIdAsync(target.variableCollectionId);
      colorAlias = `${targetCollection.name}/${target.name}`;
    }
    effects.push({
      type: effect.type,
      offsetX: round(effect.offset.x),
      offsetY: round(effect.offset.y),
      blur: round(effect.radius),
      spread: round(effect.spread || 0),
      color: { r: round(effect.color.r), g: round(effect.color.g), b: round(effect.color.b), a: round(effect.color.a) },
      colorAlias,
    });
  }
  effectStyles.push({ name: style.name, description: style.description || '', effects });
}

return { collections: result, effectStyles };
