const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { stripUnknown: true });
    // const valid = error === null;
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

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false, stripUnknown: true });
    if (!error) {
      return next();
    }
    const message = error.details.map((i) => i.message).join(', ');
    // Optional: store in res.locals if needed
    res.locals.message = message;

    return res.status(422).json({ msg: message });
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams
};
