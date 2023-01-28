import Document, { Html, Head, Main, NextScript } from "next/document"
import React, { StrictMode } from "react"
import GeneralHead from "../components/meta/generalhead"
import TwitterHead from "../components/meta/twitterHead"
import { getCssText } from "../stitches.config"

class MyDocument extends Document {
  render() {
    return (
      <StrictMode>
        <Html>
          <Head>
            <style
              id="stitches"
              dangerouslySetInnerHTML={{ __html: getCssText() }}
            />
            <link
              href="https://fonts.googleapis.com/css?display=swap&family=Roboto+Mono:200,400%7CMaterial+Icons%7COpen+Sans:300,400,700"
              rel="stylesheet"
            />
            <meta charSet="utf-8" />

            <meta
              name="description"
              content="Streamed Interactive analytics for short exempt data, create and share workspaces, watchlists and much more"
            />
            <meta
              name="keywords"
              content="short exempt, shorts, dashboard, analytics, complete data, "
            />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <GeneralHead
              description={
                "Streamed Interactive analytics for short exempt data, create and share workspaces, watchlists and much more"
              }
              ogUrl={process.env.NEXT_PUBLIC_WEB_URL as string}
              ogImage={
                (process.env.NEXT_PUBLIC_WEB_URL as string) + "/sapp.png"
              }
              ogTitle={"terminal.shortex.app"}
            />
            <TwitterHead
              description={
                "Streamed Interactive analytics for short exempt data, create and share workspaces, watchlists and much more"
              }
              ogUrl={process.env.NEXT_PUBLIC_WEB_URL as string}
              ogImage={
                (process.env.NEXT_PUBLIC_WEB_URL as string) + "/sapp.png"
              }
              ogTitle={"terminal.shortex.app"}
            />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      </StrictMode>
    )
  }
}

export default MyDocument
