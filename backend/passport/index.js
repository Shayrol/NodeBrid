const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  // 로그인 시 실행되며, session에 어떤 데이터를 저장하는 메서드
  passport.serializeUser((user, done) => {
    // 첫 번째 인자는 에러, 두 번째 인자는 user.id를 저장
    done(null, user.id);
  });

  // 매 요청 시 실행되며, serializeUser에 저장한 두 번째 인수 user.id가
  // deserializeUser의 첫 번째 매개변수가 되어 해당 user.id를 통해 DB에서 사용자 정보를 조회를 해
  // req.user에 저장하므로 req.user로 로그인한 사용자의 정보를 가져올 수 있다.
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        },
      ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};

// serializeUser는 로그인 할 때만 실행이 되는 것이며, 저장 용량으로 user.id만 저장을 한다.
// session에 객체로 사용자 id를 저장을 함
// deserializeUser는 매 요청 시 실행이 되는 것이며, serializeUser에 저장된 user.id를 통해
// 매개변수 id로 받아와 DB에서 사용자 정보를 조회를 하고 req.user에 저장을 한다.

// 이렇게 하는 이유는 세션에 모든 정보를 저장하는 것이 불필요하기에 user.id만 저장을하고
// 매 요청 마다 DB에서 사용자 정보를 조회하는게 효율적이기 때문이다.

// ❗ 전체과정
// 1. 라우터를 통해 로그인 요청이 들어옴
// 2. 라우터에서 passport.authenticate 메어드 호츌
// 3. 로그인 전략 수행
// 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
// 5. req.login 메서드가 passport.serializeUser 호출
// 6. req.session에 사용자 아이디만 저장
// 7. 로그인 완료

// ❗ 로그인 이후 과정
// 1. 요청이 들어옴
// 2. 라우터에 요청이 도달하기 저에 passport.session 미들웨어가 passport.deserializeUser 메서드 호출
// 3. req.session에 저장된 아이디로 DB에서 사용자 조회
// 4. 조회된 사용자 정보를 req.user에 저장
// 5. 라우터에서 req.user 객체 사용 가능
