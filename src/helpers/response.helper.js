function sendSuccess(res, message, data = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
}

function sendError(res, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
}

export { sendSuccess, sendError };
