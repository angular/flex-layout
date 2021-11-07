import {sync as glob} from 'glob';
import {mkdirpSync, copySync} from 'fs-extra';
import {join, dirname, basename, extname} from 'path';

/** Function to copy files that match a glob to another directory. */
export function copyFiles(fromPath: string, fileGlob: string, outDir: string, ext?: string) {
  glob(fileGlob, {cwd: fromPath}).forEach(filePath => {
    const filePathOutDir = join(outDir, filePath);
    const fileDestPath = !ext ? filePathOutDir : updateExtension(filePathOutDir, ext);
    mkdirpSync(dirname(fileDestPath));
    copySync(join(fromPath, filePath), fileDestPath);
  });
}

function updateExtension(file: string, extension: string) {
  const bs = basename(file, extname(file));
  return join(dirname(file), bs + extension);
}
