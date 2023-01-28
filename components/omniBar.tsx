import { Icon } from "@blueprintjs/core"
import { MenuItem2 } from "@blueprintjs/popover2"
import { ItemPredicate, ItemRenderer, Omnibar } from "@blueprintjs/select"
import { useState } from "react"
import useSWR from "swr"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { omni, setOmni } from "../redux/settingsSlice"
import { WSC_setActive } from "../redux/workspaceControlSlice"
import NonIdealMenuItem from "./header/menus/nonIdealMenu"
import { fetcher } from "./layout"
import LoadingComp from "./loading"
import { compile } from "mathjs"
const re = /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/

function OmniBar() {
  const dispatch = useAppDispatch()
  const omni_global = useAppSelector(omni)
  const [input, setInput] = useState<any>()
  const { data: workspaces, error: ws_error } = useSWR(
    "/api/workspace",
    fetcher
  )
  const { data: watchlists, error: wl_error } = useSWR(
    "/api/watchlist",
    fetcher
  )
  function loadWorkspace(item: any) {
    if (item.companies !== undefined) return
    dispatch(setOmni(false))
    dispatch(WSC_setActive(item))
  }

  function checkIfMath(i: string) {
    return re.test(i)
  }
  function noResult() {
    if (checkIfMath(input)) {
      const result = compile(input)
      return (
        <MenuItem2
          roleStructure="listoption"
          disabled
          text={result.evaluate() + ""}
          labelElement={<Icon icon="cross" />}
        />
      )
    } else {
      return (
        <MenuItem2
          roleStructure="listoption"
          disabled
          text={`No result for ${input}`}
          labelElement={<Icon icon="cross" />}
        />
      )
    }
  }
  function renderViews(wl_item: any, handleClick: any) {
    const item: any = []
    workspaces.map((ws_item: any, index: any) => {
      if (ws_item.watchlist) {
        item.push(
          <MenuItem2
            key={index}
            onClick={() => {
              loadFromWatchlist(ws_item, wl_item)
              dispatch(setOmni(false))
            }}
            icon={
              ws_item.global_default
                ? "globe"
                : ws_item.private
                ? "eye-off"
                : "eye-open"
            }
            text={ws_item.name}
          />
        )
      }
    })
    if (item.length > 0) {
      return item
    } else {
      return (
        <NonIdealMenuItem
          text="No watchlist-views"
          content="Read about watchlistviews"
          url={process.env.NEXT_PUBLIC_DOCS_URL as string}
        />
      )
      // return <MenuItem2 key={1} disabled text="No watchlists views" />
    }
  }
  const omniItemRendere: ItemRenderer<any> = (
    item,
    { modifiers, handleClick }: any
  ) => {
    return (
      <MenuItem2
        active={modifiers.active}
        key={item.id}
        // children={(item.companies !== undefined)
        // ? renderViews(item, handleClick)
        // : null
        // }
        onClick={item.companies !== undefined ? null : handleClick}
        text={item.name}
        labelElement={
          <Icon
            icon={item.companies !== undefined ? "geosearch" : "grid-view"}
          />
        }
      />
    )
  }
  const filterOmni: ItemPredicate<any> = (query, item, _index, exactMatch) => {
    // const normalizedTitle = item.ticker.toLowerCase()
    const normalizedName = item.name.toLowerCase()
    const normalizedQuery = query.toLowerCase()
    if (exactMatch) {
      return normalizedName === normalizedQuery
    } else if (
      normalizedName.slice(0, normalizedQuery.length) === normalizedQuery
    ) {
      return true
    } else if (
      normalizedQuery.length > 2 &&
      normalizedName.includes(normalizedQuery)
    ) {
      return true
    } else {
      return false
    }
  }
  function chunkArrayInGroups(arr: string | any[], size: number) {
    if (arr === undefined) return
    var myArray = []
    for (var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i + size))
    }
    return myArray
  }
  function loadFromWatchlist(view: any, watchlist: any) {
    const tickers = watchlist.companies.map((c: any) => c.ticker)
    let computedView = { ...view }
    const views = view.workspace.viewers[Object.keys(view.workspace.viewers)[0]]

    let createdViews: any = {}
    for (let index = 0; index < watchlist.companies.length; index++) {
      const newView = { ...views }
      newView.filter = [["ticker", "==", watchlist.companies[index].ticker]]
      newView.name = "generated view " + watchlist.companies[index].ticker
      createdViews[
        "PERSPECTIVE_GENEREATED_ID_" + watchlist.companies[index].ticker
      ] = newView
    }

    let config4views: any = []
    for (let index = 0; index < watchlist.companies.length; index++) {
      config4views.push({
        type: "tab-area",
        widgets: [
          "PERSPECTIVE_GENEREATED_ID_" + watchlist.companies[index].ticker,
        ],
        currentIndex: 0,
      })
    }

    const tempTicks = tickers
    const splitsTickers = chunkArrayInGroups(tempTicks, 4)
    const splitConfig4views = chunkArrayInGroups(config4views, 4)
    let createdConfig: any
    let config: any
    let newLayout
    let newView
    if (splitsTickers && splitsTickers.length > 1) {
      const children2add: any = []
      if (splitConfig4views === undefined) return
      for (let index = 0; index < splitConfig4views.length; index++) {
        const tickerConfigs = splitConfig4views[index]
        const tickers = splitsTickers[index]
        children2add.push({
          type: "split-area",
          sizes: Array.apply(null, Array(tickers.length)).map(function (x, i) {
            return 1 / tickers.length
          }),
          children: tickerConfigs,
          orientation: "horizontal",
        })
      }
      createdConfig = {
        detail: {
          main: {
            type: "split-area",
            sizes: Array.apply(null, Array(splitsTickers.length)).map(function (
              x,
              i
            ) {
              return 1 / splitsTickers.length
            }),
            children: children2add,
            orientation: "vertical",
          },
        },
      }
    } else {
      createdConfig = {
        mode: "globalFilters",
        sizes: [1],
        detail: {
          main: {
            type: "split-area",
            sizes: Array.apply(null, Array(tickers.length)).map(function (
              x,
              i
            ) {
              return 1 / tickers.length
            }),
            children: config4views,
            orientation: "horizontal",
          },
        },
      }
    }
    createdConfig.viewers = createdViews
    computedView.workspace = createdConfig
    dispatch(WSC_setActive(computedView))
  }
  if (!watchlists) return <LoadingComp />
  if (!workspaces) return <LoadingComp />
  return (
    <Omnibar
      overlayProps={{
        className: `flex justify-center items-center ${
          omni_global ? "visible" : "hidden"
        } ${omni_global ? "h-screen" : "h-0"}`,
      }}
      inputProps={{
        value: input,
        onKeyUp: (e: any) => setInput(e.target.value),
        onKeyDown: (e: any) => {
          if (e.altKey && e.ctrlKey && e.key === " ") dispatch(setOmni(false))
        },
        className: "opacity-100 bg-[var(--colors-bg2)]",
      }}
      onItemSelect={(item, event: any) => {
        if (
          (event.type === "keyup" && item.companies !== undefined) ||
          item.companies !== undefined
        )
          return
        dispatch(WSC_setActive(item))
        dispatch(setOmni(false))
      }}
      className="h-[200px]"
      onClose={() => dispatch(setOmni(!omni_global))}
      isOpen={omni_global || false}
      items={[...workspaces, ...watchlists]}
      itemRenderer={omniItemRendere}
      itemPredicate={filterOmni}
      noResults={noResult()}
      initialContent={
        <MenuItem2 disabled text="Search for workspaces &amp; watchlists " />
      }
    />
  )
}

export default OmniBar
