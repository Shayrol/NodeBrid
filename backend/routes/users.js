const express = require("express");

const { User, Post, Hashtag } = require("../models");
const { Op } = require("sequelize");

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

// 유저 게시글 목록 조회
router.get("/:userId/posts", async (req, res, next) => {
  const { page = 1, limit = 10, type, keyword, sort = "latest" } = req.query;
  const { userId } = req.params;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = Math.min(parseInt(limit, 10), 20);

  const offset = (parsedPage - 1) * parsedLimit;

  const where = {
    UserId: userId,
  };

  const hashtagWhere = {};

  // 제목 검색
  if (type === "title" && keyword) {
    where.title = {
      [Op.like]: `%${keyword}%`,
    };
  }

  // 내용 검색
  if (type === "content" && keyword) {
    where.content = {
      [Op.like]: `%${keyword}%`,
    };
  }

  // 태그 검색
  if (type === "tag" && keyword) {
    hashtagWhere.title = {
      [Op.like]: `%${keyword}%`,
    };
  }

  const order =
    sort === "oldest" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]];

  try {
    const posts = await Post.findAndCountAll({
      distinct: true,

      where,

      include: [
        {
          model: User,
          attributes: ["id", "nick", "provider", "email"],

          include: req.user
            ? [
                {
                  model: User,
                  as: "Followers",
                  where: {
                    id: req.user.id,
                  },
                  attributes: ["id"],
                  required: false,
                },
              ]
            : [],
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
          through: {
            attributes: [],
          },
          where:
            Object.keys(hashtagWhere).length > 0 ? hashtagWhere : undefined,
        },
      ],

      order,

      limit: parsedLimit,
      offset,
    });

    const result = posts.rows.map((post) => {
      const postJson = post.toJSON();

      if (postJson.User) {
        postJson.User.isFollowing = !!(
          postJson.User.Followers && postJson.User.Followers.length > 0
        );

        delete postJson.User.Followers;
      }

      return {
        ...postJson,
        likeCount: postJson.Likers.length,
      };
    });

    res.status(200).json({
      posts: result,
      totalCount: posts.count,
      hasMore: offset + parsedLimit < posts.count,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
