import { Button, H1, H4 } from "@blueprintjs/core"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { Flex } from "../stitches.config"

const Forofor: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - {process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Flex
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column"
        }}
      >
        <H1
          style={{ fontSize: "25em", textAlign: "center" }}
          className="text-pop-up-top"
        >
          404
        </H1>
        <Flex
          className="text-focus-in"
          style={{ marginTop: "9em", flexDirection: "column" }}
        >
          <H4>Whoops this really should not happen</H4>
          <Link href={"/"}>
            <Button icon="home" text="Go back Home" />
          </Link>
        </Flex>
      </Flex>
    </>
  )
}
export default Forofor
