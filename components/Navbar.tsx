import React from "react";
import { useState, useEffect } from "react";
import { MenuIcon, UserCircleIcon, XIcon } from "@heroicons/react/solid";
import { Transition, Menu } from "@headlessui/react";
import { signIn, signOut, useSession, getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { server } from "../config";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: session } = useSession();
  const { asPath } = useRouter();

  let redirectUrl = server;

  useEffect(() => {
    const url = new URL(location.href);
    redirectUrl = url.searchParams.get("callbackUrl");
  });

  const login = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    signIn("loginSignIn");
  };
  const logout = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    signOut();
  };

  const loginDemo = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    signIn("domain-login", {
      email: "thisismyemailallday@gmail.com",
      username: "Demo",
      password: "Demo",
      // callbackUrl: redirectUrl,
    });
  };

  const isLoginPage = () => {
    if (asPath.includes("loginSignIn")) {
      return `hidden`;
    }
    if (asPath.includes("loginSignIn")) {
      return "";
    }
  };

  return (
    <header className={`bg-white sticky top-0 z-50 ${isLoginPage()}`}>
      <nav className="max-w-7xl mx-auto grid grid-cols-2 py-3 px-5 md:px-10 bg-white lg:grid-cols-5">
        {/* Left */}
        <div className="relative flex items-center h-10 cursor-pointer my-auto col-span-1">
          <Link href="/">
            <a href="">
              <img src="/BLACK.png" alt="company logo" />
            </a>
          </Link>
        </div>

        {/* Middle */}
        {/* <div className="hidden lg:flex items-center py-2 font-semibold col-span-2 justify-end pr-5 list-none space-x-8 text-lg ">
        <Link href="/restaurantsearch">
          <a href="">Restaurant Search</a>
        </Link>
      </div> */}
        {/* Right */}
        <div className="flex grid-cols-2 items-center space-x-4 justify-end text-gray-600 col-span-1 lg:col-span-4">
          {!session && (
            <div className="flex items-center space-x-4">
              {/* <Link href="/restaurantsearch">
              <a href="" className="font-bold hidden lg:inline-block">
                Restaurant Search
              </a>
            </Link> */}
              <button
                className="hidden lg:inline-flex col-span-1 cursor-pointer text-md rounded-md py-2 px-3 text-white border-blue-500 border hover:text-blue-500 bg-blue-500 hover:bg-white hover:border hover:border-blue-500 "
                onClick={login}
              >
                Sign in
                {session && `as ${session.user.name}`}
              </button>
              <button
                className="hidden lg:inline-flex col-span-1 cursor-pointer text-md rounded-md py-2 px-3 text-white border-blue-500 border hover:text-blue-500 bg-blue-500 hover:bg-white hover:border hover:border-blue-500 "
                onClick={loginDemo}
              >
                Demo Login
                {session && `as ${session.user.name}`}
              </button>
              {/* <Link href="/api/auth/credentials-signin">
                <a href="">
                  <button className="hidden lg:inline-flex col-span-1 cursor-pointer text-md rounded-md py-2 px-3 text-white border-blue-500 border hover:text-blue-500 bg-blue-500 hover:bg-white hover:border hover:border-blue-500 ">
                    Demo Login
                    {session && `as ${session.user.name}`}
                  </button>
                </a>
              </Link> */}
              {/* <p
              className="hidden lg:inline-flex col-span-1 cursor-pointer text-md rounded-2xl py-2"
              onClick={logout}
            >
              Sign Out
            </p> */}
            </div>
          )}
          {session && (
            <div className="space-x-4">
              {/* <Link href="/restaurantsearch">
              <a href="" className=" font-bold hidden lg:inline-block">
                Restaurant Search
              </a>
            </Link> */}
              {/* <p
              className="hidden lg:inline-flex col-span-1 cursor-pointer text-md rounded-2xl py-2"
              onClick={login}
            >
              {session.user.name}
            </p> */}
              <Link href={`/mealFeed`}>
                <a
                  href=""
                  className=" font-bold hidden lg:inline-block py-2 px-2"
                >
                  Friends Meals
                </a>
              </Link>
              <Link href={`/profile/${session.user.name}`}>
                <a
                  href=""
                  className=" font-bold hidden lg:inline-block py-2 px-2"
                >
                  Profile
                </a>
              </Link>
              <button
                className="hidden lg:inline-flex col-span-1 cursor-pointer text-md rounded-md py-2 px-3 text-white border-blue-500 border hover:text-blue-500 bg-blue-500 hover:bg-white hover:border hover:border-blue-500"
                onClick={logout}
              >
                Sign Out
              </button>
            </div>
          )}
          <button
            className="flex lg:hidden items-center space-x-2 rounded-full p-2 text-black"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-controls="mobile-menu"
            aria-expanded="true"
          >
            <MenuIcon className="h-6" />
            {/* <UserCircleIcon className="h-8" /> */}
          </button>
        </div>
        <Transition
          className="flex col-span-2 bg-white z-10 mt-[-40px] "
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {() => (
            <div className="lg:hidden id:mobile-menu grid  grid-cols-2  ">
              <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 col-span-1 ">
                <Link href="/">
                  <a
                    href=""
                    className="w-[230px] -ml-10"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <img src="/BLACK.png" alt="company logo" />
                  </a>
                </Link>
                {!session && (
                  <div className="flex flex-col items-start">
                    <button
                      className=" font-bold cursor-pointer text-xl rounded-2xl py-2"
                      onClick={login}
                    >
                      Sign In
                      {session && `as ${session.user.name}`}
                    </button>
                    <button
                      className="font-bold cursor-pointer text-xl rounded-2xl py-2"
                      onClick={loginDemo}
                    >
                      Demo Login
                      {session && `as ${session.user.name}`}
                    </button>
                  </div>
                )}
                {session && (
                  <div className="flex flex-col items-start">
                    <Link href={`/mealFeed`}>
                      <button
                        className=" font-bold cursor-pointer text-xl rounded-2xl py-2"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        Friend's Meal
                      </button>
                    </Link>
                    <button className="font-bold cursor-pointer text-xl rounded-2xl py-2">
                      {session.user.name}
                    </button>
                    <button
                      className="font-bold cursor-pointer text-xl rounded-2xl py-2"
                      onClick={logout}
                    >
                      Sign Out
                    </button>
                    <Link href="/profile">
                      <a href="" className=" font-bold hidden lg:inline-block">
                        Profile
                      </a>
                    </Link>
                  </div>
                )}
              </div>
              <div className="col-span-1">
                <button
                  className="lg:hidden items-center space-x-2 rounded-full p-2 text-black block ml-auto "
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  aria-controls="mobile-menu"
                  aria-expanded="true"
                >
                  <XIcon className="h-6" />
                  {/* <UserCircleIcon className="h-8" /> */}
                </button>
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </header>
  );
}
