import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { CreateProjectInput, UpdateProjectInput } from "./project.schema";

export const createProject = (userId: string, input: CreateProjectInput) => {
  return prisma.project.create({
    data: {
      ...input,
      ownerId: userId,
    },
  });
};

export const listProjects = (userId: string) => {
  return prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProject = async (userId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
    include: {
      resources: true,
    },
  });

  if (!project) {
    throw new AppError(404, "Project not found");
  }

  return project;
};

export const updateProject = async (
  userId: string,
  projectId: string,
  input: UpdateProjectInput,
) => {
  await getProject(userId, projectId);

  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: input,
  });
};

export const deleteProject = async (userId: string, projectId: string) => {
  await getProject(userId, projectId);

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
};
