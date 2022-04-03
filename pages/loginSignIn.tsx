import Image from "next/image";
import { LockClosedIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { server } from "../config";
import { CtxOrReq } from "next-auth/client/_utils";
import React from "react";

export async function getServerSideProps(context: CtxOrReq | undefined) {
  // const previousUrl = context.req.headers.referer;
  return {
    props: {
      crsfToken: await getCsrfToken(context),
      // previousUrl: previousUrl,
    },
  };
}

export default function loginSignIn({ csrfToken }) {
  const [error, setError] = React.useState(null);
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);

  let redirectUrl = server;

  const login = (e) => {
    e.preventDefault();
    signIn("google", {
      callbackUrl: redirectUrl,
    });
  };

  useEffect(() => {
    const url = new URL(location.href);
    redirectUrl = url.searchParams.get("callbackUrl");
  });

  const modalState = () => {
    setModalOpen(!modalOpen);
  };

  const modalHandler = (() => {
    if (modalOpen) {
      return {
        modal: "block",
        background: "bg-blue-700",
      };
    } else {
      return {
        modal: "hidden",
        background: "",
      };
    }
  })();

  return (
    <main>
      <section>
        <div className="  grid grid-flow-row grid-cols-1 grid-rows-5 md:grid-rows-2 md:grid-flow-col h-screen md:grid-cols-2  ">
          <div className=" relative bg-green-500 row-span-1 md:row-span-2 md:col-span-1 block ">
            <Image
              src="https://images.squarespace-cdn.com/content/v1/551aba82e4b06ddeea1f4958/1636043991946-NN53WAVJ8A68H2AU8TU8/CHIUB-Brunch-Table-Cindys.jpg"
              layout="fill"
              objectFit="cover"
              priority={true}
            />
          </div>
          <div className="row-span-4 md:row-span-2 col-span-1">
            <div className=" w-3/4 my-[5%] md:my-[25%] m-auto space-y-8">
              <div>
                <img
                  src="/BLACK.png"
                  alt="company logo"
                  className="mx-auto h-12 w-auto"
                />
                <h2 className="mt-2 text-center text-2xl font-extrabold text-gray-900">
                  Sign in to your account
                </h2>
              </div>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  // tenantKey: ""
                }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .max(30, "Must be 30 characters or less")
                    .email("Invalid email address")
                    .required("Please enter your email"),
                  password: Yup.string().required("Please enter your password"),
                  // tenantKey: Yup.string()
                  //   .max(20, "Must be 20 characters or less")
                  //   .required("Please enter your organization name"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  const res = await signIn("domain-login", {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                    // tenantKey: values.tenantKey,
                    callbackUrl: redirectUrl,
                  });

                  if (res.error) {
                    setError(res.error);
                  } else {
                    setError(null);
                  }
                  if (res.url) {
                    router.push(res.url);
                    setSubmitting(false);
                  }
                }}
              >
                {(formik) => (
                  <form
                    onSubmit={formik.handleSubmit}
                    className="mt-8 space-y-6"
                    action="#"
                    method="POST"
                  >
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                      <div>
                        <input
                          name="csrfToken"
                          type="hidden"
                          defaultValue={csrfToken}
                        />
                      </div>
                      <div className="text-red-400 text-md text-center rounded p-2">
                        {error && `Sorry, we could'nt find your account`}
                      </div>
                      <div>
                        <label htmlFor="email-address" className="sr-only">
                          Email address
                        </label>
                        <Field
                          id="email-address"
                          name="email"
                          aria-label="enter your email"
                          aria-required="true"
                          type="email"
                          autoComplete="email"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-700 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Email address"
                        />
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="email " />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="password" className="sr-only">
                          Password
                        </label>
                        <Field
                          name="password"
                          aria-label="enter your password"
                          aria-required="true"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-700 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Password"
                        />
                      </div>
                      <div className="text-red-600 text-sm">
                        <ErrorMessage name="password" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-blue-700 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Remember me
                        </label>
                      </div>

                      {/* <div className="text-sm">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Forgot your password?
                        </a>
                      </div> */}
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 mb-4"
                      >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <LockClosedIcon
                            className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                            aria-hidden="true"
                          />
                        </span>
                        {formik.isSubmitting
                          ? "Please wait..."
                          : "Sign In with Email"}
                      </button>
                      <button
                        // type="submit"
                        onClick={login}
                        className="group relative w-full flex justify-center py-2 mb-4 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-white border-gray-800 items-center "
                      >
                        <img
                          src="/google.png"
                          alt="Google"
                          className=" w-6 h-6 mr-2 "
                        />
                        Sign In with Google
                      </button>

                      <p className="my-2 text-center text-sm text-gray-600">
                        Or{" "}
                        {/* <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                        </a> */}
                      </p>
                      <button
                        type="button"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                        data-modal-toggle="authentication-modal"
                        onClick={modalState}
                      >
                        Create a account
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
