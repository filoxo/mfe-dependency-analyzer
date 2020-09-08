const babel = require("@babel/parser");
const fs = require("fs").promises;
const walk = require("tree-walk");
const workerpool = require("workerpool");

async function analyze(matchPath, options) {
  const fileBlob = await fs.readFile(matchPath, { encoding: "utf-8" });
  const ast = babel.parse(fileBlob, { sourceType: "unambiguous", ...options });
  const report = getES6Imports(ast, matchPath);
  return report;
}

function getNodesByType(tree, nodeType) {
  return walk.filter(
    tree,
    walk.preorder,
    (value, key, parent) =>
      value &&
      typeof value === "object" &&
      value.type &&
      value.type === nodeType
  );
}

function getES6Imports(ast, source) {
  return getNodesByType(ast, "ImportDeclaration")
    .filter((node) => node.source.type === "StringLiteral")
    .map((node) => ({
      type: "ES6",
      import: node.specifiers.map(({ type, imported, local }) => ({
        type: mapToReadableSpecifierType(type),
        name: (imported && imported.name) || local.name,
      })),
      module: node.source.value,
      source,
    }));
}

function mapToReadableSpecifierType(type) {
  switch (type) {
    case "ImportSpecifier":
      return "specifier";
    case "ImportDefaultSpecifier":
      return "default";
    case "ImportNamespaceSpecifier":
      return "namespace";
    default:
      throw new Error(`Unexpected import of type ${type}`);
  }
}

workerpool.worker({
  analyze,
});
