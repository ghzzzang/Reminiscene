// app.js
"use strict";

/**
 * =====================================================================
 * Define Express app and set it up
 * =====================================================================
 */

// modules
const express = require("express"), // express를 요청
  layouts = require("express-ejs-layouts"), // express-ejs-layout의 요청
  app = express(); // express 애플리케이션의 인스턴스화

// controllers 폴더의 파일을 요청
const pagesController = require("./controllers/pagesController"),
  usersController = require("./controllers/usersController"),
  gamesController = require("./controllers/gamesController"),
  booksController = require("./controllers/booksController"),
  errorController = require("./controllers/errorController");

const router = express.Router(); // Express 라우터를 인스턴스화
app.use("/", router); // 라우터를 애플리케이션에 추가

const methodOverride = require("method-override"); // method-override 미들웨어를 요청
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
); // method-override 미들웨어를 사용

/**
 * =====================================================================
 * Flash Messages and Session
 * =====================================================================
 */
/**
 * Listing 22.1 (p. 325)
 * app.js에서의 플래시 메시지 요청
 */
const expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"); // Lesson 23 - express-validator 미들웨어를 요청

router.use(cookieParser("secret_passcode")); // cookie-parser 미들웨어를 사용하고 비밀 키를 전달
router.use(
  expressSession({
    // express-session 미들웨어를 사용
    secret: "secret_passcode", // 비밀 키를 전달
    cookie: {
      maxAge: 4000000, // 쿠키의 유효 기간을 설정
    },
    resave: false, // 세션을 매번 재저장하지 않도록 설정
    saveUninitialized: false, // 초기화되지 않은 세션을 저장하지 않도록 설정
  })
);
router.use(connectFlash()); // connect-flash 미들웨어를 사용

/**
 * =====================================================================
 * Passport Configuration and Middleware
 * =====================================================================
 */
/**
 * @TODO: 
 * 
 * Listing 24.1 (p. 351)
 * main.js에서 passport의 요청과 초기화
 */
// passport를 요청
// passport를 초기화
// passport가 Express.js 내 세션을 사용하도록 설정

const passport = require("passport");
router.use(passport.initialize());
router.use(passport.session());

/**
 * @TODO: 
 * 
 * Listing 24.2 (p. 351)
 * main.js에서 passport 직렬화 설정
 */
// User 모델을 요청
// User 모델의 인증 전략을 passport에 전달
// User 모델의 직렬화 메서드를 passport에 전달
// User 모델의 역직렬화 메서드를 passport에 전달

const User = require("./models/User");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * Listing 22.2 (p. 327)
 * 응답상에서 connectFlash와 미들웨어와의 연계
 */
router.use((req, res, next) => {
  // 응답 객체상에서 플래시 메시지의 로컬 flashMessages로의 할당
  res.locals.flashMessages = req.flash(); // flash 메시지를 뷰에서 사용할 수 있도록 설정

  /**
   * @TODO: 
   * 
   * Listing 24.7 (p. 358)
   * 사용자 정의 미들웨어로 로컬 변수 추가
   */
  // 로그인 여부를 확인하는 불리언 값을 로컬 변수에 추가
  // 현재 사용자를 로컬 변수에 추가
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;

  next();
});

/**
 * =====================================================================
 * Define Mongoose and MongoDB connection
 * =====================================================================
 */

// 애플리케이션에 Mongoose 설정
const mongoose = require("mongoose"), // mongoose를 요청
  dbName = "finalProject";

// 데이터베이스 연결 설정
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
  useNewUrlParser: true,
});

// 연결되면 메시지를 보냄
const db = mongoose.connection;
db.once("open", () => {
  console.log(`Connected to ${dbName} MongoDB using Mongoose!`);
});

/**
 * =====================================================================
 * Define app settings and middleware
 * =====================================================================
 */

app.set("port", process.env.PORT || 3000);

// ejs 레이아웃 렌더링
app.set("view engine", "ejs"); // ejs를 사용하기 위한 애플리케이션 세팅
router.use(layouts); // layout 모듈 사용을 위한 애플리케이션 세팅
router.use(express.static("public"));

// body-parser의 추가
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// express-validator의 추가
router.use(expressValidator());

/**
 * =====================================================================
 * Define routes
 * =====================================================================
 */

/**
 * Pages
 */
router.get("/", pagesController.showHome); // 홈 페이지 위한 라우트 추가
router.get("/about", pagesController.showAbout); // 코스 페이지 위한 라우트 추가
router.get("/transportation", pagesController.showTransportation); // 교통수단 페이지 위한 라우트 추가

/**
 * Listing 23.2 (p. 335)
 * app.js로 로그인 라우트를 추가
 */
router.get("/users/login", usersController.login); // 로그인 폼을 보기 위한 요청 처리
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
); // 로그인 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기

// @TODO: 

// Listing 24.7 후에 (p. 358)
// 로그아웃을 위한 라우트 추가
router.get("/users/logout", usersController.logout, usersController.redirectView);

/**
 * Users
 */
router.get("/users", usersController.index, usersController.indexView); // index 라우트 생성
router.get("/users/new", usersController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/users/create",
  usersController.validate, // Listing 23.6 (p. 344) - 사용자 생성 라우트에 유효성 체크 미들웨어 추가
  usersController.create,
  usersController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);


/*
 * Games 
 * 
*/
router.get("/games", gamesController.index, gamesController.indexView); // index 라우트 생성
router.get("/games/new", gamesController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/games/create",
  gamesController.create,
  gamesController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/games/:id", gamesController.show, gamesController.showView);
router.get("/games/:id/edit", gamesController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/games/:id/update",
  gamesController.update,
  gamesController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/games/:id/delete",
  gamesController.delete,
  gamesController.redirectView
);

/*
 * Books 
 * 
*/
router.get("/books", booksController.index, booksController.indexView); // index 라우트 생성
router.get("/books/new", booksController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/books/create",
  booksController.create,
  booksController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/books/:id", booksController.show, booksController.showView);
router.get("/books/:id/edit", booksController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/books/:id/update",
  booksController.update,
  booksController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/books/:id/delete",
  booksController.delete,
  booksController.redirectView
);


/**
 * =====================================================================
 * Errors Handling & App Startup
 * =====================================================================
 */
app.use(errorController.resNotFound); // 미들웨어 함수로 에러 처리 추가
app.use(errorController.resInternalError);

app.listen(app.get("port"), () => {
  // 3000번 포트로 리스닝 설정
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
