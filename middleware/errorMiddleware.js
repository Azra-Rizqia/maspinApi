const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);

    res.json({
        success: false,
        data: null,
        message: err.message,
        status: statusCode.toString(),
    });
};


module.exports = {
    errorHandler
}