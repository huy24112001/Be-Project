const { validationResult, checkSchema } = require("express-validator");
const { BadRequestError } = require("../responseHandle/error.response");

const validator = (schema) => {
    return [
      ...schema,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new BadRequestError(errors.array()[0].msg);
        }
        next();
      },
    ];
  };

module.exports = { validator };
  