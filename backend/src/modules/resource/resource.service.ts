import type { Prisma } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type {
  CreateResourceInput,
  UpdateResourceInput,
} from "./resource.schema";

const verifyProjectOwnership = async (userId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
    select: { id: true },
  });

  if (!project) {
    throw new AppError(404, "Project not found");
  }
};

export const createResource = async (
  userId: string,
  projectId: string,
  input: CreateResourceInput,
) => {
  await verifyProjectOwnership(userId, projectId);

  return prisma.resource.create({
    data: {
      name: input.name,
      type: input.type,
      config: input.config as Prisma.InputJsonValue,
      projectId,
    },
  });
};

export const listResources = async (userId: string, projectId: string) => {
  await verifyProjectOwnership(userId, projectId);

  return prisma.resource.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
};

export const getResource = async (userId: string, resourceId: string) => {
  const resource = await prisma.resource.findFirst({
    where: {
      id: resourceId,
      project: {
        ownerId: userId,
      },
    },
  });

  if (!resource) {
    throw new AppError(404, "Resource not found");
  }

  return resource;
};

export const updateResource = async (
  userId: string,
  resourceId: string,
  input: UpdateResourceInput,
) => {
  await getResource(userId, resourceId);

  return prisma.resource.update({
    where: { id: resourceId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.config !== undefined && {
        config: input.config as Prisma.InputJsonValue,
      }),
    },
  });
};

export const deleteResource = async (userId: string, resourceId: string) => {
  await getResource(userId, resourceId);

  await prisma.resource.delete({
    where: { id: resourceId },
  });
};
