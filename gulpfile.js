const { reload } = require("browser-sync");
const { parallel } = require("gulp");
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");

// TASK SASS
function sassCompiler() {
  return gulp
    .src("scss/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
}
gulp.task("sass", sassCompiler);

// PLUGINS CSS
function pluginsCSS() {
  return gulp
    .src("css/lib/*.css")
    .pipe(concat("plugins.css"))
    .pipe(gulp.dest("css/"))
    .pipe(browserSync.stream());
}
gulp.task("plugincss", pluginsCSS);

// IMAGEMIN
function imageMin() {
  return gulp.src("./img/*").pipe(imagemin()).pipe(gulp.dest("./min-images"));
}

// CONCAT & UGLIFY
function concatJs() {
  return gulp
    .src("js/scripts/*.js")
    .pipe(concat("main.js"))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("js/"))
    .pipe(browserSync.stream());
}
gulp.task("concat-js", concatJs);

// PLUGINS JS
function pluginsJs() {
  return gulp
    .src(["./js/lib/"], {
      allowEmpty: true,
    })
    .pipe(concat("plugins.js"))
    .pipe(gulp.dest("js/"))
    .pipe(browserSync.stream());
}
gulp.task("pluginjs", pluginsJs);

// LIVE SERVER
function browser() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}
gulp.task("browser-sync", browser);

// WATCH
function watch() {
  gulp.watch("scss/*.scss", sassCompiler);
  gulp.watch("css/lib/*.css", pluginsCSS);
  gulp.watch("*.html").on("change", browserSync.reload);
  gulp.watch("js/scripts/*.js", concatJs);
  gulp.watch("js/lib/*.js", pluginsJs);
}
gulp.task("watch", watch);

// DEFAULT
gulp.task(
  "default",
  parallel(
    "watch",
    "browser-sync",
    "sass",
    "plugincss",
    "concat-js",
    "pluginjs"
  )
);
