import { z } from "zod";

export const MessageSchema = z.object({
    message: z
    .string()
    .min(2, { message: "Message must be at least 2 character long" })
    .max(300, { message: "Message must be at most 300 characters long" })
})