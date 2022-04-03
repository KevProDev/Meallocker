import { getSession, GetSessionParams } from "next-auth/react";
import { Layout } from "../components/Layout";
import Banner from "../components/Restaurantsearch/Banner";
import BusinessList from "../components/Restaurantsearch/BusinessList";

export default function Home() {
  return (
    <div>
      <Banner />
      <main className="max-w-7xl mx-auto px-4">
        <section className="pt-6">
          <BusinessList />
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(ctx: GetSessionParams | undefined) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      props: {},
    };
  }
  return {
    props: {
      session,
    },
  };
}
