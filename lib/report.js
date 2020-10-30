const glob = require('glob');
const workerpool = require('workerpool');
const pool = workerpool.pool(__dirname + '/analyze-worker.js');
const { join, sep } = require('path');

const globAsync = (files) =>
  new Promise((resolve, reject) => {
    glob(files, (err, matches) => {
      if (err) reject(err);
      resolve(matches);
    });
  });

async function run(dir, files) {
  const matches = await globAsync(join(dir, sep, files));
  if (!matches.length) throw new Error(`no files match '${files}'`);
  const result = await Promise.all(
    matches.map((filePath) => pool.exec('analyze', [dir, filePath]))
  );
  return result.flat();
}

module.exports = async function generateReport(name, dir, files, options) {
  const result = await run(dir, files);
  const report = {
    name,
    dependencies: result,
  };
  return report;
};
