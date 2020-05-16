import util from 'util';
import StaticCodeAnalyzer from '@moneyforward/sca-action-core';

const debug = util.debuglog('code-review-action');

interface Action<T, U> {
  execute(args?: Iterable<T> | AsyncIterable<T>): U;
}

type StaticCodeAnalyzerConstructorParameters = (string | boolean | number | object | null)[];

type StaticCodeAnalyzerConstructor = {
  new(...args: StaticCodeAnalyzerConstructorParameters): StaticCodeAnalyzer;
};

export default class CodeReviewAction implements Action<string, Promise<number>> {
  private readonly module: Promise<{ default: StaticCodeAnalyzerConstructor }>;
  private readonly files: string;
  private readonly args: StaticCodeAnalyzerConstructorParameters;
  private readonly reporterTypeNotation: string | undefined;

  constructor(analyzerType?: StaticCodeAnalyzerConstructor) {
    if (analyzerType) {
      this.module = Promise.resolve({ default: analyzerType });
    } else {
      if (!process.env.INPUT_ANALYZER) throw new TypeError('Environment variable `INPUT_ANALYZER` is undefined.');
      this.module = import(process.env.INPUT_ANALYZER);
    }
    this.files = process.env.INPUT_FILES || '.';
    const option = process.env.INPUT_OPTIONS ? JSON.parse(process.env.INPUT_OPTIONS) : [];
    this.args = [].concat(option);
    const workingDirectory = process.env.INPUT_WORKING_DIRECTORY;
    workingDirectory && process.chdir(workingDirectory);
  }

  async execute(): Promise<number> {
    const Analyzer = (await this.module).default;
    debug('Analyzer = %s', Analyzer.name);
    const analyzer = new Analyzer(...this.args);
    analyzer.reporterTypeNotation = this.reporterTypeNotation;
    return await analyzer.analyze(this.files);
  }
}

debug('%o', module);
if (!module.parent) {
  (async (): Promise<void> => {
    console.log('::echo::%s', process.env['RUNNER_DEBUG'] === '1' ? 'on' : 'off');
    try {
      process.exitCode = await new CodeReviewAction().execute();
    } catch (reason) {
      console.log('::error::%s', reason);
      process.exitCode = 1;
    } finally {
      process.exit();
    }
  })();
}
