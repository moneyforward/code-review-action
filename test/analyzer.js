const StaticCodeAnalyzer = require('@moneyforward/sca-action-core').default;

module.exports = class NopAnalyzer extends StaticCodeAnalyzer {
  prepare() {
    return Promise.resolve();
  }

  createTransformStreams() {
    return [];
  }
}
