import { expect } from 'chai';
import sinon from 'sinon';
import stream from 'stream';
import CodeReviewAction from '../src/'
import StaticCodeAnalyzer from '@moneyforward/sca-action-core'
import { transform } from '@moneyforward/stream-util';

describe('action', () => {
  it('should return 0', async () => {
    const env = {
      INPUT_ANALYZER: undefined,
      INPUT_FILES: undefined,
      INPUT_OPTIONS: undefined,
      INPUT_WORKING_DIRECTORY: undefined,
      INPUT_REPORTER_TYPE_NOTATION: 'NopReporter',
      GITHUB_BASE_REF: 'HEAD',
      GITHUB_SHA: 'HEAD',
    };
    sinon.replace(global.process, 'env', Object.assign(env, global.process.env));
    sinon.replace(global.process, 'chdir', () => undefined);
    sinon.replace(global.console, 'log', () => undefined);

    const NopAnalyzer = class extends StaticCodeAnalyzer {
      constructor() {
        super('node', ['-pe', '"hello, world!"']);
      }

      prepare(): Promise<void> {
        return Promise.resolve();
      }

      createTransformStreams(): stream.Transform[] {
        return [
          new transform.Lines(),
          new stream.Transform({
            objectMode: true,
            transform: (line, ecnoding, done): void => {
              done(null, { file: 'foo', message: line });
            }
          })
        ];
      }
    };

    const action = new CodeReviewAction(NopAnalyzer);
    const exitStatus = await action.execute();
    expect(exitStatus).to.equal(0);
  });

  afterEach(() => {
    sinon.restore();
  });
});
