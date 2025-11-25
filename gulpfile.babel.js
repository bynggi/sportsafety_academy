import gulp from "gulp";
import del from "del";
import ws from "gulp-webserver";
import fileinclude from "gulp-file-include";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import miniCSS from "gulp-csso";
import replace from "gulp-replace";

// Sass 컴파일러 설정 (최신 API 사용)
const sass = gulpSass(dartSass.compiler || dartSass);

// 경로 설정
const routes = {
  html: {
    watch: "src/**/*.html",
    src: "src/**/*.html",
    dest: "app"
  },
  img: {
    watch: "src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}",
    src: "src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}",
    dest: "app/assets/images"
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "app/assets/css"
  },
  css: {
    watch: "src/assets/css/lib/*.css",
    src: "src/assets/css/lib/*.css",
    dest: "app/assets/css/lib"
  },
  font: {
    watch: "src/assets/fonts/**/*.{ttf,woff,woff2,eot,svg}",
    src: "src/assets/fonts/**/*.{ttf,woff,woff2,eot,svg}",
    dest: "app/assets/fonts"
  },
  video: {
    watch: "src/assets/video/**/*.{mp4,webm,ogg}",
    src: "src/assets/video/**/*.{mp4,webm,ogg}",
    dest: "app/assets/video"
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/**/*.js",
    dest: "app/assets/js"
  },
  jslib: {
    watch: "src/js/lib/*.js",
    src: "src/js/lib/*.js",
    dest: "app/assets/js/lib"
  }
};

// HTML 처리 (파일 include + 절대 경로 변환)
const html = () =>
  gulp
    .src(routes.html.src)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    // 상대 경로를 절대 경로로 변환
    .pipe(replace(/src="assets\//g, 'src="/assets/'))
    .pipe(replace(/href="assets\//g, 'href="/assets/'))
    .pipe(replace(/url\(['"]?assets\//g, "url('/assets/"))
    .pipe(replace(/url\(['"]?\.\.\/images\//g, "url('/assets/images/"))
    .pipe(replace(/background-image:\s*url\(['"]?assets\//g, "background-image: url('/assets/"))
    // srcset 처리: srcset 내의 모든 assets/를 /assets/로 변환
    .pipe(replace(/srcset="([^"]*)"/g, (match, p1) => {
      const replaced = p1.replace(/assets\//g, '/assets/');
      return `srcset="${replaced}"`;
    }))
    .pipe(gulp.dest(routes.html.dest));

// HTML 처리 (파일 include + 절대 경로 변환) - 배포용
const htmlBuild = () =>
  gulp
    .src(routes.html.src)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    // 상대 경로를 절대 경로로 변환
    .pipe(replace(/src="assets\//g, 'src="/assets/'))
    .pipe(replace(/href="assets\//g, 'href="/assets/'))
    .pipe(replace(/url\(['"]?assets\//g, "url('/assets/"))
    .pipe(replace(/url\(['"]?\.\.\/images\//g, "url('/assets/images/"))
    .pipe(replace(/background-image:\s*url\(['"]?assets\//g, "background-image: url('/assets/"))
    // srcset 처리: srcset 내의 모든 assets/를 /assets/로 변환
    .pipe(replace(/srcset="([^"]*)"/g, (match, p1) => {
      const replaced = p1.replace(/assets\//g, '/assets/');
      return `srcset="${replaced}"`;
    }))
    .pipe(gulp.dest(routes.html.dest));

// 이미지 복사
const img = () =>
  gulp.src(routes.img.src).pipe(gulp.dest(routes.img.dest));

// 폰트 복사
const font = () =>
  gulp.src(routes.font.src).pipe(gulp.dest(routes.font.dest));

// 비디오 복사
const video = () =>
  gulp.src(routes.video.src).pipe(gulp.dest(routes.video.dest));

// CSS 라이브러리 복사
const css = () =>
  gulp.src(routes.css.src).pipe(gulp.dest(routes.css.dest));

// SCSS 컴파일
const scss = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer]))
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

// SCSS 컴파일 (절대 경로 변환) - 배포용
const scssBuild = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer]))
    .pipe(replace(/url\(['"]?\.\.\/images\//g, "url('/assets/images/"))
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

// JavaScript 복사
const js = () => gulp.src(routes.js.src).pipe(gulp.dest(routes.js.dest));

// JavaScript 라이브러리 복사
const jslib = () =>
  gulp.src(routes.jslib.src).pipe(gulp.dest(routes.jslib.dest));

// 웹서버 실행
const webserver = () =>
  gulp.src("app").pipe(
    ws({
      livereload: true,
      open: true,
      port: 8081
    })
  );

// 빌드 폴더 정리
const clean = () => del(["app/", ".publish"]);

// 파일 변경 감시
const watch = () => {
  gulp.watch(routes.html.watch, html);
  gulp.watch(routes.img.watch, img);
  gulp.watch(routes.scss.watch, scss);
  gulp.watch(routes.css.watch, css);
  gulp.watch(routes.font.watch, font);
  gulp.watch(routes.video.watch, video);
  gulp.watch(routes.js.watch, js);
  gulp.watch(routes.jslib.watch, jslib);
};

// 초기 준비 작업 (정적 파일 복사)
const prepare = gulp.series([font, css, jslib, video]);

// 에셋 빌드 (개발용 - 상대 경로 유지)
const assets = gulp.series([html, scss, css, js, jslib, img, video]);

// 에셋 빌드 (배포용 - 절대 경로로 변환)
const assetsBuild = gulp.series([htmlBuild, scssBuild, css, js, jslib, img, video]);

// 라이브 서버 (웹서버 + 감시)
const live = gulp.parallel([webserver, watch]);

// 개발 모드 (초기 빌드 + 라이브 서버)
export const dev = gulp.series([prepare, assets, live]);

// 앱 빌드 (초기 빌드 + 에셋 빌드) - 개발용
export const app = gulp.series([prepare, assets]);

// 앱 빌드 (초기 빌드 + 에셋 빌드) - 배포용 (절대 경로)
export const appBuild = gulp.series([prepare, assetsBuild]);

// 빌드 (앱 빌드 + 라이브 서버) - 개발용
export const build = gulp.series([app, live]);

// 배포 (앱 빌드 + 절대 경로 변환)
export const deploy = gulp.series([appBuild]);

// 기본 작업
export default dev;

