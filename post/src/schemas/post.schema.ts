import { z } from "zod";
const imageFileValidator = z
  .instanceof(File)
  .refine(
    (file) => {
      const validMimeTypes = ["jpg", "png", "gif", "jpeg"];
      return validMimeTypes.includes(file.type);
    },
    {
      message: "Invalid image file type. Supported types are: jpg, png, gif.",
    }
  )
  .refine((file) => file.size <= 5000000, {
    message: "Image size should not exceed 5MB.",
  });

export const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  likes: z.number(),
  answer: z.string(),
  image: imageFileValidator,
  categories: z.string(),
  createdAt: z.string(),
});
