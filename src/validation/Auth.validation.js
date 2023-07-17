import * as yup from 'yup';

const ForgetPassword = yup.object({
    email    : yup.string().email().required(),
})

const ResetPassword = yup.object({
    password : yup.string().min(8).required()
})

const UpdatePassword =  yup.object({
    oldPassword : yup.string().min(8).required(),
    newPassword : yup.string().min(8).required(),
    newPasswordConfirm : yup.string().min(8).required(),
})


const LoginVld = yup.object({
    email    : yup.string().email().required(),
    password : yup.string().min(8).required()
})

const SignupVld = yup.object({
    fullName : yup.string().required(),
    avatar   : yup.string(),
    email    : yup.string().email().required(),
    phone    : yup.string().min(9).required(),
    password : yup.string().min(8).required(),
})

const MerchantSignupVld = yup.object({
    fullName : yup.string().required(),
    avatar   : yup.string(),
    email    : yup.string().email().required(),
    storeName: yup.string().required(),
    phone    : yup.string().min(9).required(),
    password : yup.string().min(8).required(),
})

export {
    LoginVld,
    SignupVld,
    ForgetPassword,
    ResetPassword,
    UpdatePassword,
    MerchantSignupVld
}