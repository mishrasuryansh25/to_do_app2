//zod validation 
const {z} = require("zod");

//zod validation for registering the user 
const registerSchema = z.object({
    username: z.string()
    .min(6,"username must be atleast 6 charachters ")
    .max(10,"username must be 10 characters or less"),
    password: z.string()
    .min(5," Password must be atleast 6 charachters")
    .max(10,"Password not more that 10 characters")
});

//zod validation for user login
const loginSchema = z.object({
    username: z.string().min(6, "username must be atleast 6 charachters"),
    password: z.string().min(5, "Password must be atleast 5 charachters")
});

module.exports= { registerSchema,loginSchema };


