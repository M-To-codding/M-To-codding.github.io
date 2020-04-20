var gulp = require('gulp'),
    scss = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    flexfixes = require('postcss-flexbugs-fixes'),
    autoprefixer = require('gulp-autoprefixer'),
    stripCssComments = require('gulp-strip-css-comments'),
    sourcemaps = require('gulp-sourcemaps'),
    uncss = require('gulp-uncss'),
    glob = require('gulp-sass-glob'),
    cleanCSS = require('gulp-clean-css'),

    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');


const paths = {
    baseSrc: '.',
    baseDist: './dist',
    src: {
        styles: './scss',
        components: './components',
        pngsprite: './png-sprite',
        svgsprite: './svg-sprite',
        images: './images',
        svg: './svg',
        scripts: './js',
        static: './data',
        includes: './_includes',
        fonts: './fonts',
        API: './API'
    },

    dist: {
        components: './dist/components',
        styles: './dist/css',
        images: './dist/images',
        optimizedImg: './dist/images-optimized',
        scripts: './dist/js',
        static: './dist/data',
        optimizedData: './dist/data-optimized',
        fonts: './dist/fonts',
        API: './dist/API'
    },
    inline: {
        styles: '/css',
        images: '/images'
    }
};

//------------ Styles ---------------

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('scss', () => {
    return gulp.src(`${paths.src.styles}/main.scss`)
        .pipe(plumber({errorHandler: handleError}))
        .pipe(sourcemaps.init())
        .pipe(glob())
        .pipe(scss()
            .on('error', scss.logError))
        .pipe(stripCssComments())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(postcss([
            flexfixes()
        ]))
        // .pipe(uncss({
        //     html: [`${paths.baseDist}/*.html`]
        // }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist.styles))
});


//------------ Scripts ---------------


gulp.task('scripts', function () {
    return gulp.src([
        paths.src.scripts + '/libs/jquery/jquery.min.js',
        paths.src.scripts + '/libs/**/*.js',
        paths.src.scripts + '/helpers/**/*.js',
        paths.src.scripts + '/components/**/*.js',
        paths.src.scripts + '/*.js'
    ])
        .pipe(concat('main.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(paths.dist.scripts))

})

gulp.task('watch-scripts', function () {
    gulp.watch(paths.src.scripts, gulp.series(['scripts']));
})

gulp.task('watch-scss', function () {
    gulp.watch(paths.src.styles, gulp.series(['scss']));
})


gulp.task('default', async function () {
    gulp.watch([paths.src.scripts, paths.src.styles], gulp.series(['scss', 'scripts']));
})
