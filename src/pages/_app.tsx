import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Topbar } from "@/components/ui/Topbar";
import { Footer } from "@/components/ui/footer";

type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  const errorPages = ["/404", "/500"];
  const isErrorPage = errorPages.includes(router.pathname);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Readify" />
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        {!isErrorPage && <Topbar />}
        <main className="flex-grow">
          {getLayout(<Component {...pageProps} />)}
        </main>
        {!isErrorPage && <Footer />}
      </div>
    </>
  );
}

export default MyApp;
