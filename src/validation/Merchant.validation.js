import * as yup from 'yup';

const updateMerchant = yup.object({
    email    : yup.string().email(),
    storeName: yup.string().required(),
    fullName : yup.string().required(),
})

export {
    updateMerchant
}