import os from 'os';
import util from 'util';
import CodeReviewAction from '.';

const debug = util.debuglog('@moneyforward/code-review-action');

debug('Node.js %s (arch: %s; platform: %s; cups: %d)', process.version, process.arch, process.platform, os.cpus().length);

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
