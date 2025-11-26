import gulp from "gulp";
import del from "del";
import browserSync from "browser-sync";
import fileinclude from "gulp-file-include";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import miniCSS from "gulp-csso";
import replace from "gulp-replace";
import rename from "gulp-rename";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

// BrowserSync 인스턴스 생성
const bs = browserSync.create();

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
  scssAdmin: {
    watch: "src/assets/scss/admin/**/*.scss",
    src: "src/assets/scss/admin/style.scss",
    dest: "app/assets/css"
  },
  scssUser: {
    watch: "src/assets/scss/user/**/*.scss",
    src: "src/assets/scss/user/style.scss",
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
    watch: "src/assets/js/**/*.js",
    src: "src/assets/js/**/*.js",
    dest: "app/assets/js"
  },
  jslib: {
    watch: "src/assets/js/lib/*.js",
    src: "src/assets/js/lib/*.js",
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
    .pipe(replace(/src="\/images\//g, 'src="/assets/images/'))
    .pipe(replace(/href="\/images\//g, 'href="/assets/images/'))
    .pipe(replace(/url\(['"]?assets\//g, "url('/assets/"))
    .pipe(replace(/url\(['"]?\.\.\/images\//g, "url('/assets/images/"))
    .pipe(replace(/url\(['"]?\/images\//g, "url('/assets/images/"))
    .pipe(replace(/background-image:\s*url\(['"]?assets\//g, "background-image: url('/assets/"))
    // srcset 처리: srcset 내의 모든 assets/를 /assets/로 변환
    .pipe(replace(/srcset="([^"]*)"/g, (match, p1) => {
      const replaced = p1.replace(/assets\//g, '/assets/');
      return `srcset="${replaced}"`;
    }))
    .pipe(gulp.dest(routes.html.dest))
    .pipe(bs.stream());

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
    .pipe(replace(/src="\/images\//g, 'src="/assets/images/'))
    .pipe(replace(/href="\/images\//g, 'href="/assets/images/'))
    .pipe(replace(/url\(['"]?assets\//g, "url('/assets/"))
    .pipe(replace(/url\(['"]?\.\.\/images\//g, "url('/assets/images/"))
    .pipe(replace(/url\(['"]?\/images\//g, "url('/assets/images/"))
    .pipe(replace(/background-image:\s*url\(['"]?assets\//g, "background-image: url('/assets/"))
    // srcset 처리: srcset 내의 모든 assets/를 /assets/로 변환
    .pipe(replace(/srcset="([^"]*)"/g, (match, p1) => {
      const replaced = p1.replace(/assets\//g, '/assets/');
      return `srcset="${replaced}"`;
    }))
    .pipe(gulp.dest(routes.html.dest));

// 이미지 복사 (Node.js fs 모듈을 사용하여 바이너리 파일 손상 방지)
const img = async () => {
  const assetsImgDir = "src/assets/images";
  const destDir = "app/assets/images";
  
  if (!fs.existsSync(assetsImgDir)) {
    return Promise.resolve();
  }
  
  // 디렉토리 재귀적으로 생성하는 함수
  const ensureDir = async (dirPath) => {
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  };
  
  // 이미지 파일 복사 함수
  const copyImages = async (srcPath, destPath) => {
    try {
      const files = fs.readdirSync(srcPath, { withFileTypes: true });
      
      for (const file of files) {
        const srcFilePath = path.join(srcPath, file.name);
        const destFilePath = path.join(destPath, file.name);
        
        if (file.isDirectory()) {
          await ensureDir(destFilePath);
          await copyImages(srcFilePath, destFilePath);
        } else if (file.isFile() && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file.name)) {
          await ensureDir(path.dirname(destFilePath));
          await copyFile(srcFilePath, destFilePath);
        }
      }
    } catch (err) {
      console.error('이미지 복사 중 오류:', err);
    }
  };
  
  await ensureDir(destDir);
  await copyImages(assetsImgDir, destDir);
  
  // BrowserSync에 변경사항 알림
  if (bs.active) {
    bs.reload();
  }
  
  return Promise.resolve();
};

// 폰트 복사
const font = () =>
  gulp.src(routes.font.src, { allowEmpty: true }).pipe(gulp.dest(routes.font.dest));

// 비디오 복사
const video = () => {
  const videoDir = "src/assets/video";
  if (!fs.existsSync(videoDir)) {
    return Promise.resolve();
  }
  return gulp.src(routes.video.src, { allowEmpty: true })
    .pipe(gulp.dest(routes.video.dest))
    .pipe(bs.stream());
};

// CSS 라이브러리 복사
const css = () => {
  const cssDir = "src/assets/css/lib";
  if (!fs.existsSync(cssDir)) {
    return Promise.resolve();
  }
  return gulp.src(routes.css.src, { allowEmpty: true })
    .pipe(gulp.dest(routes.css.dest))
    .pipe(bs.stream());
};

// SCSS 컴파일 - Admin
const scssAdmin = () => {
  const adminScss = "src/assets/scss/admin/style.scss";
  if (!fs.existsSync(adminScss)) {
    return Promise.resolve();
  }
  return gulp
    .src(adminScss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer]))
    .pipe(miniCSS())
    .pipe(rename('admin-style.css'))
    .pipe(gulp.dest(routes.scssAdmin.dest))
    .pipe(bs.stream());
};

// SCSS 컴파일 - User
const scssUser = () => {
  const userScss = "src/assets/scss/user/style.scss";
  if (!fs.existsSync(userScss)) {
    return Promise.resolve();
  }
  return gulp
    .src(userScss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer]))
    .pipe(miniCSS())
    .pipe(rename('user-style.css'))
    .pipe(gulp.dest(routes.scssUser.dest))
    .pipe(bs.stream());
};

// SCSS 컴파일 (병렬 실행)
const scss = gulp.parallel([scssAdmin, scssUser]);

// SCSS 컴파일 (절대 경로 변환) - 배포용 - Admin
const scssAdminBuild = () => {
  const adminScss = "src/assets/scss/admin/style.scss";
  if (!fs.existsSync(adminScss)) {
    return Promise.resolve();
  }
  return gulp
    .src(adminScss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer]))
    .pipe(replace(/url\(['"]?\.\.\/images\//g, "url('/assets/images/"))
    .pipe(miniCSS())
    .pipe(rename('admin-style.css'))
    .pipe(gulp.dest(routes.scssAdmin.dest));
};

// SCSS 컴파일 (절대 경로 변환) - 배포용 - User
const scssUserBuild = () => {
  const userScss = "src/assets/scss/user/style.scss";
  if (!fs.existsSync(userScss)) {
    return Promise.resolve();
  }
  return gulp
    .src(userScss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer]))
    .pipe(replace(/url\(['"]?\.\.\/images\//g, "url('/assets/images/"))
    .pipe(miniCSS())
    .pipe(rename('user-style.css'))
    .pipe(gulp.dest(routes.scssUser.dest));
};

// SCSS 컴파일 (절대 경로 변환) - 배포용 (병렬 실행)
const scssBuild = gulp.parallel([scssAdminBuild, scssUserBuild]);

// JavaScript 복사
const js = () => {
  const jsDir = "src/assets/js";
  if (!fs.existsSync(jsDir)) {
    return Promise.resolve();
  }
  return gulp.src(routes.js.src, { allowEmpty: true })
    .pipe(gulp.dest(routes.js.dest))
    .pipe(bs.stream());
};

// JavaScript 라이브러리 복사
const jslib = () => {
  const jslibDir = "src/assets/js/lib";
  if (!fs.existsSync(jslibDir)) {
    return Promise.resolve();
  }
  return gulp.src(routes.jslib.src, { allowEmpty: true }).pipe(gulp.dest(routes.jslib.dest));
};

// 웹서버 실행 (BrowserSync)
const webserver = () => {
  const port = 8081;
  const url = `http://localhost:${port}`;
  
  console.log("\n========================================");
  console.log(`🚀 서버가 시작되었습니다!`);
  console.log(`📍 URL: ${url}`);
  console.log("========================================\n");
  
  bs.init({
    server: {
      baseDir: "app",
      index: "index.html"
    },
    port: port,
    open: true,
    notify: false,
    reloadOnRestart: true
  });
  
  return Promise.resolve();
};

// 빌드 폴더 정리
const clean = () => del(["app/", ".publish"]);

// 파일 변경 감시
const watch = () => {
  // HTML 파일 변경 감시 (common 폴더 포함)
  gulp.watch(routes.html.watch, html).on('change', (path) => {
    console.log(`[${new Date().toLocaleTimeString()}] HTML 파일 변경: ${path}`);
    bs.reload();
  });
  
  // 이미지 변경 감시
  gulp.watch(routes.img.watch, img).on('change', () => {
    bs.reload();
  });
  
  // SCSS 변경 감시 - Admin
  gulp.watch(routes.scssAdmin.watch, scssAdmin).on('change', (path) => {
    console.log(`[${new Date().toLocaleTimeString()}] Admin SCSS 파일 변경: ${path}`);
  });
  
  // SCSS 변경 감시 - User
  gulp.watch(routes.scssUser.watch, scssUser).on('change', (path) => {
    console.log(`[${new Date().toLocaleTimeString()}] User SCSS 파일 변경: ${path}`);
  });
  
  // CSS 라이브러리 변경 감시
  gulp.watch(routes.css.watch, css).on('change', () => {
    bs.reload();
  });
  
  // 비디오 변경 감시
  gulp.watch(routes.video.watch, video).on('change', () => {
    bs.reload();
  });
  
  // JavaScript 변경 감시
  gulp.watch(routes.js.watch, js).on('change', (path) => {
    console.log(`[${new Date().toLocaleTimeString()}] JS 파일 변경: ${path}`);
    bs.reload();
  });
  
  // JavaScript 라이브러리 변경 감시
  gulp.watch(routes.jslib.watch, jslib).on('change', () => {
    bs.reload();
  });
};

// 초기 준비 작업 (정적 파일 복사)
const prepare = gulp.series([css, jslib, video]);

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

