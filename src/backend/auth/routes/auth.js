const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");

const successRes = require("./util");
const failureRes = require("./util");

const router = express.Router();

// /auth/email 이메일 중복 확인
router.post("/email", async (req, res, next) => {
    const { email } = req.body;

    try {
        const exUser = await User.findOne({ where: { email: email } });

        if (exUser) {
            // 이미 존재하는 이메일인 경우
            return failureRes(res, 10100, "Existed Email", "이미 존재하는 이메일입니다.");
        }
        return successRes(res, 10000, "Email OK", {});
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// /auth/nickname 닉네임 중복 확인
router.post("/nickname", async (req, res, next) => {
    const { nickname } = req.body;

    try {
        const exUser = await User.findOne({ where: { nickname: nickname } });

        if (exUser) {
            // 이미 존재하는 이메일인 경우
            return failureRes(res, 10101, "Existed Nickname", "이미 존재하는 닉네임입니다.");
        }
        return successRes(res, 10000, "Nickname OK", {});
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// /auth/signup 회원가입
router.post("/signup", async (req, res, next) => {
    const { email, password, username, nickname, language, country } = req.body;

    try {
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            password: hash,
            username,
            nickname,
            language,
            country,
            role: 1,
            created_at: Sequelize.fn("NOW"),
        });

        return successRes(res, 10000, "Sign OK", {});
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// /auth/signin 로그인
router.post("/signin", async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const exUser = await User.findOne({ where: { email: email } });

        if (!exUser) {
            // 이메일이 존재하지 않는 경우
            return failureRes(res, 10102, "Not Existed User", "유저가 존재하지 않습니다.");
        }

        const compareResult = await bcrypt.compare(password, exUser.password);

        if (!compareResult) {
            // 비밀번호가 일치하지 않는 경우
            return failureRes(res, 10103, "Password Error", "비밀번호가 일치하지 않습니다.");
        }

        // 현재 시간으로 accessed_at 수정, ip 추가
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        User.update(
            {
                accessed_at: Sequelize.fn("NOW"),
                ip: ip,
            },
            {
                where: {
                    email: email,
                },
            }
        );
        const refreshToken = jwt.sign({}, `${process.env.JWT_SECRET}`, {
            expiresIn: "14d",
        });

        // 서버에서 나중에 작업할 때 필요한 정보들로 accessToken을 발급한다.
        const accessToken = jwt.sign(
            { idx: exUser.idx, nickname: exUser.nickname, role: exUser.role, country: exUser.country },
            `${process.env.JWT_SECRET}`,
            {
                expiresIn: "1h",
            }
        );

        // redis에 refreshToken=accessToken 으로 저장 (key-value)
        // TODO: key-value 가 아닌 다른 방식으로 개발 필요 (from.태현님)
        req.redisClient.set(refreshToken, accessToken);

        return successRes(res, 10000, "Login OK", { accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// /auth/token 토큰 재발급
router.post("/token", async (req, res, next) => {
    try {
        const { accessToken, refreshToken, isUpdated } = req.body;

        // refreshToken을 이용해 redis에서 accessToken을 가져온다.
        const result = await req.redisClient.get(refreshToken);

        if (result === null) {
            // redis에 refreshToken이 없는 경우
            return failureRes(res, 10104, "RefreshToken Error", "refreshToken이 유효하지 않습니다. 다시 로그인해주세요.");
        }

        if (result !== accessToken) {
            // redis에 저장된 accessToken과 일치하지 않는 경우
            return failureRes(res, 10105, "AccessToken Error", "잘못된 accessToken 입니다.");
        }

        const decoded = jwt.decode(accessToken, `${process.env.JWT_SECRET}`);
        let tokenInfo = { idx: 0, nickname: "", role: 0, country: "" };

        // 프로필 수정 이후에 토큰을 재발급 받는 경우, DB에서 User를 가져오는 것이 안전하다.
        if (isUpdated) {
            async () => {
                const exUser = await User.findOne({ where: { idx: decoded.idx } });
                tokenInfo = { idx: exUser.idx, nickname: exUser.nickname, role: exUser.role, country: exUser.country };
            };
        } else {
            // accessToken이 만료되어서 재발급 받는 경우
            tokenInfo = {
                idx: decoded.idx,
                nickname: decoded.nickname,
                role: decoded.role,
                country: decoded.country,
            };
        }

        const newAccessToken = jwt.sign(tokenInfo, `${process.env.JWT_SECRET}`, {
            expiresIn: "1h",
        });

        return successRes(res, 10000, "Token Post OK", { accessToken: newAccessToken });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// /auth/password 비밀번호 변경
router.post("/password", async (req, res, next) => {
    const { accessToken, curPassword, newPassword } = req.body;

    try {
        const decoded = jwt.decode(accessToken, `${process.env.JWT_SECRET}`);
        const idx = decoded.idx;
        const exUser = await User.findOne({ where: { idx: idx } });
        const compareResult = await bcrypt.compare(curPassword, exUser.password);

        if (!compareResult) {
            // 비밀번호가 일치하지 않는 경우
            return failureRes(res, 10103, "Password Error", "비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호 암호화하여 db에 저장
        const hash = await bcrypt.hash(newPassword, 12);
        User.update(
            {
                password: hash,
            },
            {
                where: {
                    idx: idx,
                },
            }
        );

        return successRes(res, 10000, "Password Update OK", {});
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// /auth/signout 회원 탈퇴
router.post("/signout", async (req, res, next) => {
    const { accessToken } = req.body;
    try {
        const decoded = jwt.decode(accessToken, `${process.env.JWT_SECRET}`);

        User.update(
            {
                deleted_at: Sequelize.fn("NOW"),
            },
            {
                where: {
                    idx: decoded.idx,
                },
            }
        );

        return successRes(res, 10000, "Signout OK", {});
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// /auth/logout 로그아웃
router.post("/logout", async (req, res, next) => {
    const { accessToken, refreshToken } = req.body;

    try {
        // redis에서 refreshToken 삭제
        req.redisClient.del(refreshToken);

        const decoded = jwt.decode(accessToken, `${process.env.JWT_SECRET}`);

        // 로그아웃 요청을 한 유저의 accessToken을 redis에 블랙리스트 등록: accessToken 남은 만료 시간만큼 등록한다.  
        req.redisClient.set(accessToken, "logout", "EX", decoded.exp - decoded.iat);

        return successRes(res, 10000, "Signout OK", {});
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;
