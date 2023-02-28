import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import * as perspective from "@finos/perspective"
import { useAppSelector, useAppDispatch } from "../../redux/hooks"
import "@finos/perspective-workspace"
import "@finos/perspective-viewer-datagrid"
import "@finos/perspective-viewer-d3fc"
import { useTheme } from "next-themes"
import { fetcher } from "../layout"
import { addToast } from "../../pages/_app"
import jsonDiff from "json-diff"
import {
  WSC_Active,
  WSC_ActiveConfigSetter,
  WSC_ActiveSetter,
  WSC_DataSelector,
  WSC_Query,
  WSC_setActive,
  WSC_setActiveSetterOnly,
  WSC_setChanges,
  WSC_setConfigSetter,
  WSC_setCurrentConfig
} from "../../redux/workspaceControlSlice"
import { useRouter } from "next/router"
import NonIdeal from "./nonIdeal"
import moment from "moment"
import _ from "lodash"
import { setDateIndex, setDateRange } from "../../redux/menuSlice"
import useSWR from "swr"
import {
  setWsStatus,
  showTickerMarquee,
  wsStatus
} from "../../redux/settingsSlice"
import {
  dateStringToIndex,
  string2DateRange
} from "../../lib/dateRangeIndex2String"

// Required because perspective-workspace doesn't export type declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "perspective-workspace": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

function Perspective() {
  const dispatch = useAppDispatch()

  const [websocket, setWebsocket] = useState<any>()

  const { theme, setTheme } = useTheme()
  const [newViewFromContext, setNewViewFromContext] = useState()
  const [newConfig, setNewConfig] = useState()
  const workspace = useRef<any>(null)
  const query = useAppSelector(WSC_Query)
  const dataSelector = useAppSelector(WSC_DataSelector)
  const [defaultDone, setDefaultDone] = useState<any>()
  const showMarquee = useAppSelector(showTickerMarquee)
  const router = useRouter()
  const ws_status = useAppSelector(wsStatus)
  const { data: wsDefault, error: ws_error } = useSWR(
    "/api/workspace/default",
    fetcher
  )
  const { data: wsUserDefault, error: ud_error } = useSWR(
    "/api/user/default",
    fetcher
  )
  const wscActiveSetter = useAppSelector(WSC_ActiveSetter)
  const wscActive = useAppSelector(WSC_Active)
  const wscActiveConfigSetter = useAppSelector(WSC_ActiveConfigSetter)

  const applyConfig = useCallback(
    async (workspaces: any) => {
      console.log("apply config", workspaces)
      await workspace.current.restore(workspaces)

      if (ws_status === "close") {
        addToast({
          message: "no connection to server",
          intent: "danger",
          icon: "offline"
        })
        return
      }
      if (!workspaces || !workspace) {
        return false
      }
      if (workspace) {
        await workspace.current.restore(workspaces)
        return true
      } else {
        console.log(workspace, "workspace")

        addToast({
          message: "!workspace",
          intent: "danger",
          icon: "offline"
        })
      }
      return false
    },
    [ws_status]
  )

  // also query handeling or just workspace to load on load
  const defaultWorkspace = useCallback(async () => {
    if (wsDefault === undefined || wsUserDefault === undefined || defaultDone)
      return
    if (query) {
      await fetch(`/api/workspace/${query}`).then(async e => {
        const d = await e.json()
        if (d.content === null) {
          addToast({
            message: "Not able to find workspace",
            intent: "warning",
            icon: "warning-sign"
          })
          router.push("/")
          return
        }
        dispatch(WSC_setActive(d.content))
        addToast({
          message: "Loaded workspace from query",
          intent: "success",
          icon: "tick"
        })
      })
      return
    }

    if (wsUserDefault !== undefined && wsUserDefault.id !== "null") {
      addToast({
        message: "Loaded default user workspace",
        intent: "success",
        icon: "tick"
      })
      dispatch(WSC_setActive(wsUserDefault))
      return
    } else if (wsDefault !== undefined && wsDefault !== null) {
      addToast({
        message: "Loaded default global workspace",
        intent: "success",
        icon: "tick"
      })
      dispatch(WSC_setActive(wsDefault))
      return
    }
  }, [defaultDone, dispatch, query, router, wsDefault, wsUserDefault])

  const applyTheme = useCallback(async () => {
    if (workspace.current) {
      for (let i = 0; i < workspace.current.children.length; i++) {
        workspace.current.children[i].restore({
          theme: theme === "dark" ? "Material Dark" : "Material Light"
        })
      }
    }
  }, [workspace, theme])

  const handleRangeChange = useCallback(
    async (dateRange: any, index: any, currentConfig: any) => {
      let currentCopy = _.cloneDeep(currentConfig)
      if (currentConfig === null) {
        addToast({
          message: "No viewes found to apply this filter to",
          intent: "danger",
          icon: "error"
        })
        dispatch(setDateRange([null, null]))
        return
      }
      dispatch(setDateRange(dateRange))
      dispatch(setDateIndex(index))
      if (currentConfig.master !== undefined && currentConfig.master !== null) {
        const masters = currentConfig.master.widgets.map(
          (widget: any) => widget
        )
        masters.map((master: any) => {
          if (dateRange[1] === null || dateRange[0] === null) {
            return
          } else {
            const filtered = currentCopy.viewers[master].filter.filter(
              (element: any, index: any) => {
                if (element[0] !== "date") return element
              }
            )
            currentCopy.viewers[master].filter = filtered
            currentCopy.viewers[master].filter.push(
              ["date", ">=", moment(dateRange[0]).unix() * 1000],
              ["date", "<=", moment(dateRange[1]).unix() * 1000]
            )
            dispatch(WSC_setConfigSetter(currentCopy))
            addToast({
              message: "setting filter to date with master",
              intent: "warning",
              icon: "calendar"
            })
          }
        })
      } else {
        Object.keys(currentCopy.viewers).map((key: any, windex) => {
          if (dateRange[0] !== null && dateRange[1] === null) {
            const filtered = currentCopy.viewers[key].filter.filter(
              (element: any, index: any) => {
                if (element[0] !== "date") return element
              }
            )
            currentCopy.viewers[key].filter = filtered
            currentCopy.viewers[key].filter.push(
              ["date", ">=", moment(dateRange[0]).unix() * 1000],
              ["date", "<=", moment(dateRange[0]).unix() * 1000]
            )
          } else {
            const filtered = currentCopy.viewers[key].filter.filter(
              (element: any, index: any) => {
                if (element[0] !== "date") return element
              }
            )
            if (dateRange[0] === null && dateRange[1] === null) {
              currentCopy.viewers[key].filter = filtered
            }else{
              currentCopy.viewers[key].filter = filtered
              currentCopy.viewers[key].filter.push(
                ["date", ">=", moment(dateRange[0]).unix() * 1000],
                ["date", "<=", moment(dateRange[1]).unix() * 1000]
              )
            }
          }
        })
        dispatch(WSC_setConfigSetter(currentCopy))
        addToast({
          message: "setting date filter",
          intent: "warning",
          icon: "calendar"
        })
      }
    },
    [dispatch]
  )
  const activeConfig = useCallback(async () => {
    if (wscActive.workspace === null || wscActive.name === null) return
    if (typeof wscActive.relativeDate === "string") {
      handleRangeChange(
        string2DateRange(wscActive.relativeDate),
        dateStringToIndex(wscActive.relativeDate),
        wscActive.workspace
      )
      return
    } else {
      dispatch(setDateRange([null, null]))
      dispatch(setDateIndex(-1))
    }
    if (defaultDone) {
      // addToast({
      //   message: "Loaded Workspace " + wscActive.name,
      //   timeout: 900,
      //   icon: "modal",
      // })
    }
    const apply = await applyConfig(wscActive.workspace)
    if (!apply) return
    applyTheme()
  }, [
    wscActive.workspace,
    wscActive.name,
    wscActive.relativeDate,
    defaultDone,
    applyConfig,
    applyTheme,
    handleRangeChange,
    dispatch
  ])

  const changes = useCallback(async () => {
    if (newConfig !== undefined && newConfig !== null && wscActive !== null) {
      const changes = jsonDiff.diff(newConfig, wscActive.workspace)
      let listOfChanges: any[] = []
      if (changes !== undefined && changes !== null) {
        Object.keys(changes).map(key => {
          if (!changes[key]) return
          Object.keys(changes[key]).map(key2 => {
            // simply ignoring settings and theme keys,
            // these will still be saved in the workspace but won't be look at as a change
            if (Object.keys(changes[key][key2]).includes("settings")) return
            if (Object.keys(changes[key][key2]).includes("theme")) return

            listOfChanges.push(changes[key][key2])
          })
        })
      }
      dispatch(WSC_setChanges(listOfChanges))
    }
  }, [newConfig, wscActive, dispatch])

  const init = useCallback(async () => {
    if (websocket === undefined) {
      setWebsocket(
        perspective.default.websocket(process.env.NEXT_PUBLIC_WS_URL as string)
      )
    }
    if (websocket === undefined || websocket === null) return
    // we get dataSelector here if null return to default
    /**
     * @data
     * last 6 months default  0
     * last 12 months 1
     * last 24 months 2
     * full data  3
     */
    let table

    if (dataSelector === "Last 6 Months") {
      table = websocket.open_table("table_0")
    } else if (dataSelector === "Last 12 Months") {
      table = websocket.open_table("table_1")
    } else if (dataSelector === "Last 24 Months") {
      table = websocket.open_table("table_2")
    } else if (dataSelector === "Full Data") {
      table = websocket.open_table("table_3")
    } else {
      table = websocket.open_table("table_0")
    }
    if (dataSelector !== null) {
      addToast({
        message: "Selecting data " + dataSelector,
        icon: "database",
        intent: "primary"
      })
    }
    await workspace.current.addTable("main", table)
  }, [dataSelector, websocket])

  const newViewInit = useCallback(() => {
    setTimeout(async () => {
      for (let index = 0; index < workspace.current.children.length; index++) {
        if (
          workspace.current.children[index].attributes.getNamedItem("name") ===
          null
        ) {
          // addToast({
          //   message: "Filters automatically added",
          //   intent: "warning",
          //   icon: "filter",
          // })
          // workspace.current.children[index].restore({
          //   filter: [["ticker", "==", "GME"]],
          // })
          workspace.current.children[index].restore({
            theme: theme === "light" ? "Material Light" : "Material Dark"
          })
          // how to set name but better if user types it
          // workspace.current.shadowRoot.querySelector('.p-TabBar-tabLabel').setAttribute('value', 'autoGenerated Name')
          await workspace.current.flush()
        }
      }
    }, 1)
  }, [workspace, theme])

  useEffect(() => {
    if (websocket) {
      websocket._ws.onopen = (e: any) => {
        websocket._ws.send(JSON.stringify({ id: -1, cmd: "init" })) //perspective does this in onopen so we do the same here
        dispatch(setWsStatus(e.type))
      }
      websocket._ws.onclose = async (e: any) => {
        await workspace.current.workspace.clearLayout()
        await workspace.current.removeTable("main")
        dispatch(setWsStatus(e.type))
      }
    }
  }, [dispatch, websocket])

  useEffect(() => {
    init()
  }, [init])
  useEffect(() => {
    if (theme) applyTheme()
  }, [theme, applyTheme])

  useEffect(() => {
    if (newViewFromContext) newViewInit()
  }, [newViewFromContext, newViewInit])

  useEffect(() => {
    if (newConfig !== undefined) changes()
  }, [newConfig, changes])

  useEffect(() => {
    if (wscActiveConfigSetter !== null) applyConfig(wscActiveConfigSetter)
  }, [wscActiveConfigSetter, applyConfig])

  useEffect(() => {
    if (wscActiveSetter !== null) activeConfig()
    return () => {
      dispatch(WSC_setActiveSetterOnly(null))
    }
  }, [wscActiveSetter, activeConfig, dispatch])

  useEffect(() => {
    defaultWorkspace()
    return () => {
      setTimeout(() => {
        setDefaultDone(true)
      }, 1000)
    }
  }, [defaultWorkspace, wsDefault, wsUserDefault])

  useEffect(() => {
    const current = workspace.current
    const wlu = workspace.current.addEventListener(
      "workspace-layout-update",
      async () => {
        if (
          workspace &&
          workspace.current !== null &&
          workspace.current !== undefined
        ) {
          const config = await workspace.current.save()
          dispatch(WSC_setCurrentConfig(config))
          setNewConfig(config)
        }
      }
    )
    const wnv = workspace.current.addEventListener(
      "workspace-new-view",
      async (e: any) => {
        setNewViewFromContext(e.detail)
      }
    )
    return () => {
      if (current) {
        removeEventListener("workspace-layout-update", current)
        removeEventListener("workspace-new-view", current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    workspace.current.style.height =
      "calc(100vh - " + (showMarquee ? "70" : "40") + "px)"
  }, [showMarquee])

  return (
    <>
      {workspace &&
        workspace.current &&
        workspace.current.children.length === 0 && <NonIdeal />}
      {workspace.current === null && <NonIdeal />}

      <perspective-workspace
        id="main-perspective"
        style={{
          backgroundColor: "transparent",
          zIndex: 1,
          position: "absolute"
        }}
        ref={workspace}
      />
    </>
  )
}

export default Perspective
