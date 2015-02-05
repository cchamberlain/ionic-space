var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var bowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var order = require('gulp-order');
var sass = require('gulp-sass');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var underscore = require('underscore');
var underscoreStr = require('underscore.string');
var del = require('del');

var paths = {
    sass: ['./scss/**/*.scss'],
    src: {
        bower: './bower_components'
    },
    dest: {
        lib: 'www/lib',
        js: 'www/js',
        css: 'www/css',
        templates: 'www/templates'
    }
};

var fns = {
    getBowerFile: function () {
        return require('./bower.json');
    },
    getBowerDependencies: function () {
        return fns.getBowerFile().dependencies;
    },
    toFilteredArray: function (pathObj, exts) {
        var paths = [];
        if (underscore.isArray(pathObj)) {
            underscore.each(pathObj, function (path) {
                underscore.each(exts, function(ext) {
                    if (underscoreStr.endsWith(path, ext)) {
                        paths.push(path);
                    }
                });
            });
        }
        else {
            underscore.each(exts, function(ext) {
                if (underscoreStr.endsWith(pathObj, ext)) {
                    paths.push(pathObj);
                }
            });
        }
        return paths;
    }
};

var options = {
    bowerFiles: function (overrides) {
        return underscore.extend({
            debugging: false,
            paths: './'
        }, overrides);
    },
    gulpSrc: function (overrides) {
        return underscore.extend({
            read: false
        }, overrides);
    },
    inject: function (overrides) {
        return {
            ignorePath: '/www',
            addRootSlash: false
        }
    }
};

gulp.task('default', ['clean', 'sass', 'deploy-bower-scripts', 'deploy-bower-templates', 'index']);

gulp.task('clean', function (cb) {
    del(['build'], cb);
});

gulp.task('index', function () {
    var target = gulp.src('./www/index.html');
    var sources = gulp.src([
        './www/**/*.js', './www/**/*.css', './www/**/*.js.map', './www/**/*.css.map',
        '!./www/lib/ionic/**', '!./www/**/*.min.js', '!./www/**/*.min.css'], options.gulpSrc())
        .pipe(order(['**/d3/**', '**/jquery/**', '**/lib/**', '**/css/**', '**/js/**']));
    return target.pipe(inject(sources, options.inject()))
        .pipe(gulp.dest('./www'));
});

gulp.task('deploy-bower-scripts', function () {
    /*
     var bowerJs = gulp.src(bowerFiles(options.bowerFiles()), options.gulpSrc());
     bowerJs.pipe(gulp.dest('./dist'));
     */
    underscore.each(fns.getBowerDependencies(), function (value, bowerName) {
        var srcBowerDir = paths.src.bower + '/' + bowerName + '/';
        var srcBowerFile = require(srcBowerDir + 'bower.json');
        var srcPaths = fns.toFilteredArray(srcBowerFile.main, ['.js', '.js.map', '.css']);
        underscore.each(srcPaths, function (path) {
            var outputPath = paths.dest.lib + '/' + bowerName;
            gulp.src(srcBowerDir + path)
                .pipe(gulp.dest(outputPath));
        });
    });
});

gulp.task('deploy-bower-templates', function () {
    underscore.each(fns.getBowerDependencies(), function (value, bowerName) {
        var srcBowerDir = paths.src.bower + '/' + bowerName + '/';
        var srcBowerFile = require(srcBowerDir + 'bower.json');
        var srcPaths = fns.toFilteredArray(srcBowerFile.main, '.html');
        underscore.each(srcPaths, function (path) {
            gulp.src(srcBowerDir + path)
                .pipe(gulp.dest(paths.dest.templates));
        });
    });
});

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest(paths.dest.css))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest(paths.dest.css))
        .on('end', done);
});

gulp.task('bower', function (cb) {
    bower.commands.install([], {save: true}, {})
        .on('end', function (installed) {
            cb();
        })
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
