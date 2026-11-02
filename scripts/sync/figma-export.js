// Runs inside Figma via the use_figma MCP tool (Plugin API). Read-only.
// Returns { collections: [{ name, modes, variables: [{ name, type, codeSyntax, description, valuesByMode }] }] }
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

return { collections: result };
