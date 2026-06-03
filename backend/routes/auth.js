const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

// 회원가입
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUer = await User.findOne({ where: { email } });
    if (exUer) {
      return res.status(409).json({
        message: "이미 가입된 이메일입니다.",
        provider: exUer.provider,
      });
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });

    return res.status(201).json({
      message: "회원가입 성공",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

// 로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  // passport/localStrategy.js의 done(null, exUser)에서 전달되는데 null은 authError, exUser는 user로 전달됨
  // 로그인 실패 시 done(null, false, { message: "비밀번호가 일치하지 않습니다." })에서 false는 user로 전달되고 message는 info로 전달됨
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      // return res.redirect(`/?loginError=${info.message}`);
      return res.status(401).json({
        success: false,
        message: info.message,
      });
    }
    // 세션 로그인
    return req.login(user, (loginError) => {
      // 세션 저장 실패
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 로그인 성공
      // return res.redirect("/");
      return res.status(200).json({
        success: true,
        message: "로그인 성공",
        user: {
          id: user.id,
          email: user.email,
          nick: user.nick,
          provider: user.provider,
        },
      });
    });
  })(req, res, next);
});

// 로그아웃
router.get("/logout", isLoggedIn, (req, res, next) => {
  const provider = req.user?.provider;

  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");

      // 카카오인 경우 - 로컬 페이지 아닌 카카오 자체 로그아웃
      if (provider === "kakao") {
        const clientId = process.env.KAKAO_ID;

        const kakaoLogoutUrl =
          `https://kauth.kakao.com/oauth/logout` +
          `?client_id=${clientId}` +
          `&logout_redirect_uri=http://localhost:3000`;

        return res.json({
          ok: true,
          redirectUrl: kakaoLogoutUrl,
        });
      }

      // 로컬 로그인
      return res.json({
        ok: true,
        redirectUrl: "http://localhost:3000",
      });
    });
  });
});

// 닉네임 체크
router.get("/check-nick", async (req, res) => {
  const { nick } = req.query;

  const exUser = await User.findOne({ where: { nick } });

  if (exUser) {
    return res.json({
      available: false,
    });
  }

  return res.json({
    available: true,
  });
});

// 카카오 로그인
router.get("/kakao", (req, res, next) => {
  // 카카오 요청 응답에 state를 포함하여 전달 받기 위해 추가를 해서 req.query.state를 저장을 하고
  // 리다이렉트 전까지 req.query.state 초기화를 막기위해 callback으로 넘겨 아래 /kakao/callback에서 req를 꺼내 사용할 수 있게 한다.
  passport.authenticate("kakao", {
    prompt: "login",
    state: req.query.state,
  })(req, res, next);
});

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "http://localhost:3000/",
  }),

  (req, res) => {
    const returnUrl = req.query.state || "/";

    // 로그인 성공후 이전 페이지로 다시 이동
    res.redirect(`http://localhost:3000${returnUrl}`);
  },
);

module.exports = router;
