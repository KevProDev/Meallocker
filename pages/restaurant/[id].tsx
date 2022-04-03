import React from "react";
import { server } from "../../config";
import Head from "next/head";
import { useAppContext } from "../../context/store";
import {
  HeartIcon,
  BookmarkIcon as BookmarkIconOutline,
  ThumbUpIcon as ThumbUpIconOutline,
} from "@heroicons/react/outline";
import { XCircleIcon, ThumbUpIcon, BookmarkIcon } from "@heroicons/react/solid";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { signIn, signOut, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";

/////////////////////////

/////////////////
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`${server}/api/businesses/${params?.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const business = await res.json();
  // console.log(business);

  return {
    revalidate: 1, // rebuild this static page after every x seconds (when page is visited)
    props: {
      business: business,
      // restaurantReviews,
    },
  };
};

export default function Details(props: { business: any }) {
  // console.log(props);
  // console.log("Details Function Begin");

  const business = props.business;

  // const restaurantReview = props.business.restaurantReviews;

  // console.log("Details Function Phase");

  const [mealTitle, setMealTitle] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const mealTitleRef = useRef();
  const mealDescriptionRef = useRef();
  const { data: session } = useSession();
  const router = useRouter();
  const id = router.query.id ? router.query.id : null;
  const [like, setLike] = useState();

  // const likedMeal = () => {
  //   if (like && )
  // }

  const fetcher = async (id: string | string[] | null) => {
    const getRestarantReviews = await fetch(
      `${server}/api/businesses/review/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reviews = await getRestarantReviews.json();
    return reviews;
  };
  const {
    isSuccess,
    isLoading,
    data,
    isFetching,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery(["reviews", id ? id : null], () => fetcher(id), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    // cacheTime: 100000,
    enabled: !!id,
  });

  // const [restaurantData, setRestaurant] = useState({});

  // useEffect(() => {
  //   setRestaurant(data);
  // }, [data]);

  // console.log("restaurantData", restaurantData);

  // console.log("useQuery", {
  //   isLoading,
  //   isSuccess,
  //   isFetching,
  //   data,
  //   isRefetching,
  // });

  const newSubmitData = {
    ...business,
    mealTitle,
    mealDescription,
    session,
  };

  // try now

  const submitMealReview = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const restaurant = await fetch(`/api/businesses/review/${id}`, {
      method: "POST",
      body: JSON.stringify(newSubmitData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await restaurant.json().then((value) => {
      console.log("Value", value);
      refetch();
    });
  };

  const saveMeal = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    mealId: any
  ) => {
    e.preventDefault();
    console.log("works from the broswer");
    console.log(mealId);
    const saveMealToDb = await fetch(`/api/account/favMeal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meal_id: mealId,
        session: session,
      }),
    });
    await saveMealToDb.json().then(() => {
      refetch();
    });
    // console.log(saveResponse);
  };

  const removeSaveMeal = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    mealId: any
  ) => {
    e.preventDefault();
    console.log("remove from the database");
    console.log(mealId);
    const removeSaveMealToDb = await fetch(`/api/account/favMeal`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meal_id: mealId,
        session: session,
      }),
    });
    await removeSaveMealToDb.json().then(() => {
      refetch();
    });
    // console.log(saveResponse);
  };

  const likeMeal = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    mealId: any
  ) => {
    e.preventDefault();
    console.log("likeMeal Start");
    console.log(mealId);

    const likeMealToDb = await fetch(`/api/businesses/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meal_id: mealId,
      }),
    });

    await likeMealToDb.json().then(() => {
      refetch();
    });
  };

  const unLikeMeal = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    mealId: any
  ) => {
    e.preventDefault();
    console.log("works");
    console.log(mealId);
    const unLikeMealToDb = await fetch(`/api/businesses/like`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meal_id: mealId,
      }),
    });

    await unLikeMealToDb.json().then(() => {
      refetch();
    });

    // console.log(likeResponse);
  };
  const deleteReview = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    mealId: any
  ) => {
    e.preventDefault();
    console.log("BEGIN DELTE IN BROWSER", mealId);
    const deletedReview = await fetch(`/api/businesses/review/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mealId: mealId,
      }),
    });
    await deletedReview.json().then((value) => {
      console.log("VALUE", value);
      refetch();
    });
  };

  const formatTimeString = (str: string) => {
    if (str.length == 4) {
      return str.slice(0, 2) + ":" + str.slice(2);
    }
    return str;
  };

  const renderHours = (arr: { open: any[] }) => {
    const days: string[] | number = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    // This formats days into an array - replace day number duplicate with '',

    arr.open.forEach((d: { day: string }, index: number) => {
      if (index >= 1) {
        d.day == arr.open[index - 1].day ? (d.day = "") : null;
      }
    });

    return (
      <div>
        <h3 className=" font-bold pb-2 ">Opening Hours</h3>
        {business.hours && business.hours[0].is_open_now && <p>Open Now</p>}
        <table>
          <tbody>
            {arr.open.map((d: { day: number; start: any; end: any }) => (
              <tr key={d.day}>
                <td>{days[d.day]}</td>
                <td>
                  {formatTimeString(d.start)} = {formatTimeString(d.end)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {/* {console.log("Detail HTML BEGIN")} */}
      <Head>
        <title>FoodBuddy | {business.name}</title>
      </Head>

      <div className="relative h-[200px] sm:h-[200px] lg:h-[300px] xl:h-[400px] 2xl:h-[700px]">
        <Image
          src={business.image_url}
          layout="fill"
          objectFit="cover"
          priority={true}
        />
      </div>
      <main className="">
        <section className="w-11/12 max-w-4xl mx-auto px-4 sm:px-16 pb-4 bg-gray-100 pt-4 flex flex-col md:flex-row gap-2 md:gap-32  lg:gap-24 ">
          <div>
            <div className="flex flex-col justify-between">
              <h1 className="text-xl font-bold md:text-l">{business.name}</h1>
              <p>{business.categories[0].title}</p>
            </div>
            <p>
              {business.location.address1}, {business.location.city}{" "}
              {business.location.state}
            </p>
            <p className="text-gray-500">{business.display_phone}</p>
            <p className="text-gray-500 border-gray-200 pb-2">
              Price {business.price}
            </p>

            <div className="" />
          </div>
        </section>

        <section className="w-11/12 max-w-4xl mx-auto px-4 sm:px-16 pb-4 bg-gray-100 pt-2 mt-4">
          <h2 className="font-semibold text-xl md:text-l ">
            Leave Behind The Meal You Recommend
          </h2>
          {!session && (
            <a
              className=" inline-block  text-lg rounded-md py-2 px-4 mt-4 bg-yellow-300 text-black mb-4"
              href="/api/auth/signin/google"
              onClick={(e) => {
                e.preventDefault();
                signIn("loginSignIn");
              }}
            >
              Sign in
            </a>
          )}
          {session?.user && (
            <form className="relative" onSubmit={submitMealReview}>
              <input
                ref={mealTitleRef}
                value={mealTitle}
                onChange={(e) => setMealTitle(e.target.value)}
                aria-label="Name of your Meal"
                placeholder="Name of your Meal..."
                required
                className="px-4 border border-black py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <textarea
                ref={mealDescriptionRef}
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                aria-label="What was so great about it"
                placeholder="What was so great about it..."
                rows={4}
                required
                className="px-4 border border-black py-2 mt-1 mb-4 focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button
                className="flex items-center justify-center  right-1 top-1 px-4 font-medium h-8 bg-blue-700 hover:bg-blue-800 text-white rounded w-38"
                type="submit"
              >
                Post Review
              </button>
            </form>
          )}
        </section>

        <section className="w-11/12 max-w-4xl mx-auto px-4 sm:px-16 pb-16 bg-gray-100 pt-2 mt-4">
          {isSuccess && (
            <>
              {data && (
                <h2 className="font-semibold text-xl md:text-l pb-4 ">
                  {data?.restaurantReviews.length} People Already Review Their
                  Meal
                </h2>
              )}
            </>
          )}

          {isSuccess && (
            <>
              {data?.restaurantReviews.map(
                (review: {
                  id: React.Key | null | undefined;
                  user_image: string | undefined;
                  user_name:
                    | boolean
                    | React.ReactChild
                    | React.ReactFragment
                    | React.ReactPortal
                    | null
                    | undefined;
                  title:
                    | boolean
                    | React.ReactChild
                    | React.ReactFragment
                    | React.ReactPortal
                    | null
                    | undefined;
                  description:
                    | boolean
                    | React.ReactChild
                    | React.ReactFragment
                    | React.ReactPortal
                    | null
                    | undefined;
                  user_id: unknown;
                }) => {
                  return (
                    <div
                      key={review.id}
                      className="border-gray-200 border-b-2 pb-4 mb-4 flex"
                    >
                      <div className="flex pb-2 justify-between  ">
                        <div className="flex w-[50px] mr-2">
                          <img
                            src={
                              review.user_image
                                ? review.user_image
                                : "/favicon.ico"
                            }
                            alt="profile of user"
                            className=" w-12 h-12 rounded-full"
                          />
                        </div>
                        {!session && <div></div>}
                      </div>
                      <div className="  ">
                        <Link href={`/profile/${review.user_name}`}>
                          <a href="" className=" text-gray-700 block ">
                            <span className="text-sm font-bold ">
                              {review.user_name}
                            </span>
                          </a>
                        </Link>
                        <h3 className="font-semibold">{review.title} </h3>
                        <p className=" font-light pb-3 ">
                          {review.description}
                        </p>
                        {session && (
                          <div className="flex">
                            {data.user && (
                              <>
                                {data.user.likes.some(
                                  (like: { meal_id: any }) =>
                                    like.meal_id === review.id
                                ) ? (
                                  <ThumbUpIcon
                                    className="h-5 cursor-pointer pr-2 text-blue-500"
                                    onClick={(e) => unLikeMeal(e, review.id)}
                                  />
                                ) : (
                                  <ThumbUpIconOutline
                                    className="h-5 cursor-pointer pr-2 text-blue-500"
                                    onClick={(e) => likeMeal(e, review.id)}
                                  />
                                )}

                                {data.user.fav_meal.some(
                                  (meal: { meal_id: any }) =>
                                    meal.meal_id === review.id
                                ) ? (
                                  <BookmarkIcon
                                    className="h-5 cursor-pointer pr-2 text-blue-500"
                                    onClick={(e) =>
                                      removeSaveMeal(e, review.id)
                                    }
                                  />
                                ) : (
                                  <BookmarkIconOutline
                                    className="h-5 cursor-pointer pr-2 text-blue-500"
                                    onClick={(e) => saveMeal(e, review.id)}
                                  />
                                )}
                              </>
                            )}

                            {session?.id === review.user_id && (
                              <XCircleIcon
                                className="h-6 cursor-pointer pr-2 text-blue-500"
                                onClick={(e) => {
                                  deleteReview(e, review.id);
                                }}
                              >
                                Delete
                              </XCircleIcon>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
