import pkg from 'gulp'

const { parallel, src, dest } = pkg;

function copyPublic(cb) {
  return src("src/public/**/*").pipe(dest("dist/src/public"));
}

function copyViews(cb) {
    return src("src/views/**/*").pipe(dest("dist/src/views"));
}

export default parallel(copyViews, copyPublic)
