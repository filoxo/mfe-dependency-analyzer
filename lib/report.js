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

async function run(files, options) {
  const matches = await globAsync(files);
  const result = await Promise.all(
    matches.map((matchPath) => pool.exec("analyze", [matchPath, options]))
  );
  return result.flat()
}

module.exports = async function generateReport(name, files, options) {
  const result = await run(files, options)
  const report = {
    name,
    dependencies: result,
  };
  return report;
};
