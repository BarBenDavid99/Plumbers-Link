const Joi = require('joi');

exports.PlumberValid = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
        _id: Joi.allow()
    }).required(),
    bizName: Joi.string().required(),
    profession: Joi.string().required(),
    description: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().required(),
        alt: Joi.string(),
        _id: Joi.allow()
    }).required(),

    address: Joi.object({ city: Joi.string().required(), street: Joi.string().required(), houseNumber: Joi.number().required(), zip: Joi.number(), _id: Joi.allow() }).required(),
    serviceArea: Joi.required(),
    bizNumber: Joi.number().required(),
    averageRating: Joi.allow(),
    opinions: Joi.allow(),
    createdAt: Joi.allow(),
    updatedAt: Joi.allow(),
    _id: Joi.allow(),
    __v: Joi.allow(),
})