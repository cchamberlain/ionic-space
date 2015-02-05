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
        bower: './bower_components',
        bowerJs: './bower_components/**/*.js',
        bowerFonts: './bower_components/**/fonts/**/*.js',
        bowerHtml: './bower_components/**/*.html'
    },
    dest: {
        all: 'www/**',
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
                underscore.each(exts, function (ext) {
                    if (underscoreStr.endsWith(path, ext) || underscoreStr.endsWith(path, '**')) {
                        paths.push(path);
                    }
                });
            });
        }
        else {
            underscore.each(exts, function (ext) {
                if (underscoreStr.endsWith(pathObj, ext) || underscoreStr.endsWith(pathObj, '**')) {
                    paths.push(pathObj);
                }
            });
        }
        return paths;
    }
};

var options = {
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

gulp.task('default', ['sass']);

gulp.task('build', ['inject-index']);

gulp.task('clean', function (done) {
    del(['www/lib/**'], function (err, deletedFiles) {
        console.log('Files deleted: ', deletedFiles.join(', '));
        done();
    });
});

gulp.task('inject-index', ['deploy-bower'], function (done) {
    var target = gulp.src('./www/index.html');
    var sources = gulp.src([
        './www/**/*.js', './www/**/*.css', './www/**/*.js.map', './www/**/*.css.map',
        '!./www/**/*.min.css'], options.gulpSrc())
        .pipe(order([
            '**/ionic.js', '**/angular.js',
            '**/angular-animate.js', '**/angular-sanitize.js', '**/angular-ui-router.js',
            '**/ionic-angular.js',
            '**/d3/**', '**/jquery/**', '**/lib/**', '**/css/**', '**/js/**']));
    target.pipe(inject(sources, options.inject()))
        .pipe(gulp.dest('./www'))
        .on('end', done);
});

gulp.task('deploy-bower', ['sass', 'deploy-bower-scripts', 'deploy-bower-fonts', 'deploy-bower-templates']);

gulp.task('deploy-scss', ['clean'], function(done) {
    gulp.src(paths.src.bower + '/ionic/scss/**').pipe(gulp.dest('./www/lib/ionic/scss'))
        .on('end', done);
});

gulp.task('deploy-bower-fonts', ['clean'], function (done) {
    gulp.src(paths.src.bower + '/ionic/fonts/**').pipe(gulp.dest('./www/lib/ionic/fonts'))
        .on('end', done);
});

gulp.task('deploy-bower-scripts', ['clean'], function (done) {
    underscore.each(fns.getBowerDependencies(), function (value, bowerName) {
        var srcBowerDir = paths.src.bower + '/' + bowerName + '/';
        var srcBowerFile = require(srcBowerDir + 'bower.json');
        var srcPaths = fns.toFilteredArray(srcBowerFile.main, ['.js', '.js.map', '.bundle.js', '.css', '.scss']);
        underscore.each(srcPaths, function (path) {
            var outputPath = paths.dest.lib + '/' + bowerName;
            gulp.src(srcBowerDir + path)
                .pipe(gulp.dest(outputPath));
        });
    });
    done();
});

gulp.task('deploy-bower-templates', function (done) {
    underscore.each(fns.getBowerDependencies(), function (value, bowerName) {
        var srcBowerDir = paths.src.bower + '/' + bowerName + '/';
        var srcBowerFile = require(srcBowerDir + 'bower.json');
        var srcPaths = fns.toFilteredArray(srcBowerFile.main, '.html');
        underscore.each(srcPaths, function (path) {
            gulp.src(srcBowerDir + path)
                .pipe(gulp.dest(paths.dest.templates));
        });
    });
    done();
});

gulp.task('sass', ['deploy-scss'], function (done) {
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

gulp.task('bower', function (done) {
    bower.commands.install([], {save: true}, {})
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    /*gulp.watch(paths.src.bowerJs, ['deploy-bower-scripts']);
    gulp.watch(paths.src.bowerHtml, ['deploy-bower-templates']);*/
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
