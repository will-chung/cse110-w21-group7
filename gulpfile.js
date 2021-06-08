const { src, dest } = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')

function defaultTask(cb) {
    cb();
}

function minifyCSS(cb) {
    cb();
}

function minifyHTML(cb) {
    cb();
}

function minifyJS(cb) {
    src('source/javascript/src/**/**.js')
    .pipe(uglify({ 
        preserveComments: false
    }))
    .pipe(rename(function(path) {
        return {
            dirname: path.dirname,
            basename: path.basename,
            extname: path.extname
        }
    }))
    .pipe(dest(function(file) {
        return file.dest
    }))
    cb();
}

exports.minify = parallel(minifyHTML, minifyCSS, minifyJS)
exports.diff = diffTask

