import {
  Card,
  Button,
  Text,
  ButtonGroup,
  InputGroup,
  ControlGroup,
  Callout
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
  const { query } = props
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
        <Callout intent="primary" className="mb-2">
       Closed Beta for regShort Terminal starting soon
      </Callout>
          <Card elevation={3}>
            <Flex className="w-full sm:gap-3 flex-col sm:flex-col mb-4">
              <Link href={process.env.NEXT_PUBLIC_WEB_URL as string}>
                <div className="w-52 cursor-pointer" title="Find out more">
                  {/* <Logos /> */}
                  <h1 className="h-6 font-serif text-4xl mb-4 leading-none tracking-wide sm:block">
                    reg<span className="font-extrabold">sho</span>rt
                  </h1>
                </div>
              </Link>
            </Flex>
            <Flex className="flex-col">
              <ButtonGroup className="gap-2 flex-col sm:flex-row mb-2">
                <Button fill onClick={() => signIn("discord")} minimal>
                  <Flex className="items-center gap-2">
                    <Discord fill={theme === "light" ? "#5f6b7c" : "#abb3bf"} />
                    <Text>Discord</Text>
                  </Flex>
                </Button>
                <Button fill onClick={() => signIn("github")} minimal>
                  <Flex className="items-center gap-2">
                    <Github fill={theme === "light" ? "#5f6b7c" : "#abb3bf"} />
                    <Text>GitHub</Text>
                  </Flex>
                </Button>
                <Button fill onClick={() => signIn("google")} minimal>
                  <Flex className="items-center gap-2">
                    <Google fill={theme === "light" ? "#5f6b7c" : "#abb3bf"} />
                    <Text>Google</Text>
                  </Flex>
                </Button>
                <Button fill onClick={() => signIn("reddit")} minimal>
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
                    minimal
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

Login.getInitialProps = async ({ req, query }: NextPageContext) => {
  return { query }
}
