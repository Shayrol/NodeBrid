const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User, Hashtag } = require("../models");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user
    ? req.user.Followings.map((f) => f.id)
    : [];
  next();
});

router.get("/me", isLoggedIn, (req, res) => {
  res.json(req.user);
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

// /post API 요청에 쿼리스트링으로 tag, search 옵션으로 필터 추가할 듯? 임시로 사용하기
router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;

  if (!query) {
    return res.status(400).json({
      message: "해시태그가 없습니다.",
    });
  }

  try {
    const hashtag = await Hashtag.findOne({
      where: { title: query },
    });

    let posts = [];

    if (hashtag) {
      posts = await hashtag.getPosts({
        include: [
          {
            model: User,
            attributes: ["id", "nick", "provider", "email"],
          },

          {
            model: User,
            as: "Likers",
            attributes: ["id"],
            through: {
              attributes: [],
            },
          },
          {
            model: Hashtag,
            attributes: ["id", "title"],
            through: { attributes: [] },
          },
        ],
        through: { attributes: [] },
        order: [["createdAt", "DESC"]],
      });
    }

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
