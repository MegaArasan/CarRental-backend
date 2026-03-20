const fs = require('fs');
const os = require('os');
const path = require('path');

const REPORT_TMP_DIRS = [path.resolve(process.cwd(), 'tmp'), os.tmpdir()];

exports.getReportFilePath = (filename) => {
  for (const dir of REPORT_TMP_DIRS) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.accessSync(dir, fs.constants.W_OK);
      return path.join(dir, filename);
    } catch {
      // Try the next candidate directory.
    }
  }

  throw new Error('No writable directory available for report generation.');
};
