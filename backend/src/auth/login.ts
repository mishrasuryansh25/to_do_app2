import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "./schema";
import { findUserByUsername } from "./query";

const router = Router();

//login user 
router.post("/",async(req:Request, res:Response) => {
    try{
        const parsed = loginSchema.parse(req.body);
        const user = await findUserByUsername(parsed.username)

        if(!user) 
        return res.status(400).json({error: "Invalid username or password" });

        const isPasswordValid = await bcrypt.compare(parsed.password, user.password);
        if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid username or password" });
        }
        //this section of code generates the token 
        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET as string,
            {expiresIn: "1h",}
        );
        res.json({ message: "Login Successful!",token});
    }
    catch (err:any){
        if(err.name=="ZodError"){
            return res.status(400).json({ errors: err.errors.map((e:any)=>e.message) });
        }
        res.status(500).json({ error: err.message });
    }
    
});

export default router;