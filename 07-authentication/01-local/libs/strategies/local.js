const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({email}).then((user) => {
        if (!user) {
          done(null, false, 'Нет такого пользователя');
        }

        user.checkPassword(password)
          .then((result) => {
            if (result) {
              done(null, user, '');
            } else {
              done(null, false, 'Неверный пароль');
            }
          })
          .catch(() => {
            done(new Error('Произошла ошибка'), user, '');
          });
      });
    },
);
