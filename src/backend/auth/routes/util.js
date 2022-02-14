// 성공 응답 처리
const successRes = (res, code, message, data) => {
    res.status(200).json({
        code: code,
        message: message,
        data: data,
    });
};

// 실패 응답 처리. status code는 200으로 넘겨주되, 에러 코드 번호와 메세지를 담아 보낸다.
const failureRes = (res, code, message, data) => {
    res.status(200).json({
        code: code,
        message: message,
        data: data,
    });
};

module.exports = successRes;
module.exports = failureRes;
