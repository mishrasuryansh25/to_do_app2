import { Router, Response, Request } from "express";
import bcrypt from "bcrypt";
import { registerSchema } from "./schema";
import { createUser, findUserByUsername } from "./query";

const router = Router();

//registering new user 
router.post("/", async(req: Request, res: Response)=>{
    try{
        const parsed = registerSchema.parse(req.body);
        //this will check for user already exist or not
        const existingUser = await findUserByUsername(parsed.username);
        if (existingUser){
                return res.status(400).json({error: "Username Already exsit"});
            }
        //this will hash password and create user
        const hashedPassword = await bcrypt.hash(parsed.password, 10);
        const user = await createUser(parsed.username, hashedPassword);
        res.status(201).json({message: "user registered successfully!",user});

    } catch (err: any) {
        if(err.name == "ZodError"){
            return res.status(400).json({ errors: err.errors.map((e:any)=>e.message) });
        }
        res.status(500).json({ error: err.message });
    }
});

export default router;
