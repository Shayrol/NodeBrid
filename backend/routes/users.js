const express = require("express");

const { User, Post } = require("../models");

const router = express.Router();

// 유저 프로필 기본 정보 조회
router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: ["id", "nick"],
    });

    if (!user) {
      return res.status(404).send("user not found");
    }

    const [followerCount, followingCount, postCount] = await Promise.all([
      user.countFollowers(),
      user.countFollowings(),
      Post.count({
        where: {
          UserId: user.id,
        },
      }),
    ]);

    res.json({
      id: user.id,
      nick: user.nick,
      followerCount,
      followingCount,
      postCount,
    });
  } catch (error) {
    next(error);
  }
});

// 팔로워 목록
router.get("/:userId/followers", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId,
      },
      include: [
        {
          model: User,
          as: "Followers",
          attributes: ["id", "nick"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).send("user not found");
    }

    let followingIds = new Set();

    // 로그인한 경우에만 내 팔로잉 목록 조회
    if (req.user) {
      const me = await User.findByPk(req.user.id, {
        include: [
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      followingIds = new Set(me.Followings.map((following) => following.id));
    }

    const followers = user.Followers.map((follower) => ({
      id: follower.id,
      nick: follower.nick,
      isFollowing: followingIds.has(follower.id),
    }));

    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로잉 목록
router.get("/:userId/followings", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId,
      },
      include: [
        {
          model: User,
          as: "Followings",
          attributes: ["id", "nick"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).send("user not found");
    }

    let followingIds = new Set();

    // 로그인한 경우에만 내 팔로잉 목록 조회
    if (req.user) {
      const me = await User.findByPk(req.user.id, {
        include: [
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      followingIds = new Set(me.Followings.map((following) => following.id));
    }

    const followings = user.Followings.map((following) => ({
      id: following.id,
      nick: following.nick,
      isFollowing: followingIds.has(following.id),
    }));

    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
