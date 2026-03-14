const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = process.env.COOKIE_DOMAIN;

const buildCookieOptions = ({ httpOnly }) => {
  const options = {
    httpOnly,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  };

  if (cookieDomain) {
    options.domain = cookieDomain;
  }

  return options;
};

const getAuthCookieOptions = () => buildCookieOptions({ httpOnly: true });

const getCsrfCookieOptions = () => buildCookieOptions({ httpOnly: false });

const getClearCookieOptions = ({ httpOnly }) => {
  const options = {
    httpOnly,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };

  if (cookieDomain) {
    options.domain = cookieDomain;
  }

  return options;
};

module.exports = {
  COOKIE_MAX_AGE,
  getAuthCookieOptions,
  getCsrfCookieOptions,
  getClearCookieOptions
};
