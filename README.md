# mfe-dependency-analyzer

Generate a simple report to understand the imports across your microfrontend application. The report generated by this tool should be used in conjunction with **mfe-dependency-aggregator** (still not created) to be able to identify and visualize dependencies across all microfrontends.

## Usage

## Development

- `git clone --recursive https://github.com/filoxo/mfe-dependency-analyzer.git`
- `yarn install`
- `yarn --cwd mfe-deps-test-repo install`
- Execute locally

```sh
./bin/run -d mfe-deps-test-repo -f src/**/!(*.test|*.spec).js -r
```

### Testing

- `yarn test`
