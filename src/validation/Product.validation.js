import * as yup from 'yup';

const CreateProduct = yup.object({
    category   : yup.object().required('This is a required field').shape({
        category: yup.string().required('This is a required field'),
        subcategory: yup.string('This is a required field'),
}),
    name       : yup.string().required('This is a required field'),
    description: yup.string().required('This is a required field'),
    gender     : yup.string().required('This is a required field'),
    sizes      : yup.array(),
    price      : yup.number().required('This is a required field'),
    colors     : yup.array(),
    images     : yup.array().required('This is a required field').min(1).max(5),
    discount   : yup.number(),
})

export {
    CreateProduct
}