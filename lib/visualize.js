const fs = require("fs");
const Parcel = require("parcel-bundler");
const path = require("path");
const uniqWith = require("lodash.uniqwith");
const isEqual = require("lodash.isequal");

const reportOutput = path.join(__dirname, "./visualize/data.json");
const entry = path.join(__dirname, "./visualize/index.html");

const dedupe = (arr) => uniqWith(arr, isEqual);

module.exports = async function visualize(report) {
  const nodes = dedupe(
    [
      {
        id: report.name,
        group: "application",
      },
    ].concat(
      report.dependencies.map((dep) => ({
        id: dep.module,
        group: "dependency",
      }))
    )
  );

  const links = dedupe(
    report.dependencies.map((dep) => ({
      source: report.name,
      target: dep.module,
    }))
  );

  fs.writeFileSync(reportOutput, JSON.stringify({ nodes, links }, null, 2));

  const bundler = new Parcel(entry);

  await bundler.serve();
  // process.exit();
};
