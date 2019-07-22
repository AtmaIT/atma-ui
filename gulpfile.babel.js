import gulp from "gulp";
import plugins from "gulp-load-plugins";
import { argv } from "yargs";
import browserSync from "browser-sync";

const $ = plugins({
  pattern: ["*"],
  scope: ["dependencies"]
});

var config = require("./gulp.config");

const srcPath = argv.path ? `/${argv.path}/${argv.path}.scss` : "/all.scss";
const destPath = !argv.path
  ? config.paths.dest.scss
  : config.paths.dest.scss + `/${argv.path}`;
const src = argv.path ? destPath + `/${argv.path}.css` : destPath + "/all.css";

browserSync.create();

gulp.task("scss:compile", () => {
  return gulp
    .src(config.paths.src.scss + srcPath)
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sass())
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(destPath));
});

gulp.task("scss:postcss", () => {
  return gulp
    .src(src)
    .pipe(
      $.postcss([$.postcssPresetEnv({ stage: 0, browsers: "last 2 versions" })])
    )
    .pipe(gulp.dest(destPath));
});

gulp.task("scss:min", () => {
  let newName = argv.path ? `${argv.path}.min.css` : "all.min.css";

  return gulp
    .src(src)
    .pipe($.cleanCss({ compatibility: "ie11" }))
    .pipe($.rename(newName))
    .pipe(gulp.dest(destPath));
});

gulp.task("scss:watch", () => {
  return gulp.watch(
    config.paths.src.scss + "/**/*.scss",
    gulp.series(["scss:compile"])
  );
});

gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: config.paths.localServer
    }
  });
});

gulp.task("scss:dev", gulp.parallel(["scss:watch"]));

gulp.task(
  "scss:prod",
  gulp.series(["scss:compile", "scss:postcss", "scss:min"])
);
