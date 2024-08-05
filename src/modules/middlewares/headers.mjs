export default function responseHeaders(headers) {
  return function (req, res, next) {
    for (const key in headers) {
      const value = headers[key];

      let origin = req.headers.origin;

      // Array of Access-Control-Allow-Origin values
      if (key == 'Access-Control-Allow-Origin' && value instanceof Array) {
        if (value.includes(req.headers.origin)) {
          res.header('Access-Control-Allow-Origin', origin || '*');
        } else {
          res.header('Access-Control-Allow-Origin', null);
        }
      } else if (key == 'Access-Control-Allow-Origin' && value == '*') {
        res.header('Access-Control-Allow-Origin', origin || '*');
      }
      // Normal
      else {
        res.header(key, value);
      }
    }
    next();
  };
}
