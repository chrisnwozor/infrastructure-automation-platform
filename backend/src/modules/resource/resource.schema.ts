import { z } from "zod";

const resourceTypeSchema = z.enum([
  "EC2",
  "SECURITY_GROUP",
  "ELASTIC_IP",
  "IAM_ROLE",
]);

export const createResourceSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    type: resourceTypeSchema,
    config: z.record(z.string(), z.unknown()),
  }),
});

export const updateResourceSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      config: z.record(z.string(), z.unknown()).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>["body"];

export type UpdateResourceInput = z.infer<typeof updateResourceSchema>["body"];
