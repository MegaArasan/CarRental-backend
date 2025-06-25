const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    // const valid = error === null;
    if (!error) {
      return next();
    } else {
      const { details } = error;
      console.log(details);
      const message = details.map((i) => i.message).join(',');
      res.locals.message = message;
      return res.status(422).json({ msg: message });
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (!error) {
      return next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      res.locals.message = message;
      return res.status(422).json({ msg: message });
    }
  };
};

module.exports = {
  validate,
  validateQuery
};
