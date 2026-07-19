import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500).optional(),
    region: z.string().trim().min(1),
  }),
});

export const updateProjectSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      description: z.string().trim().max(500).nullable().optional(),
      region: z.string().trim().min(1).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];
