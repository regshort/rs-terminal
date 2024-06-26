import { fetcher } from "../layout"
import {
  Button,
  ButtonGroup,
  Icon,
  NonIdealState,
  Tag,
  H5,
  OverflowList
} from "@blueprintjs/core"
import useSWR, { mutate } from "swr"
import { useSession } from "next-auth/react"
import { Popover2, Tooltip2 } from "@blueprintjs/popover2"
import moment from "moment"
import { addToast } from "../../pages/_app"
import { useEffect, useState } from "react"
import ImageWithFallback from "../imageWithFallback"
import { Flex } from "../../stitches.config"

function Watchlists(props: any) {
  const [query, setQuery] = useState<string>("")
  const { data: session, status } = useSession()
  const { data: watchlists, error: wl_error } = useSWR(
    "/api/watchlist?query=" + query,
    fetcher
  )
  useEffect(() => {
    setQuery(props.query)
  }, [props.query])
  if (wl_error) return <div>Error: {wl_error.message}</div>

  async function deleteWs(watchlist: any) {
    if (session && watchlist.creator !== session.user.id) {
      addToast({
        message: "You can't delete a watchlist that isn't yours",
        intent: "danger"
      })
      return null
    }
    await fetch(`/api/watchlist/${watchlist.id}`, {
      method: "DELETE"
    })
      .then(e => {
        mutate("/api/watchlist?query=" + query)
        // addToast({ message: "Watchlist deleted", intent: "success", icon: "tick" })
      })
      .catch(e => console.log(e))
  }
  async function togglePrivate(watchlist: any) {
    if (session && watchlist.creator !== session.user.id) {
      return null
    }
    await fetch(`/api/watchlist/${watchlist.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: watchlist.id,
        data: {
          private: !watchlist.private
        }
      })
    })
      .then(async (res: any) => {
        mutate("/api/watchlist?query=" + query)
        // addToast({ message: "Watchlist updated", intent: "success", icon: "tick" })
      })
      .catch(err => console.log(err))
  }

  async function toggleGlobalDefault(watchlist: any) {
    if (session?.user.isAdmin) {
      const res = await fetch(`/api/watchlist/${watchlist.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: watchlist.id,
          creator: watchlist.creator,
          data: {
            globalDefault: !watchlist.globalDefault
          }
        })
      })
        .then(async (res: any) => {
          const ress = await res.json()
          const newData = watchlists.map((ws: { id: string }) =>
            ws.id === watchlist.id
              ? { ...ws, globalDefault: !watchlist.globalDefault }
              : ws
          )
          mutate("/api/watchlist?query=" + query)
          // addToast({ message: "Watchlist updated", intent: "success" })
        })
        .catch(err => console.log(err))
    }
  }
  function visibleItem(item: any, index: any) {
    return (
      <Flex key={index} className="mr-1">
        <div>
          <ImageWithFallback
            alt={item.ticker}
            hasImage={item.hasImg}
            inwatchlist={true}
          />
        </div>
        <div>
          <Tag minimal title={item.name}>
            {item.ticker}
          </Tag>
        </div>
      </Flex>
    )
  }
  function overflowList(e: any) {
    return (
      <Popover2
        minimal
        position="bottom"
        interactionKind="hover"
        hoverCloseDelay={0}
        hoverOpenDelay={0}
        content={
          <Flex className="p-3">
            {e.map((e: any, i: any) => {
              return visibleItem(e, i)
            })}
          </Flex>
        }
      >
        <Button minimal small icon="more" />
      </Popover2>
    )
  }
  return (
    <>
      {watchlists &&
        watchlists.map((watchlist: any, index: any) => (
          <div
            key={index}
            style={{ background: "var(--colors-bg3)" }}
            className="watchlist p-2 border-black border-b-2 border-opacity-20 mx-1"
          >
            <Flex className="gap-5 items-center" key={watchlist.id}>
              <div className="ml-3">
                {/* {watchlist.globalDefault && (
                  <Tooltip2
                    minimal
                    position="top"
                    content="This is a global view"
                  >
                    <Icon icon="globe" />
                  </Tooltip2>
                )} */}
                <Tooltip2
                  minimal
                  position="top"
                  content={
                    <span>
                      Date Created:{" "}
                      {moment(watchlist.createdAt).format("MMMM Do YYYY")}
                      <br />
                      Last updated: {moment(watchlist.updatedAt).fromNow()}
                    </span>
                  }
                >
                  <H5 style={{ margin: 0, lineHeight: "1em", cursor: "help" }}>
                    {watchlist.name}
                  </H5>
                </Tooltip2>
              </div>
              <div className="w-[50%] justify-start">
                <div>
                  <OverflowList
                    className="w-full"
                    collapseFrom="end"
                    items={watchlist.companies}
                    overflowRenderer={overflowList}
                    visibleItemRenderer={visibleItem}
                  />
                </div>
              </div>
              <Flex className="grow justify-end">
                <ButtonGroup minimal>
                  {watchlist.creator === session?.user.id && (
                    <Tooltip2
                      position="bottom"
                      minimal
                      content={
                        watchlist.private ? "Make Public" : "Make Private"
                      }
                    >
                      <Button
                        icon={watchlist.private ? "eye-off" : "eye-on"}
                        onClick={() => togglePrivate(watchlist)}
                      />
                    </Tooltip2>
                  )}
                  {/* {session && session.user.isAdmin && (
                    <Tooltip2
                      position="bottom"
                      minimal
                      content={
                        watchlist.globalDefault
                          ? "This is a global Default"
                          : "Make this a global default"
                      }
                    >
                      <Button
                        icon={watchlist.globalDefault ? "circle" : "globe"}
                        onClick={() => toggleGlobalDefault(watchlist)}
                      />
                    </Tooltip2>
                  )} */}
                  {watchlist.creator === session?.user.id && (
                    <Popover2
                      minimal
                      content={
                        <div className="p-3 ">
                          <H5>Confirm deletion</H5>
                          <p>Are you sure you want to delete these items?</p>
                          <div className="flex justify-end pt-4">
                            <Button
                              onClick={e => {
                                deleteWs(watchlist)
                              }}
                              intent={"danger"}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <Button
                        title="delete watchlist"
                        intent="danger"
                        icon="cross"
                      />
                    </Popover2>
                  )}
                </ButtonGroup>
              </Flex>
            </Flex>
          </div>
        ))}
      {watchlists && watchlists.length === 0 && (
        <Flex className="h-full">
          <NonIdealState
            icon={"geosearch"}
            title={"No watchlists found"}
            layout={"vertical"}
          />
        </Flex>
      )}
    </>
  )
}

export default Watchlists
