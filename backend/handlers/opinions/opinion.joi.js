const Joi = require('joi');

exports.OpinionValid = Joi.object({
    plumberId: Joi.allow(),
    customerName: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('').optional(),
});