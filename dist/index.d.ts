import StaticCodeAnalyzer from '@moneyforward/sca-action-core';
interface Action<T, U> {
    execute(args?: Iterable<T> | AsyncIterable<T>): U;
}
declare type StaticCodeAnalyzerConstructorParameters = (string | boolean | number | object | null)[];
declare type StaticCodeAnalyzerConstructor = {
    new (...args: StaticCodeAnalyzerConstructorParameters): StaticCodeAnalyzer;
};
export default class CodeReviewAction implements Action<string, Promise<number>> {
    private readonly module;
    private readonly files;
    private readonly args;
    private readonly reporterTypeNotation;
    constructor(analyzerType?: StaticCodeAnalyzerConstructor);
    execute(): Promise<number>;
}
export {};
