# Code review action

Analyze code statically in Github actions

## Inputs

### `analyzer`

Specify the analyzer plugin

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
      - name: Analyze code statically using Brakeman
        uses: moneyforward/code-review-action@v0
        with:
          analyzer: '@moneyforward/code-review-action-brakeman-plugin'
```

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/moneyforward/code-review-action

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
