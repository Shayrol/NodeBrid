const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Hashtag, User, PostLike } = require("../models");
const { isLoggedIn } = require("./middlewares");
const { Op } = require("sequelize");

const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
// ✅ 이미지 저장
router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({
    url: `/img/${req.file.filename}`,
  });
});

const upload2 = multer();
// ✅ 게시글 등록
router.post("/new", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });

    const hashtags = req.body.hashtags;
    if (hashtags) {
      const normalizedTag = hashtags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag);

      const result = await Promise.all(
        normalizedTag.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag },
          });
        }),
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.status(201).json({
      message: "게시글 작성 완료",
      postId: post.id,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// ✅ 게시글 수정
router.patch("/:postId/update", isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    if (post.UserId !== req.user.id) {
      return res.status(403).json({
        message: "수정 권한이 없습니다.",
      });
    }

    await post.update({
      title: req.body.title,
      content: req.body.content,
      img: req.body.url,
    });

    const hashtags = req.body.hashtags ?? [];

    const normalizedTag = hashtags
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag);

    const result = await Promise.all(
      normalizedTag.map((tag) => {
        Hashtag.findOrCreate({
          where: { title: tag },
        });
      }),
    );

    await post.setHashtags(result.map((r) => r[0]));

    res.status(200).json({
      message: "게시글 수정 완료",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// ✅ 게시글 리스트 조회
router.get("/", async (req, res, next) => {
  const { page = 1, limit = 10, type, keyword, sort = "latest" } = req.query;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = Math.min(parseInt(limit, 10), 20);

  const offset = (parsedPage - 1) * parsedLimit;

  const where = {};
  const userWhere = {};
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

  // 닉네임 검색
  if (type === "nick" && keyword) {
    userWhere.nick = {
      [Op.like]: `%${keyword}%`,
    };
  }

  // 태그 검색
  if (type === "tag" && keyword) {
    hashtagWhere.title = {
      [Op.like]: `%${keyword}%`,
    };
  }

  // 정렬 처리
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

          where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
          include: req.user
            ? [
                {
                  model: User,
                  as: "Followers",
                  where: { id: req.user.id },
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

        return {
          ...postJson,
          likeCount: postJson.Likers.length,
        };
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

// ✅ 상세 게시글
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
      },
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
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: "존재하지 않는 게시글입니다.",
      });
    }

    let isFollowing = false;
    console.log("user: ", req.user);

    // 로그인 상태일 때만 확인
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
        (following) => following.id === post.User.id,
      );
    }

    const postJson = post.toJSON();

    const result = {
      post: {
        ...postJson,
      },
      likeCount: postJson.Likers.length,
      isFollowing,
    };

    delete result.post.Likers;

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// ✅ 게시글 좋아요
router.post("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        message: "게시글 없음",
      });
    }

    const liked = await PostLike.findOne({
      where: {
        userId: req.user.id,
        postId,
      },
    });

    // 좋아요 취소
    if (liked) {
      await PostLike.destroy({
        where: {
          userId: req.user.id,
          postId,
        },
      });

      return res.json({
        liked: false,
      });
    }

    // 좋아요 추가
    await PostLike.create({
      userId: req.user.id,
      postId,
    });

    return res.json({
      liked: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// ✅ 내가 클릭한 좋아요 게시글
router.get("/liked/me", isLoggedIn, async (req, res, next) => {
  try {
    // Like(중간 테이블)에서 현재 로그인한 유저의 데이터만 전부 찾습니다.
    const likes = await PostLike.findAll({
      where: { userId: req.user.id }, // 혹은 테이블 설계에 따라 user_id
      attributes: ["postId"], // 게시글 ID 컬럼만 쏙 골라서 조회
    });

    // 객체 배열에서 PostId만 추출하여 숫자 배열로 바꿉니다.
    const likedPostIds = likes.map((like) => like.postId);

    res.json(likedPostIds); // [1, 5, 12] 반환
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 삭제
router.delete("/post/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    if (post.UserId !== req.user.id) {
      return res.status(403).json({
        message: "삭제 권한이 없습니다.",
      });
    }

    // 이미지 삭제
    if (post.img) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(post.img),
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 좋아요 관계 삭제 (PostLike 테이블 데이터 삭제)
    await post.setLikers([]);

    // 게시글 삭제
    await post.destroy();

    return res.status(200).json({
      message: "게시글이 삭제되었습니다.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.delete('/post/:postId', isLoggedIn, async (req, res, next) => {
//   try {
//     const { postId } = req.params;

//     const post = await Post.findOne({
//       where: { id: postId },
//     });

//     if (!post) {
//       return res.status(404).json({
//         message: '게시글을 찾을 수 없습니다.',
//       });
//     }

//     // 작성자 확인
//     if (post.UserId !== req.user.id) {
//       return res.status(403).json({
//         message: '삭제 권한이 없습니다.',
//       });
//     }

//     await post.destroy();

//     return res.status(200).json({
//       message: '게시글이 삭제되었습니다.',
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;
