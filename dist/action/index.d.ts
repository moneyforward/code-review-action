import { AnalyzerConstructor } from '@moneyforward/sca-action-core';
interface Action<T, U> {
    execute(args?: Iterable<T> | AsyncIterable<T>): U;
}
export default class CodeReviewAction implements Action<string, Promise<number>> {
    private readonly module;
    private readonly files;
    private readonly args;
    private readonly reporterTypeNotation;
    constructor(analyzerType?: AnalyzerConstructor);
    execute(): Promise<number>;
}
export {};
