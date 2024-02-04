const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  User.findOne({email}, (err, user) => {
    if (err) {
      return done(err);
    }

    if (user) {
      return done(null, user);
    }

    const newUser = new User({email, displayName});
    newUser.save((err) => {
      if (err) {
        return done(err);
      }

      return done(null, newUser);
    });
  });
};
