import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function likeHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });
    if (req.method === "POST") {
      const { meal_id } = req.body;

      console.log("session", session);
      console.log("session", req.body);

      const incrementLikeMeal = prisma.meal.update({
        where: {
          id: meal_id,
        },
        data: {
          like_count: {
            increment: 1,
          },
        },
      });

      const createLikeRecord = prisma.like.create({
        data: {
          user_id: session?.id,
          meal_id: meal_id,
        },
      });

      await prisma.$transaction([incrementLikeMeal, createLikeRecord]);

      return res.status(200).json({ Status: "Saved" });
    }
    if (req.method === "DELETE") {
      const { meal_id } = req.body;

      // console.log(req.body);

      const decrementLikeMeal = await prisma.meal.update({
        where: {
          id: meal_id,
        },
        data: {
          like_count: {
            decrement: 1,
          },
        },
      });

      // console.log("decrementLikeMeal", decrementLikeMeal);

      const findLike = await prisma.user.findUnique({
        where: {
          id: session.id,
        },
        include: {
          likes: true,
        },
      });

      // console.log("findLike", findLike);

      const [likeToRemove] = await findLike.likes.filter(
        (like) => like.meal_id === meal_id
      );

      console.log("likeToRemove", likeToRemove);

      const deleteLikeRecord = await prisma.like.delete({
        where: {
          id: await likeToRemove.id,
        },
        select: {
          id: true,
        },
      });

      console.log("deleteLikeRecord", deleteLikeRecord);

      // await prisma.$transaction([decrementLikeMeal, deleteLikeRecord]);

      return res.status(200).json({ Status: "Saved" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Session error - ${error}` });
  }
}
