const successRes = (res, code, message, data) => {
    res.status(200).json({
        code: code,
        message: message,
        data: data,
    });
};

const failureRes = (res, code, message, data) => {
    res.status(200).json({
        code: code,
        message: message,
        data: data,
    });
};

module.exports = successRes;
module.exports = failureRes;
