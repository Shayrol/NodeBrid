const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");

dotenv.config();

const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const usersRouter = require("./routes/users");

const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
// passport 설정
passportConfig();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

// 서버 연동
sequelize
  .sync({ force: false }) // db 전체 초기화 = true
  .then(() => {
    console.log("DB 연결에 성공했습니다.");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
);

// 미들웨어 등록
app.use(passport.initialize());
app.use(passport.session());

app.use("/img", express.static(path.join(__dirname, "uploads")));

// 라우터 등록
app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/users", usersRouter);

// 404번 처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 500번 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500).json({
    message: err.message,
    error: err,
  });
  // res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
