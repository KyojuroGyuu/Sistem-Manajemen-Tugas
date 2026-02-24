import Joi from 'joi';

export const registerValidate = (data) => {
    const schema = Joi.object({
        fullname: Joi.string().min(3).required(),
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8)
            .pattern(new RegExp('(?=.*[a-z])'))
            .pattern(new RegExp('(?=.*[A-Z])'))
            .pattern(new RegExp('(?=.*[0-9])'))
            .required().messages({
                'string.min': 'Password minimal 8 karakter',
                'string.pattern.base': 'Password harus ada setidaknya 1 huruf besar,huruf kecil dan angka',
                'any.required': 'Password gak boleh kosong'
            })
    })
    return schema.validate(data);
}

export const taskValidate = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().allow('', null).optional(),
        adminId: Joi.number().required().messages({
            'any.required': 'Judul gak boleh kosong'
        })
    })
    return schema.validate(data);
}

export const userTaskValidate = (data) => {
    const schema = Joi.object({
        taskId: Joi.number().required(),
        response: Joi.string().optional()
    })
    return schema.validate(data);
}