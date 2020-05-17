import util from 'util';
import { AnalyzerConstructor, AnalyzerConstructorParameter } from '@moneyforward/sca-action-core';

const debug = util.debuglog('@moneyforward/code-review-action');

interface Action<T, U> {
  execute(args?: Iterable<T> | AsyncIterable<T>): U;
}

export default class CodeReviewAction implements Action<string, Promise<number>> {
  private readonly module: Promise<{ default: AnalyzerConstructor }>;
  private readonly files: string;
  private readonly args: AnalyzerConstructorParameter[];
  private readonly reporterTypeNotation: string | undefined;

  constructor(analyzerType?: AnalyzerConstructor) {
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
    this.reporterTypeNotation = process.env.INPUT_REPORTER_TYPE_NOTATION;
  }

  async execute(): Promise<number> {
    const module = await this.module;
    debug('%s', module);
    const Analyzer = module.default;
    const analyzer = new Analyzer(...this.args);
    analyzer.reporterTypeNotation = this.reporterTypeNotation;
    return await analyzer.analyze(this.files);
  }
}
