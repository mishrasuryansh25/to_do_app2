import { Request, Response } from "express";
import { getTasks } from "./query";

export const fetchTasksHandler =async (req: Request, res: Response ) => {
    try{
        console.log("hello!");
        const tasks = await getTasks();
        res.json(tasks);
    } catch (err: any){
        res.status(500).json({error: err.message});
    }
};