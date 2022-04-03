import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function saveHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { meal_id, session } = req.body;

      console.log(req.body);

      const saveMeal = await prisma.favorite_Meal.create({
        data: {
          meal_id,
          user_id: session.id,
        },
      });

      return res.status(200).json({ Status: "Saved" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Session error - ${error}` });
  }
}
