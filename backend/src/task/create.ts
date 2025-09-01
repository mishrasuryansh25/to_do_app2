import { Request, Response } from "express"
import { taskSchema } from "./schema"
import {insertTask} from "./query"

export const createTaskHandler = async(req: Request, res: Response)=>{
    try{
        const parsedTask = taskSchema.parse(req.body);
        const newTask = await insertTask(parsedTask);
        res.status(201).json("newtask");
    }
    catch (err: any){
        res.status(400).json({ error: err.errors || err.message });
    }   
};
