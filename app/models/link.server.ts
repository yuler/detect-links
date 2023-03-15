import type { User, Link } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Link } from "@prisma/client";

export async function createLink({
  url,
  remarks,
  userId,
}: Pick<Link, "url" | "remarks"> & {
  userId: User["id"];
}) {
  return prisma.link.create({
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

export async function getLinkList({ userId }: { userId: User["id"] }) {
  return prisma.link.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function getLink({
  id,
  userId,
}: Pick<Link, "id"> & {
  userId: User["id"];
}) {
  return prisma.link.findFirst({
    select: { id: true, url: true, remarks: true },
    where: { id, userId },
  });
}

export function deleteLink({
  id,
  userId,
}: Pick<Link, "id"> & { userId: User["id"] }) {
  return prisma.link.deleteMany({
    where: { id, userId },
  });
}
