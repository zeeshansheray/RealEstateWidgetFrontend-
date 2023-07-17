import * as yup from 'yup';

const UpdateAdmin = yup.object({
    email : yup.string().email(),
})

export {
    UpdateAdmin
}