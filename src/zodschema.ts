import z from 'zod'
export const signupschema=z.object({
    email:z.string().email(),
    password:z.string().min(6).max(8),
    fullName:z.string().min(4).max(16)
})

export const signinschema=z.object({
    email:z.string().email(),
    password:z.string().min(6).max(8)
})

