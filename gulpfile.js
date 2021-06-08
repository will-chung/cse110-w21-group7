const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const babel = require('gulp-babel')

const SRC = {
    html: 'source',
    css: 'source/css',
    js: 'source/javascript/src'
}

/**
 * Gulp task used to transpile from ES6 to ES5.
 * This is necessary for Gulp to properly minify
 * files.
 * @param {Function} cb Gulp callback function. Used
 * to indicate when our task finishes
 */
function transpile(cb) {
    gulp.src(`${SRC.js}/**/*.js`)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(`${SRC.js}/`))
    cb();
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
        .pipe(uglify().on('error', console.error))
        .pipe(rename(function(path) {
            return {
                dirname: path.dirname,
                basename: path.basename,
                extname: path.extname
            }
        }))
        .pipe(gulp.dest(`${SRC.js}/`));
    cb();
}

exports.default = gulp.series(transpile, gulp.parallel(minifyHTML, minifyCSS, minifyJS))
