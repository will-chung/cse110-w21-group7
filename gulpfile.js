const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const babel = require('gulp-babel')
const browserify = require('browserify');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');

const SRC = {
    html: 'source',
    css: 'source/css',
    js: 'source/javascript/src'
}

/**
 * Gulp task used to minify and clean CSS for production.
 * @param {Function} cb Gulp callback function. Used
 * to indicate when our task finishes
 */
function minifyCSS(cb) {
    gulp.src(`${SRC.css}/**/*.css`)
        .pipe(cleanCSS('source/target'))
        .pipe(gulp.dest(`${SRC.css}/`))
    cb();
}

/**
 * Gulp task used to minify and clean HTML for production.
 * @param {Function} cb Gulp callback function. Used
 * to indicate when our task finishes
 */
function minifyHTML(cb) {
    gulp.src(`${SRC.html}/*.html`)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
         }))
        .pipe(gulp.dest(`${SRC.html}/`))
    cb();
}

/**
 * Gulp task used to minify and clean JavaScript for production.
 * @param {Function} cb Gulp callback function. Used
 * to indicate when our task finishes
 */
function minifyJS(cb) {
    gulp.src(`${SRC.js}/**/*.js`)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename(function(path) {
            return {
                dirname: path.dirname,
                basename: path.basename,
                extname: path.extname
            }
        }))
        .pipe(gulp.dest(`${SRC.js}`));
    cb();
}

/**
 * Gulp task used to bundle static assets for production
 * @param {Function} cb Gulp callback function. Used
 * to indicate when our task finishes
 */
function bundle(cb) {
    gulp.src(`${SRC.js}/**/*.js`, {read: false})
        .pipe(tap(function (file) {
            file.contents = browserify(file.path, {debug: false}).bundle();
        }))
        .pipe(gulp.dest(`${SRC.js}`));
    cb();
}

exports.default = gulp.parallel(minifyHTML, minifyCSS, minifyJS)


exports.js = gulp.series(minifyJS, bundle)