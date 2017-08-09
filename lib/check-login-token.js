module.exports = dataLoader => (req, res, next) => {
 console.log(req.headers)
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    dataLoader.getUserFromSession(token)
    .then(
      (user) => {
		console.log(user, 'this is the user inside only logged in')
        if (user) {
          req.user = user;
          req.sessionToken = token;
        }
        next();
      }
    )
    .catch(
      (err) => {
        console.error('Something went wrong while checking Authorization header', err.stack);
        next();
      }
    );
  } else {
    next();
  }
};
