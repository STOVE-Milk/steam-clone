const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const redis = require("redis");
const cors = require("cors");

dotenv.config();

const authRouter = require("./routes/auth");
const { sequelize } = require("./models");

const redisClient = redis.createClient({ url: "redis://ec2-54-180-117-120.ap-northeast-2.compute.amazonaws.com:6379" });
redisClient.on("error", function (err) {
    console.log("Error " + err);
});
redisClient.on("connect", function () {
    console.log("Connected to redis instance");
});
redisClient.connect();

const app = express();

app.set("port", process.env.PORT || 8101);

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${res.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    // res.render("error");
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
