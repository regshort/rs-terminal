import {
  Button,
  ButtonGroup,
  Card,
  H1,
  H2,
  H4,
  H5,
  Icon
} from "@blueprintjs/core"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { Flex } from "../stitches.config"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { Classes, Popover2 } from "@blueprintjs/popover2"
import { useRouter } from "next/router"
import LoadingComp from "../components/loading"

const Me: NextPage = () => {
  const router = useRouter()
  const [dump, setDump] = useState()
  const { data: session, status } = useSession()
  const delAccount = useCallback(async () => {
    const dump = await fetch("/api/user/delete", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(e => e.json())
    setDump(dump)
  }, [])
  const getDump = useCallback(async () => {
    const dump = await fetch("/api/user/dump", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(e => e.json())
    setDump(dump)
  }, [])
  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(dump)
    )}`
    const link = document.createElement("a")
    link.href = jsonString
    link.download = `${session?.user.name}${Date.now()}.json`

    link.click()
  }
  if (!session && status !== "loading") {
    router.replace({
      pathname: "/login"
    })
  }
  if (!session) return <LoadingComp />

  return (
    <>
      <Head>
        <title>Me - {process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="max-w-5xl mx-auto mt-2">
        <div className="flex items-center gap-5">
          <Link href={"/"}>
            <Button icon="arrow-left"></Button>
          </Link>

          <H2>Account Settings</H2>
        </div>
        <div className="flex flex-col gap-10">
          <div>
            <p>username: {session?.user.name}</p>
            <p>Access: {session?.user.canAccess ? "true" : "false"}</p>
          </div>
          <div>
            <H4>Download Data</H4>
            <p>Download all your data associated with this user</p>
            <ButtonGroup className="gap-1">
              <Button
                disabled={dump}
                onClick={() => {
                  getDump()
                }}
              >
                Request Data
              </Button>
              <Button disabled={!dump} onClick={exportData}>
                Download Data
              </Button>
            </ButtonGroup>
          </div>
          <div>
            <H4>Delete User</H4>
            <p>Delete all your data associated with this user</p>
            <Flex className="gap-3 items-center">
              <Popover2
                captureDismiss
                content={
                  <Card>
                    <H5>Confirm deletion</H5>
                    <p>
                      Are you sure you want to delete your account? You
                      won&apros;t be able to recover it.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 15
                      }}
                    >
                      <Button
                        className={Classes.POPOVER2_DISMISS}
                        style={{ marginRight: 10 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          delAccount()
                        }}
                        intent="danger"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                }
              >
                <Button intent="danger">Delete</Button>
              </Popover2>
              <p className="m-0 text-red-500">This cannot be undone</p>
            </Flex>
          </div>
        </div>
      </div>
    </>
  )
}
export default Me
