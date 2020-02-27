const creatingErr = (req, res, next) => {
  const err = new Error();
  err.status = 404;
  next(err);
};

// eslint-disable-next-line no-unused-vars
const sendErr = (err, req, res, next) => res.status(err.status || 500).json({
  error: {
    message: err.message || 'Oops! Something went wrong',
  },
});

module.exports = { creatingErr, sendErr };
