import {
  Card,
  Button,
  Text,
  ButtonGroup,
  InputGroup,
  ControlGroup,
  Callout,
  Divider
} from "@blueprintjs/core"
import { NextPage, NextPageContext } from "next"
import { signIn, useSession } from "next-auth/react"
import Head from "next/head"
import Github from "../public/svg/github.svg"
import Google from "../public/svg/google.svg"
import Discord from "../public/svg/discord.svg"
import Reddit from "../public/svg/reddit.svg"
import validator from "validator"
import { useTheme } from "next-themes"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import dynamic from "next/dynamic"
import { CtxOrReq } from "next-auth/client/_utils"
import { addToast } from "./_app"
import { Flex } from "../stitches.config"
import Alphawarning from "../components/alphaWarning"
const Logos = dynamic(() => import("../components/logo"), { ssr: false })
const LoadingComp = dynamic(import("../components/loading"), { ssr: false })

const Login: NextPage = (props: any) => {
  const { query, version } = props
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [emailInput, setEmailInput] = useState("")
  const { data: session, status } = useSession()

  const redir = useCallback(() => {
    if (router && session) {
      router.push({
        pathname: "/",
        query: query
      })
    }
  }, [query, router, session])
  useEffect(() => {
    if ("email" in query) {
      addToast({
        message: "A sign in link has been sent to your email address.",
        intent: "success",
        timeout: 10000
      })
    }
  }, [query])
  useEffect(() => {
    if (router && session) redir()
  }, [redir, router, session])

  const validateEmail = (email: string) => {
    if (validator.isEmail(email)) {
      return true
    } else {
      return false
    }
  }
  if (session || status === "loading") return <LoadingComp />
  return (
    <>
      <Head>
        <title>Login - {process.env.NEXT_PUBLIC_APP_NAME as string}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
     
      <Flex className="flex-col w-full h-screen">
        <Button
          style={{ position: "absolute", right: 0, top: 0, zIndex: 999 }}
          title="switch theme"
          minimal
          icon={theme === "dark" ? "flash" : "moon"}
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark")
          }}
        />

        <Flex className="bp4-text-large justify-center flex-col w-fit m-auto">
        <Callout intent="primary" className="mb-2 -mt-20">
       Closed Beta for regShort Terminal starting soon.<br/>
       Sign up below to be on the Waitlist.
      </Callout>
          <Card elevation={3}>
            <Flex className="w-full sflex items-center mb-5">
              <Link href={process.env.NEXT_PUBLIC_WEB_URL as string}>
                <div className="w-52 cursor-pointer" title="Find out more">
                  {/* <Logos /> */}
                  <h1 className="h-6 font-serif text-4xl mb-4 leading-none tracking-wide sm:block">
                    reg<span className="font-extrabold">sho</span>rt
                  </h1>
                </div>
              </Link>
                <div className="text-xs w-full text-mono text-right" title="Find out more">
                 v.{version}
                </div>
            </Flex>
            <Flex className="flex-col ">
              <ButtonGroup className="gap-2 flex-col sm:flex-row  my-2">
                <Button fill onClick={() => signIn("discord")} >
                  <Flex className="items-center gap-2">
                    <Discord fill={theme === "light" ? "#5f6b7c" : "#abb3bf"} />
                    <Text>Discord</Text>
                  </Flex>
                </Button>
                <Button fill onClick={() => signIn("github")} >
                  <Flex className="items-center gap-2">
                    <Github fill={theme === "light" ? "#5f6b7c" : "#abb3bf"} />
                    <Text>GitHub</Text>
                  </Flex>
                </Button>
                <Button fill onClick={() => signIn("google")} >
                  <Flex className="items-center gap-2">
                    <Google fill={theme === "light" ? "#5f6b7c" : "#abb3bf"} />
                    <Text>Google</Text>
                  </Flex>
                </Button>
                <Button fill onClick={() => signIn("reddit")} >
                  <Flex className="items-center gap-2">
                    <Reddit fill={theme === "light" ? "#5f6b7c" : "#abb3bf"} />
                    <Text>Reddit</Text>
                  </Flex>
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <ControlGroup fill className="gap-2 mt-1 shadow-none" vertical={false} >
                  <InputGroup
                    type="email"
                    value={emailInput}
                    onChange={e => {
                      setEmailInput(e.target.value)
                    }}
                    inputClassName="!shadow-none"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (validateEmail(emailInput)) {
                          signIn("email", { email: emailInput })
                        } else {
                          addToast({
                            message: "Enter a valid email",
                            intent: "danger"
                          })
                        }
                      }
                    }}
                    className="mr-0"
                    placeholder="E-Mail "
                  />
                  <Button
                    small
                    onClick={() => {
                      if (validateEmail(emailInput)) {
                        signIn("email", { email: emailInput })
                      } else {
                        addToast({
                          message: "Enter a valid email",
                          intent: "danger"
                        })
                      }
                    }}
                    icon="log-in"
                  >
                    Magic Link
                  </Button>
                </ControlGroup>
              </ButtonGroup>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </>
  )
}

export default Login

export async function getServerSideProps({ req, query }: any) {
  const package_json = require("../package.json")
  const version = package_json.version
  const protocol = req?.headers["x-forwarded-proto"] || "http"
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ""
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
 
  return {
    props: { userAgent, version, query } // will be passed to the page component as props
  }
}
