import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.YELP_API_KEY;
  const baseUrl = "https://api.yelp.com/v3/businesses/";

  try {
    // res.status(200).json({ memo: "test" });
    let query = await fetch(`${baseUrl}${req.query.id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: "application/json",
        "x-requested-with": "xmlhttprequest",
        "Access-Control-Allow-Origin": "*",
      },
    });
    let dataYelp = await query.json();

    const restaurant_id = req.query.id;

    // check to see if REST is on the DATABASE
    const getRestaurant = await prisma.restaurant.findUnique({
      where: {
        rest_id: restaurant_id,
      },
    });

    // If the REST IS NOT THERE SAVE the data
    if (!getRestaurant) {
      // const restaurant_id = req.query.id;

      await prisma.restaurant.create({
        data: {
          rest_id: restaurant_id,
          name: dataYelp.name,
          address: dataYelp.location.address1,
          city: dataYelp.location.city,
        },
      });
      // res.setHeader("Cache-Control", "s-maxage=86400");
      return res.status(200).json(dataYelp);
    }
    // res.setHeader("Cache-Control", "s-maxage=86400");
    return res.status(200).json(dataYelp);
  } catch (error) {
    res.status(500).json({ message: `Server error - ${error}` });
  }
}
