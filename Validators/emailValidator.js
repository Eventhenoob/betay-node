const {z} = require('zod');

const emailValidator = z.string().email();

module.exports = emailValidator;