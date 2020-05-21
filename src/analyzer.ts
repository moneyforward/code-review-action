import { ReporterConstructor } from "./reporter";

export interface Analyzer {
  readonly Reporter: ReporterConstructor;
  analyze(patterns: string): Promise<number>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnalyzerConstructorParameter = any;

export type AnalyzerConstructor = {
  new(...args: AnalyzerConstructorParameter[]): Analyzer;
};
