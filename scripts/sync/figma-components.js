// Runs inside Figma via the use_figma MCP tool (Plugin API). Read-only.
// Returns { sets: [{ key, name, id, page }], components: [{ key, name, id, page }] }
// sets = component sets (a component with variants): key is the COMPONENT SET key, which is what an instance's
//        mainComponent.parent.key reports.
// components = standalone components (not inside a set): key is the component key (mainComponent.key).
// Save the answer as tmp/figma-components.json; scripts/component-map.mjs reads it.
// use_figma return values are capped at 48 KB: if the answer is bigger, list page names in ONLY_PAGES and merge the runs.
const ONLY_PAGES = [];

const sets = [];
const components = [];

function walk(node, pageName) {
  if (node.type === 'COMPONENT_SET') {
    sets.push({
      key: node.key,
      name: node.name,
      id: node.id,
      page: pageName,
    });
    return;
  }
  if (node.type === 'COMPONENT') {
    components.push({ key: node.key, name: node.name, id: node.id, page: pageName });
    return;
  }
  if ('children' in node) {
    for (const child of node.children) walk(child, pageName);
  }
}

for (const page of figma.root.children) {
  if (ONLY_PAGES.length > 0 && !ONLY_PAGES.includes(page.name)) continue;
  await page.loadAsync();
  for (const child of page.children) walk(child, page.name);
}

return { sets, components };
