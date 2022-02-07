const errorCatcher = (error, req, res, next) => {
  if (error.message === "File too large") {
    return res
      .status(400)
      .json({ error: "File too large: Maximum allowed file size is 2Mb" });
  } else if (error.name === "MulterError") {
    return res.status(500).json({ error: error.message });
  } else if (error) {
    return res.status(500).json({ error });
  }
  next();
};

module.exports = errorCatcher;
