const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const redis = require("redis");

dotenv.config();

const authRouter = require("./routes/auth");
const { sequelize } = require("./models");

// redis init
const redisClient = redis.createClient({ url: "redis://localhost:6379" });
redisClient.on("error", function (err) {
    console.log("Error " + err);
});
redisClient.on("connect", function () {
    console.log("Connected to redis instance");
});
redisClient.connect();

const app = express();

app.set("port", process.env.PORT || 8081);

// sequelize init
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

// authRouter에서 redisClient를 쓰기 위해 req에 등록
app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

// 주소가 없는 경우 404 처리
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${res.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
