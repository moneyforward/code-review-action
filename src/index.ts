import util from 'util';
import { AnalyzerConstructor, AnalyzerConstructorParameter } from './analyzer';
import { ReporterConstructor, ReporterRepository } from './reporter';
import AnnotationReporter from './reporters/annotation-reporter';
import NopReporter from './reporters/nop-reporter';

export * as analyzer from './analyzer';
export * as reporter from './reporter';

const debug = util.debuglog('@moneyforward/code-review-action');

interface Action<T, U> {
  execute(args?: Iterable<T> | AsyncIterable<T>): U;
}

export default class CodeReviewAction implements Action<string, Promise<number>> {
  static createDefaultReporterRepository(): ReporterRepository {
    return new ReporterRepository(AnnotationReporter, NopReporter);
  }

  private readonly module: Promise<{ default: AnalyzerConstructor }>;
  private readonly files: string;
  private readonly args: AnalyzerConstructorParameter[];
  private readonly reporterTypeNotation: string | undefined;

  constructor(analyzerType?: AnalyzerConstructor, private readonly reporterRepository = CodeReviewAction.createDefaultReporterRepository()) {
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
    const reporterRepository = this.reporterRepository;
    const reporterTypeNotation = this.reporterTypeNotation;
    class Analyzer extends module.default {
      get Reporter(): ReporterConstructor {
        return super.Reporter || reporterRepository.get(reporterTypeNotation);
      }
    }
    const analyzer = new Analyzer(...this.args);
    return await analyzer.analyze(this.files);
  }
}
