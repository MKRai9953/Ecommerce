const sendToken = function (user, statusCode, res) {
  const token = user.getJWTToken();

  //   OPtions for cookies
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_Expire * 24 * 60 * 60 * 1000
    ),
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};

module.exports = sendToken;
