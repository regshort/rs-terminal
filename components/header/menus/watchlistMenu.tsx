import {
  Button,
  FormGroup,
  Icon,
  Menu,
  MenuDivider,
  Text
} from "@blueprintjs/core"
import { MenuItem2, Popover2 } from "@blueprintjs/popover2"
import { useSession } from "next-auth/react"
import useSWR from "swr"
import { useAppDispatch } from "../../../redux/hooks"
import { setOpenPopover } from "../../../redux/menuSlice"
import {
  setWatchlistOverlay,
  setWatchlistPublicOverlay
} from "../../../redux/overlaySlice"
import { WSC_setActive } from "../../../redux/workspaceControlSlice"
import { fetcher } from "../../layout"
import SaveWatchlistForm from "../forms/saveWatchlistForm"
import NonIdealMenuItem from "./nonIdealMenu"
import MultiSelectCompanyWatchlist from "./securityFilter/multiSelectCompanyWatchlist"
import { Flex } from "../../../stitches.config"

function WatchlistDropDown(props: { disabled: boolean | undefined }) {
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const { data: linkedWatchlists, error: lw_errir } = useSWR(
    "/api/user/like/watchlist",
    fetcher
  )
  const { data: workspaces, error: ws_error } = useSWR(
    "/api/workspace",
    fetcher
  )
  const { data: watchlist, error: wl_error } = useSWR("/api/watchlist", fetcher)

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
          "PERSPECTIVE_GENEREATED_ID_" + watchlist.companies[index].ticker
        ],
        currentIndex: 0
      })
    }

    const tempTicks = tickers
    const splitsTickers = chunkArrayInGroups(tempTicks, 4)
    const splitConfig4views = chunkArrayInGroups(config4views, 4)
    let createdConfig: any
    if (splitsTickers && splitsTickers.length > 1) {
      const children2add: any = []
      if (splitConfig4views === undefined) return
      for (let index = 0; index < splitConfig4views.length; index++) {
        const tickerConfigs = splitConfig4views[index]
        const tickers = splitsTickers[index]
        children2add.push({
          type: "split-area",
          sizes: Array.apply(null, Array(tickers.length)).map(function(x, i) {
            return 1 / tickers.length
          }),
          children: tickerConfigs,
          orientation: "horizontal"
        })
      }
      createdConfig = {
        detail: {
          main: {
            type: "split-area",
            sizes: Array.apply(null, Array(splitsTickers.length)).map(function(
              x,
              i
            ) {
              return 1 / splitsTickers.length
            }),
            children: children2add,
            orientation: "vertical"
          }
        }
      }
    } else {
      createdConfig = {
        mode: "globalFilters",
        sizes: [1],
        detail: {
          main: {
            type: "split-area",
            sizes: Array.apply(null, Array(tickers.length)).map(function(x, i) {
              return 1 / tickers.length
            }),
            children: config4views,
            orientation: "horizontal"
          }
        }
      }
    }
    createdConfig.viewers = createdViews
    computedView.workspace = createdConfig
    dispatch(WSC_setActive(computedView))
  }

  function renderViews(wl_item: any) {
    const item: any = []
    workspaces.map((ws_item: any, index: any) => {
      if (ws_item.watchlist) {
        item.push(
          <MenuItem2
            key={index}
            onClick={() => loadFromWatchlist(ws_item, wl_item)}
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
    if (item.length > 0) return item
    return (
      <NonIdealMenuItem
        text="No watchlist-views"
        content="Read about watchlistviews"
        url={process.env.NEXT_PUBLIC_DOCS_URL as string}
      />
    )
  }
  if (!linkedWatchlists)
    return (
      <Button
        disabled
        rightIcon={<Icon icon="geosearch" />}
        title="Watchlist menu, create, load and manage watchlists here"
        text="Watchlist"
      />
    )
  return (
    <Popover2
      minimal
      openOnTargetFocus={false}
      hoverCloseDelay={0}
      hoverOpenDelay={0}
      modifiers={{ arrow: { enabled: false } }}
      canEscapeKeyClose={true}
      placement="bottom-start"
      interactionKind="hover"
      disabled={props.disabled}
      onOpened={() => dispatch(setOpenPopover(Date.now()))}
      content={
        <Menu>
          <MenuItem2 text="Open">
            {watchlist !== undefined &&
              watchlist.map((wl_item: any, index: any) => {
                const tags = chunkArrayInGroups(wl_item.companies, 4)
                return (
                  <MenuItem2
                    key={index}
                    text={wl_item.name}
                    labelElement={
                      wl_item.creator === session?.user.id ? (
                        <Icon icon="user" />
                      ) : (
                        <Text ellipsize={true}>
                          {wl_item.user.name.charAt(0) +
                            wl_item.user.name.charAt(
                              wl_item.user.name.length - 1
                            )}
                        </Text>
                      )
                    }
                  >
                    {tags && wl_item.creator === session?.user.id && (
                      <Flex className="p-1 w-[270px]">
                        <FormGroup
                          label="Securities"
                          labelFor="text-input"
                          helperText="(add/remove securities to update watchlist)"
                        >
                          <MultiSelectCompanyWatchlist
                            selectedItems={wl_item.companies}
                            watchlist={wl_item}
                          />
                        </FormGroup>
                      </Flex>
                    )}
                    <MenuDivider title="Open with:" />
                    {workspaces && renderViews(wl_item)}
                  </MenuItem2>
                )
              })}

            {watchlist === undefined ||
              (watchlist.length === 0 && (
                <NonIdealMenuItem
                  text="No Watchlists"
                  url={process.env.NEXT_PUBLIC_DOCS_URL as string}
                  content="Open Docs"
                />
              ))}
            <MenuDivider title={"Liked Watchlist"} />

            {linkedWatchlists &&
              linkedWatchlists.data.length > 0 &&
              linkedWatchlists.data.map((wl_item: any, index: any) => {
                const tags = chunkArrayInGroups(wl_item.companies, 4)
                return (
                  <MenuItem2
                    key={index}
                    text={wl_item.name}
                    labelElement={
                      wl_item.creator === session?.user.id ? (
                        <Icon icon="user" />
                      ) : (
                        <Text ellipsize={true}>
                          {wl_item.user.name.charAt(0) +
                            wl_item.user.name.charAt(
                              wl_item.user.name.length - 1
                            )}
                        </Text>
                      )
                    }
                  >
                    {tags && wl_item.creator === session?.user.id && (
                      <Flex className="p-1 w-[270px]">
                        <FormGroup
                          label="Securities"
                          labelFor="text-input"
                          helperText="(add/remove securities to update watchlist)"
                        >
                          <MultiSelectCompanyWatchlist
                            selectedItems={wl_item.companies}
                            watchlist={wl_item}
                          />
                        </FormGroup>
                      </Flex>
                    )}
                    <MenuDivider title="Open with:" />
                    {workspaces && renderViews(wl_item)}
                  </MenuItem2>
                )
              })}
            {linkedWatchlists.data.length === 0 && (
              <NonIdealMenuItem
                text="No Liked Watchlists"
                url={process.env.NEXT_PUBLIC_DOCS_URL as string}
                content="Open Docs"
              />
            )}
          </MenuItem2>

          <MenuItem2
            shouldDismissPopover={false}
            text="Create new"
            title="create new watchlist"
          >
            <SaveWatchlistForm />
          </MenuItem2>
          <MenuDivider className="" />
          <MenuItem2
            title="manage watchlists"
            // intent="warning"
            text="Manage"
            labelElement={<Icon icon="filter-list" />}
            onClick={() => dispatch(setWatchlistOverlay(true))}
          />

          {/* <MenuDivider title="Edit" /> */}
          <MenuItem2
            title="open sidebar to manage public watchlists"
            // intent="warning"
            text="Discover"
            labelElement={<Icon icon="search" />}
            onClick={() => dispatch(setWatchlistPublicOverlay(true))}
          />
        </Menu>
      }
    >
      <Button
        rightIcon={<Icon icon="geosearch" />}
        title="Watchlist menu, create, load and manage watchlists here"
        disabled={props.disabled}
        text="Watchlist"
      />
    </Popover2>
  )
}
export default WatchlistDropDown
