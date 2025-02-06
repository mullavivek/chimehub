import {z} from "zod";

export const MessageSchema = z.object({
  content: z.string().min(2). max(350, {message: "message exceeded word limit!"})

})

