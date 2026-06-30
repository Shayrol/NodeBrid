const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Post = require("./post");
const Hashtag = require("./hashtag");
const PostLike = require("./postLike");
const ChatRoom = require("./chatRoom");
const ChatParticipant = require("./chatParticipant");
const Message = require("./message");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.PostLike = PostLike;
db.ChatRoom = ChatRoom;
db.ChatParticipant = ChatParticipant;
db.Message = Message;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
PostLike.init(sequelize);
ChatRoom.init(sequelize);
ChatParticipant.init(sequelize);
Message.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
PostLike.associate(db);
ChatRoom.associate(db);
ChatParticipant.associate(db);
Message.associate(db);

module.exports = db;
