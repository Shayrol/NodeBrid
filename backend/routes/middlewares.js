// isLoggedIn, isNotLoggedIn 미들웨어

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect(`/?error=${message}`);
  }
};

// 로그인 중이면, req.isAuthenticated()는 true 그렇지 않으면 false
