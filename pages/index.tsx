/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import Layout from "../components/layout"
import WatchlistOverlay from "../components/overlay/watchlists"
import WorkspaceOverlay from "../components/overlay/workspaces"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { WSC_Active, WSC_setQuery } from "../redux/workspaceControlSlice"
import { addWarning } from "../redux/warningsSlice"
import { addToast } from "./_app"
import {
  setAppStatus,
  setAppVersion,
  setUserAgent
} from "../redux/settingsSlice"

import WatchlistPublicOverlay from "../components/overlay/watchlistsPublic"
import WorkspacePublicOverlay from "../components/overlay/workspacesPublic"
import Hotkeys from "../components/hotkeys"

const Perspective = dynamic(import("../components/perspective"), { ssr: false })
const LoadingComp = dynamic(import("../components/loading"), { ssr: false })

const Home: NextPage = (props: any) => {
  const dispatch = useAppDispatch()
  const { userAgent, version, query, ut_status } = props
  const [warning, setWarning] = useState<any>()
  const { data: session, status } = useSession()
  const router = useRouter()
  const WSC_active = useAppSelector(WSC_Active)

  /**
   * @name fetchData
   */
  const fetchData = useCallback(async () => {
    if (session?.user.canAccess) {
      addToast({ message: "You already have access?", intent: "danger" })
      router.push("/")
      return
    }
    await fetch(`/api/user/link/${router.query.k}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async e => {
      const d = await e.json()
      if (d.error) {
        addToast({ message: d.error, intent: "danger" })
        router.push("/noaccess")
      } else {
        addToast({ message: d.data, intent: "success" })
        router.push("/access")
        router.reload()
      }
    })
  }, [router, session])

  useEffect(() => {
    async function fetchData() {
      // You can await here
      await fetch("/api/jwt")
      // ...
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (session === undefined && status !== "loading") {
      router.replace({
        pathname: "/login[k]",
        query: query
      })
    }
    // router.push("/login", {query: query})
    if (!session && status !== "loading") {
      router.replace({
        pathname: "/login",
        query: query
      })
    }
    if (session && Object.keys(router.query)[0] === "k") fetchData()
    if (
      session &&
      !session.user.canAccess &&
      Object.keys(router.query)[0] !== "k"
    ) {
      router.push("/noaccess")
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    if (query && query.workspace) dispatch(WSC_setQuery(query.workspace))
    if (version) dispatch(setAppVersion(version))
  }, [dispatch, query, version])

  useEffect(() => {
    if (version) dispatch(setAppVersion(version))
  }, [dispatch, version])

  useEffect(() => {
    if (ut_status) dispatch(setAppStatus(ut_status))
  }, [dispatch, query, ut_status])

  useEffect(() => {
    dispatch(setUserAgent(userAgent))
    if (!userAgent.includes("Chrome")) {
      dispatch(
        addWarning([
          {
            icon: "dashboard",
            intent: "danger",
            title: "Use a chromium browser",
            content: "For now you should run this app in a chromium brower"
          }
        ])
      )
    }
  }, [dispatch, userAgent])

  useEffect(() => {
    if (warning === false)
      window.localStorage.setItem("perspective-warning", "false")
    if (window.localStorage.getItem("perspective-warning") !== "false")
      setWarning(true)
  }, [warning])

  const title = useMemo(() => {
    return WSC_active &&
      WSC_active.name !== undefined &&
      WSC_active.name !== null
      ? `${WSC_active.name}`
      : "Untitled"
  }, [WSC_active])

  if (!session && status === "loading") return <LoadingComp />

  return (
    <>
      <Head>
        <title>{title + " - " + process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        {session && session.user.canAccess && <Perspective />}
        <WorkspaceOverlay />
        <WorkspacePublicOverlay />

        <Hotkeys />
        {/* <ImportFromJSON/> */}
        {/* <OmniBar/> */}
        <WatchlistOverlay />
        <WatchlistPublicOverlay />
      </Layout>
    </>
  )
}
export async function getServerSideProps({ req, query }: any) {
  const package_json = require("../package.json")
  const version = package_json.version
  const protocol = req?.headers["x-forwarded-proto"] || "http"
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ""
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  let ut_status: any = []
  await fetch("https://betteruptime.com/api/v2/monitors", {
    headers: { Authorization: "Bearer KDsChPVTPyjky5E56QkKQyTA" }
  })
    .then(response => response.json())
    .then(data => {
      data.data.map((e: any) => {
        ut_status.push({
          type: e.type,
          name: e.attributes.pronounceable_name,
          status: e.attributes.status
        })
      })
    })
  await fetch("https://betteruptime.com/api/v2/heartbeats", {
    headers: { Authorization: "Bearer KDsChPVTPyjky5E56QkKQyTA" }
  })
    .then(response => response.json())
    .then(data => {
      data.data.map((e: any) => {
        ut_status.push({
          type: e.type,
          name: e.attributes.name,
          status: e.attributes.status
        })
      })
    })
  return {
    props: { userAgent, version, query, ut_status } // will be passed to the page component as props
  }
}
export default Home
