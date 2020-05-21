import { expect } from 'chai';
import sinon from 'sinon';
import CodeReviewAction from '../src/'
import { Analyzer } from '../src/analyzer';
import { ReporterConstructor } from '../src/reporter';
import NopReporter from '../src/reporters/nop-reporter';


describe('action', () => {
  it('should return 0', async () => {
    class NopAnalyzer implements Analyzer {
      get Reporter(): ReporterConstructor {
        return NopReporter;
      }
      analyze(patterns: string): Promise<number> {
        return Promise.resolve(0);
      }
    }

    const action = new CodeReviewAction(NopAnalyzer);
    const exitStatus = await action.execute();
    expect(exitStatus).to.equal(0);
  });

  afterEach(() => {
    sinon.restore();
  });
});
