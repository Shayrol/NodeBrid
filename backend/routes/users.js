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

    let isFollowing = false;

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

      isFollowing = me.Followings.some(
        (following) => Number(following.id) === Number(user.id),
      );
    }

    res.json({
      id: user.id,
      nick: user.nick,
      followerCount,
      followingCount,
      postCount,
      isFollowing,
    });
  } catch (error) {
    next(error);
  }
});

// 팔로워 목록
router.get("/:userId/followers", async (req, res, next) => {
  try {
    // 1. 프로필 주인(userId: 1)의 팔로워 목록 조회
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
    const myId = req.user ? Number(req.user.id) : null;

    // 2. 로그인한 상태라면, 내(userId: 2)가 팔로우하는 사람들의 ID 목록 가져오기
    if (myId) {
      const me = await User.findByPk(myId, {
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

      // 내 팔로잉 목록 [1, 3, 5]를 Set으로 변환하여 검색 속도 최적화 O(1)
      if (me && me.Followings) {
        followingIds = new Set(
          me.Followings.map((following) => Number(following.id)),
        );
      }
    }

    console.log("내 팔로우 목록: ", followingIds);
    console.log("상대 팔로우 목록: ", user.Followers);

    // 3. 프로필 주인의 팔로워 목록([2, 3, 4, 5])을 순회하며 상태값 매핑
    const followers = user.Followers.map((follower) => {
      const followerId = Number(follower.id);

      return {
        id: followerId,
        nick: follower.nick,
        // 해당 유저가 '나' 자신인지 확인 (프론트에서 팔로우 버튼 숨김 처리 등에 유용)
        isMe: myId === followerId,
        // 내가 이 사람을 팔로우하고 있는지 확인 (Set.has를 이용해 true/false 반환)
        isFollowing: followingIds.has(followerId),
      };
    });

    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로잉 목록
router.get("/:userId/followings", async (req, res, next) => {
  try {
    // 1. 프로필 주인(userId: 1)이 팔로우하는 목록 조회
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
    const myId = req.user ? Number(req.user.id) : null;

    // 2. 로그인한 상태라면, 나(myId)의 팔로잉 목록을 가져와 Set으로 구성
    if (myId) {
      const me = await User.findByPk(myId, {
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

      if (me && me.Followings) {
        followingIds = new Set(me.Followings.map((f) => Number(f.id)));
      }
    }

    // 3. 상대방의 팔로잉 목록을 순회하며 상태값 매핑
    const followings = user.Followings.map((following) => {
      const followingId = Number(following.id);

      return {
        id: followingId,
        nick: following.nick,
        // 이 사람이 '나' 자신인가?
        isMe: myId === followingId,
        // 내가 이 사람을 팔로우하고 있는가?
        isFollowing: followingIds.has(followingId),
      };
    });

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
