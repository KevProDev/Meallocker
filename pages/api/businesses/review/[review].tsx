import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const restaurant_id = req.query.review;
  const session = await getSession({ req });

  try {
    if (req.method === "GET") {
      const getRestaurant = await prisma.restaurant.findUnique({
        where: {
          rest_id: restaurant_id,
        },
        include: {
          users_meals_review: {
            orderBy: {
              created_at: "desc",
            },
          },
        },
      });
      if (session) {
        const user = await prisma.user.findUnique({
          where: {
            id: session.id,
          },
          include: {
            fav_meal: true,
            likes: true,
          },
        });

        if (!getRestaurant) {
          await prisma.restaurant.create({
            data: {
              rest_id: restaurant_id,
            },
          });

          const data = {
            restaurantReviews: [],
            // user: user ? user : {},
            Where: "the resturant is not stored but store id",
          };

          // res.setHeader("Cache-Control", "s-maxage=86400");
          return res.status(200).json(data);
        }
        const data = {
          restaurantReviews: getRestaurant.users_meals_review,
          user: user ? user : {},
          Where: "the resturant is stored",
        };
        return res.status(200).json(data);
      } else {
        if (!getRestaurant) {
          await prisma.restaurant.create({
            data: {
              rest_id: restaurant_id,
            },
          });

          const data = {
            restaurantReviews: [],
            user: {},
            Where: "the resturant is not stored but store id",
          };

          // res.setHeader("Cache-Control", "s-maxage=86400");
          return res.status(200).json(data);
        }
        const data = {
          restaurantReviews: getRestaurant.users_meals_review,
          user: {},
          Where: "the resturant is stored",
        };
        return res.status(200).json(data);
      }

      // console.log("RIGHT", getRestaurant);

      // res.setHeader("Cache-Control", "s-maxage=86400");
      // return res.status(200).json({ data: getRestaurant });
    }
    if (req.method === "POST") {
      const session = await getSession({ req });
      const {
        mealTitle: title,
        mealDescription: description,
        name: restName,
      } = req.body;

      // console.log("ID", req.body.id);

      // console.log("req.body", req.body);

      const userFromDb = await prisma.user.findUnique({
        where: { id: session?.id },
      });

      // Allow us to post the review on the meal

      const mealCreated = await prisma.meal.create({
        data: {
          title: title,
          description: description,
          user_id: userFromDb.id,
          user_image: userFromDb.image ? userFromDb.image.toString() : "",
          rest_name: restName,
          rest_id: restaurant_id.toString(),
          user_name: userFromDb.name.toString(),
        },
      });

      // const meals = await prisma.user.deleteMany({});

      return res.status(200).json({ status: "Posted" });
      // return res.status(200).json(getRestaurantReview);
    }
    if (req.method === "DELETE") {
      const mealId = req.body.mealId;

      const deletedMeal = await prisma.meal.delete({
        where: {
          id: mealId,
        },
      });

      // const getRestaurantReview = await prisma.meal.findMany({
      //   where: {
      //     rest_id: restaurant_id,
      //   },
      //   orderBy: {
      //     created_at: "desc",
      //   },
      // });

      // return res.status(200).json(getRestaurantReview);
      return res.status(200).json({ status: "Deleted" });
    }
    // return res.status(200).json({ status: "Success" });
  } catch {}
}
