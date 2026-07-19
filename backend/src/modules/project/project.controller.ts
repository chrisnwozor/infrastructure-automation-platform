import type { Request, Response } from "express";

import { AppError } from "../../utils/app-error";
import { createProjectSchema, updateProjectSchema } from "./project.schema";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "./project.service";

const getUserId = (req: Request): string => {
  if (!req.userId) {
    throw new AppError(401, "Authentication required");
  }

  return req.userId;
};

const getProjectId = (req: Request): string => {
  const projectId = req.params.projectId;

  if (typeof projectId !== "string") {
    throw new AppError(400, "Invalid project ID");
  }

  return projectId;
};

export const create = async (req: Request, res: Response) => {
  const { body } = createProjectSchema.parse({ body: req.body });
  const project = await createProject(getUserId(req), body);

  res.status(201).json({
    success: true,
    data: project,
  });
};

export const list = async (req: Request, res: Response) => {
  const projects = await listProjects(getUserId(req));

  res.status(200).json({
    success: true,
    data: projects,
  });
};

export const getOne = async (req: Request, res: Response) => {
  const project = await getProject(getUserId(req), getProjectId(req));

  res.status(200).json({
    success: true,
    data: project,
  });
};

export const update = async (req: Request, res: Response) => {
  const { body } = updateProjectSchema.parse({ body: req.body });

  const project = await updateProject(getUserId(req), getProjectId(req), body);

  res.status(200).json({
    success: true,
    data: project,
  });
};

export const remove = async (req: Request, res: Response) => {
  await deleteProject(getUserId(req), getProjectId(req));

  res.status(204).send();
};
