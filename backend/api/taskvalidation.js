
//ZOD implementation for task(CRUD)
const {z} = require("zod");
//create validation
const createTaskScehma = z.object({
    title : z.string().min(1,"Title is required"),
    description : z.string().optional()
});

//update valaidation
const updateTaskSchema = z.object({
    title : z.string().min(1,"Title is required"),
    description : z.string().optional(),
    completed : z.boolean()
});

//taskid schema 
const taskIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "Task ID must be a number")
});

module.exports= { createTaskScehma,updateTaskSchema,taskIdSchema };