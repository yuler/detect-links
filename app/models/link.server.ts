import type { User, Link } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Link } from "@prisma/client";

export async function createLink({
  userId,
  url,
  remarks,
  notifyEmail,
  notifyWecomToken,
  notifyWecomMobile,
  notifyWebhook,
}: Omit<Link, "id" | "createdAt" | "updatedAt">) {
  return prisma.link.create({
    data: {
      url,
      remarks,
      notifyEmail,
      notifyWecomToken,
      notifyWecomMobile,
      notifyWebhook,
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
