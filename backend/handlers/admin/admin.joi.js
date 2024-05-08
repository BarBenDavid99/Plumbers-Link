const Joi = require('joi');

exports.SignupValid = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required()
    }).required(),
    email: Joi.string().required(),
    password: Joi.string()
        .min(6)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*'-])(?=.*\d).{6,}$/)
        .rule({
            message:
                'הסיסמה חייבת להיות באורך שישה תווים לפחות ולהכיל אות גדולה, אות קטנה, מספר ואחד מהתווים הבאים: !@#$%^&*-\'.',
        }),
    phone: Joi.string().required(),

});

exports.LoginValid = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

exports.EditUserValid = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        middle: Joi.string(),
        last: Joi.string().required()
    }).required(),
    phone: Joi.string().required(),

}
);