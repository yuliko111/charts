'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),

    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    svgSymbols = require('gulp-svg-symbols'),

    sassLint = require('gulp-sass-lint'),
    eslint = require('gulp-eslint'),

    runSequence = require('gulp-run-sequence'),
    clean = require('gulp-clean'),
    include = require('gulp-include'),
    concat = require('gulp-concat');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        jsMaps: '/jsMaps',
        css: 'build/css/',
        cssMaps: '/cssMaps',
        img: 'build/img/',
        svg: 'build/img/svg',
        files: 'build/files/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        css: ['src/css/common.scss'],
        img: 'src/img/**/*.*',
        svg: 'src/img/svg/**/*.svg',
        files: 'src/files/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: ['src/css/*.scss'],
        img: 'src/img/**/*.*',
        svg: 'src/img/svg/**/*.svg',
        files: 'src/files/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: 'build',
    lintJs: '.jshintrc'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(include())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(include())
        .pipe(eslint(path.lintJs))
        .pipe(eslint.format())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write(path.build.jsMaps))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
    var plugins = [
        autoprefixer({browsers: ['last 2 version']}),
        cssnano()
    ];
    return gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        //.pipe(concat('style.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write(path.build.cssMaps))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('img:build', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('svg:build', function () {
    return gulp.src(path.src.svg)
        .pipe(svgSymbols({
            templates: [
                'default-svg',
                'default-css'
            ]
        }))
        .pipe(gulp.dest(path.build.svg))
        .pipe(reload({stream: true}));
});

gulp.task('files:build', function () {
    return gulp.src(path.src.svg)
});

gulp.task('files:build', function () {
    return gulp.src(path.src.files)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.files))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch(path.watch.css, function (event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.svg], function (event, cb) {
        gulp.start('svg:rebuild');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('svg:rebuild', function (cb) {
    runSequence('svg:build', 'html:build', cb);
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function () {
    return gulp.src(path.clean).pipe(clean());
});

gulp.task('build', function (cb) {
    runSequence('css:build', 'js:build', 'fonts:build', 'img:build', 'svg:build', 'files:build', 'html:build', cb);
});

gulp.task('default', function (cb) {
    runSequence('clean', 'build', 'webserver', 'watch', cb);
});