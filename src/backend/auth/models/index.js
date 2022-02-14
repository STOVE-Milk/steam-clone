const Sequelize = require("sequelize");
const User = require("./user");

const config = require("../config/config.json")[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize; // mysql에 시퀄라이즈 등록
db.User = User; // user table에 user 모델 추가

User.init(sequelize); //시퀄라이즈로 유저 모델 초기화
User.associate(db);

module.exports = db;
