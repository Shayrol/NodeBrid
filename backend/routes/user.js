const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");
const router = express.Router();

// 팔로우 하기 (POST /user/:id/follow)
router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  console.log("팔로우: ", req.user.id);
  console.log("팔로우 query: ", req.params.id);
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로우 취소 (DELETE /user/:id/follow)
router.delete("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로워, 팔로윙 목록 불러오기
router.get("/follow", isLoggedIn, async (req, res, next) => {
  console.log("user: ", req.user);

  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: User,
          as: "Followers",
          attributes: ["id", "nick"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id", "nick"],
        },
      ],
    });

    res.status(200).json({
      followers: user.Followers,
      followings: user.Followings,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
