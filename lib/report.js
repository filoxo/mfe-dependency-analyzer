const glob = require("glob");
const workerpool = require("workerpool");

const pool = workerpool.pool(__dirname + "/analyze-worker.js");

const globAsync = (files) =>
  new Promise((resolve, reject) => {
    glob(files, (err, matches) => {
      if (err) reject(err);
      resolve(matches);
    });
  });

module.exports = async function generateReport(name, files, options) {
  const matches = await globAsync(files);
  const result = await Promise.all(
    matches.map((matchPath) => pool.exec("analyze", [matchPath, options]))
  );
  const report = {
    name,
    dependendencies: result.flat(),
  };
  return report;
};
