import "tailwindcss/tailwind.css";
import Head from "next/head";
import { AppState } from "../context/store";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { Layout } from "../components/Layout";

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Meallocker | Meals Are Important</title>
        <meta property="og:title" content="Not sure where to eat? Perfect." />
        <meta property="og:description" content="Meallocker.com" />
        <meta property="og:image" content="/Home social.jpeg" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <AppState>
          <QueryClientProvider client={queryClient}>
            {/* <Navbar /> */}
            <Layout />

            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </AppState>
      </SessionProvider>
    </>
  );
}
