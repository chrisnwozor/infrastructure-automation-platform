import type { Request, Response } from "express";

import { AppError } from "../../utils/app-error";
import { createResourceSchema, updateResourceSchema } from "./resource.schema";
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  updateResource,
} from "./resource.service";

const requiredString = (
  value: string | string[] | undefined,
  name: string,
): string => {
  if (typeof value !== "string") {
    throw new AppError(400, `Invalid ${name}`);
  }

  return value;
};

const userIdFrom = (req: Request): string => {
  if (!req.userId) {
    throw new AppError(401, "Authentication required");
  }

  return req.userId;
};

export const create = async (req: Request, res: Response) => {
  const { body } = createResourceSchema.parse({ body: req.body });

  const resource = await createResource(
    userIdFrom(req),
    requiredString(req.params.projectId, "project ID"),
    body,
  );

  res.status(201).json({ success: true, data: resource });
};

export const list = async (req: Request, res: Response) => {
  const resources = await listResources(
    userIdFrom(req),
    requiredString(req.params.projectId, "project ID"),
  );

  res.status(200).json({ success: true, data: resources });
};

export const getOne = async (req: Request, res: Response) => {
  const resource = await getResource(
    userIdFrom(req),
    requiredString(req.params.resourceId, "resource ID"),
  );

  res.status(200).json({ success: true, data: resource });
};

export const update = async (req: Request, res: Response) => {
  const { body } = updateResourceSchema.parse({ body: req.body });

  const resource = await updateResource(
    userIdFrom(req),
    requiredString(req.params.resourceId, "resource ID"),
    body,
  );

  res.status(200).json({ success: true, data: resource });
};

export const remove = async (req: Request, res: Response) => {
  await deleteResource(
    userIdFrom(req),
    requiredString(req.params.resourceId, "resource ID"),
  );

  res.status(204).send();
};
