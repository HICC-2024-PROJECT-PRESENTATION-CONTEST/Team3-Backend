function isLogin() {
  return (req, res, next) => {
    if (!req.session.login) {
      res.error('auth403');
      return;
    }
    next();
  };
}

function isManager() {
  return (req, res, next) => {
    if (!req.session.manager) {
      res.error('auth403');
      return;
    }
    next();
  };
}

function isLoginOrManager() {
  return (req, res, next) => {
    if (!(req.session.login || req.session.manager)) {
      res.error('auth403');
      return;
    }
    next();
  };
}

function isMeOrManager() {
  return (req, res, next) => {
    if (
      !(
        (req.session.login && req.session.profile == req.profile.uid) ||
        req.session.manager
      )
    ) {
      res.error('auth403');
      return;
    }
    next();
  };
}

export default {
  isLogin: isLogin,
  isManager: isManager,
  isLoginOrManager: isLoginOrManager,
  isMeOrManager: isMeOrManager,
};
