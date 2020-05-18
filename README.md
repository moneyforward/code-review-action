# Code review action

Analyze code statically in Github actions

## Inputs

### `analyzer`

Specify the analyzer plugin

- [@moneyforward/code-review-action-brakeman-plugin](https://www.npmjs.com/package/@moneyforward/code-review-action-brakeman-plugin)
- [@moneyforward/code-review-action-rubocop-plugin](https://www.npmjs.com/package/@moneyforward/code-review-action-rubocop-plugin)
- [@moneyforward/code-review-action-rails_best_practices-plugin](https://www.npmjs.com/package/@moneyforward/code-review-action-rails_best_practices-plugin)
- [@moneyforward/code-review-action-misspell-plugin](https://www.npmjs.com/package/@moneyforward/code-review-action-misspell-plugin)

... and more

### `options`

Changes the analyzer options.

Specify the options in JSON format.

### `files`

Specify files or directories

(Multiple files or directories can be specified by separating them with line feed)

### `working_directory`

Changes the current working directory of the Node.js process

### `reporter_type_notation`

Change the reporter.

(Multiple can be specified separated by commas)

## Example usage

```yaml
name: Analyze code statically
"on": pull_request
jobs:
  brakeman:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: sudo npm i -g @moneyforward/code-review-action-brakeman-plugin@~0
      - id: node-env
        run: echo "::set-output name=path::$(npm root -g)"
      - name: Analyze code statically using Brakeman
        uses: moneyforward/code-review-action@v0
        env:
          NODE_PATH: ${{ steps.node-env.outputs.path }}
        with:
          analyzer: '@moneyforward/code-review-action-brakeman-plugin'
```

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/moneyforward/code-review-action

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
