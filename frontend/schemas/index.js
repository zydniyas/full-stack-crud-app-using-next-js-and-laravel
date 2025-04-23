import * as yup from "yup";



const passwordRules = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required'),
})

export const registerSchema = yup.object().shape({

    name: yup
        .string()
        .min(3)
        .required('Name is required'),
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(8)
        .matches(passwordRules, { message: "Password must contain minimum eight characters, at least one letter, one number and one special character" })
        .required('Password is required'),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], "Confirm Password must be same as password")
        .required('Password confirmation is required'),


})


export const addProduct = yup.object().shape({
    title: yup
        .string()
        .min(3)
        .required("Title is required"),

})