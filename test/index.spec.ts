import { expect } from 'chai';
import path from 'path';
import sinon from 'sinon';
import CodeReviewAction from '../src/index'

describe('action', () => {
  it('should return 0', async () => {
    const env = {
      INPUT_ANALYZER: path.join(process.cwd(), 'test', 'analyzer'),
      INPUT_FILES: undefined,
      INPUT_OPTIONS: undefined,
      INPUT_WORKING_DIRECTORY: undefined,
      INPUT_REPORTER_TYPE_NOTATION: undefined,
      GITHUB_BASE_REF: 'HEAD',
      GITHUB_SHA: 'HEAD',
    };
    sinon.replace(global.process, 'env', Object.assign(env, global.process.env));
    sinon.replace(global.process, 'chdir', () => undefined);
    const exitStatus = await new CodeReviewAction().execute();
    expect(exitStatus).to.equal(0);
  });

  afterEach(() => {
    sinon.restore();
  });
});
