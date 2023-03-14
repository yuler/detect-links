import type { User, Domain } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Domain } from "@prisma/client";

export async function createDomain({
  url,
  remarks,
  userId,
}: Pick<Domain, "url" | "remarks"> & {
  userId: User["id"];
}) {
  return prisma.domain.create({
    data: {
      url,
      remarks,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function getDomainList({ userId }: { userId: User["id"] }) {
  return prisma.domain.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function getDomain({
  id,
  userId,
}: Pick<Domain, "id"> & {
  userId: User["id"];
}) {
  return prisma.domain.findFirst({
    select: { id: true, url: true, remarks: true },
    where: { id, userId },
  });
}

export function deleteDomain({
  id,
  userId,
}: Pick<Domain, "id"> & { userId: User["id"] }) {
  return prisma.domain.deleteMany({
    where: { id, userId },
  });
}
