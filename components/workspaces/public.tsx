import {
  Button,
  ButtonGroup,
  H5,
  Icon,
  NonIdealState,
  Tag,
  Text,
  H6,
  Menu,
  OverflowList,
  InputGroup,
  Spinner
} from "@blueprintjs/core"
import useSWR, { mutate } from "swr"
import { useSession } from "next-auth/react"
import moment from "moment"
import { addToast } from "../../pages/_app"
import { fetcher } from "../layout"
import { useTheme } from "next-themes"
import { WSC_setActive } from "../../redux/workspaceControlSlice"
import { useAppDispatch } from "../../redux/hooks"
import { MenuItem2, Popover2, Tooltip2 } from "@blueprintjs/popover2"
import { useState, useEffect, useMemo } from "react"
import { Flex } from "../../stitches.config"

function PublicWorkspaces(props: any) {
  const dispatch = useAppDispatch()
  const [query, setQuery] = useState<string>("")
  const { data: session, status } = useSession()
  const { data: linkedWorkspaces, error: lw_errir } = useSWR(
    "/api/user/like/workspace",
    fetcher
  )
  const { data: wsUserDefault, error: ud_error } = useSWR(
    "/api/user/default",
    fetcher
  )
  const { data: workspaces, error: ws_error } = useSWR(
    "/api/workspace/public?query=" + query,
    fetcher
  )
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setQuery(props.query)
  }, [props.query])

  const mappedLikes: any = useMemo(() => {
    if (linkedWorkspaces === undefined) return
    return linkedWorkspaces.data.map((e: any) => e.id)
  }, [linkedWorkspaces])

  if (!workspaces || !linkedWorkspaces) return <div>Loading...</div>
  if (ws_error) return <div>Error: {ws_error.message}</div>

  async function deleteWs(workspace: any) {
    if (session && workspace.creator !== session?.user.id) {
      addToast({
        message: "You can't delete a workspace that isn't yours",
        intent: "danger"
      })
      return null
    }
    await fetch(`/api/workspace/${workspace.id}`, {
      method: "DELETE"
    })
      .then(e => {
        mutate("/api/workspace/public?query=" + query)
        addToast({ message: "Workspace deleted", intent: "success" })
      })
      .catch(e => {
        console.log(e)
      })
  }
  async function togglePrivate(workspace: any) {
    if (session && workspace.creator !== session?.user.id) {
      return null
    }
    // pass state to request
    await fetch(`/api/workspace/${workspace.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: workspace.id,
        data: {
          private: !workspace.private
        }
      })
    })
      .then(async (res: any) => {
        mutate("/api/workspace/public?query=" + query)
        // addToast({ message: "Watchlist updated", intent: "success" })
      })
      .catch(err => {
        console.log(err)
      })
  }
  async function makeDefault(workspace: any, isSame: boolean) {
    await fetch(`/api/user/default`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        isSame: isSame,
        id: workspace.id
      })
    })
      .then((res: any) => {
        mutate("/api/user/default")
      })
      .catch(err => {
        console.log(err)
      })
  }
  async function toggleGlobalDefault(workspace: any) {
    if (session?.user.isAdmin) {
      await fetch(`/api/workspace/${workspace.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: workspace.id,
          creator: session.user.id,
          data: {
            globalDefault: !workspace.globalDefault
          }
        })
      })
        .then(async (res: any) => {
          mutate("/api/workspace/public?query=" + query)
          // addToast({ message: "Workspace updated", intent: "success", icon: "tick" })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  function viewTagRenderer(name: string) {
    if (!name) return "n/a"
    if (name.includes("(duplicate)")) {
      return name.replace("(duplicate)", "")
    } else {
      return name
    }
  }
  function filterPopupRender(view: any, workspace: any) {
    let tags: any = []
    view.filter.forEach(function(filter: any, index: any) {
      if (filter[0] === "date") {
        let popped = filter.slice(0, filter.length - 1)
        let date = new Date(filter[2])
        if (workspace.relative_date !== null) return
        tags.push(
          <Tag intent="warning" key={index}>
            {popped.join(" ")} {moment(date).format("MMMM Do YYYY")}
          </Tag>
        )
      } else if (filter[2] !== null) {
        tags.push(
          <Tag intent="primary" key={index}>
            {filter.join(" ")}
          </Tag>
        )
      }
    })
    return tags
  }
  async function addWorkspace(workspace: any, isLinked: boolean) {
    await fetch("/api/user/like/workspace", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: workspace.id,
        isLinked: isLinked
      })
    }).then(e => {
      mutate("/api/user/like/workspace")
    })
  }

  function overflowOF(list: any, workspace: any) {
    return (
      <Popover2
        interactionKind="hover"
        hoverCloseDelay={0}
        hoverOpenDelay={0}
        minimal
        content={
          <Flex className="gap-3 max-w-[250px] flex-wrap">
            {list.map((e: any, i: any) => {
              return (
                <div className="p-3" key={i}>
                  <Flex style={{ gap: ".2em" }}>
                    <H6>Type:</H6>
                    {e.plugin}
                  </Flex>
                  <H6>Filters:</H6>
                  <Flex
                    style={{
                      flexDirection: "column",
                      gap: ".5em",
                      justifyContent: "center"
                    }}
                  >
                    {filterPopupRender(e, workspace)}
                  </Flex>
                </div>
              )
            })}
          </Flex>
        }
      >
        <Button minimal small icon="more" />
      </Popover2>
    )
  }
  function overflowTag(view: any, index: any, workspace: any) {
    return (
      <Tooltip2
        minimal
        key={index}
        position="top"
        content={
          <>
            <Flex style={{ gap: ".2em" }}>
              <H6>Type:</H6>
              {view.plugin}
            </Flex>
            <H6>Filters:</H6>
            <Flex
              style={{
                flexDirection: "column",
                gap: ".5em",
                justifyContent: "center"
              }}
            >
              {filterPopupRender(view, workspace)}
            </Flex>
          </>
        }
      >
        <Tag minimal style={{ cursor: "help" }}>
          {viewTagRenderer(view.name)}
        </Tag>
      </Tooltip2>
    )
  }
  return (
    <>
      {workspaces && workspaces.length !== 0 && (
        <>
          {workspaces.map((workspace: any) => (
            <Flex
              style={{ background: "var(--colors-bg3)" }}
              className="justify-between gap-3 items-center h-[48px] border-black border-b-2 border-opacity-20 mx-1"
              key={workspace.id}
            >
              <div className="ml-3 list-none">
                <MenuItem2
                  className="w-full h-8"
                  onClick={event => {
                    event.preventDefault()
                    dispatch(WSC_setActive(workspace))
                  }}
                  text={
                    <Flex className="items-center gap-2 grow">
                      {workspace.globalDefault && (
                        <div>
                          <Tooltip2
                            minimal
                            position="top"
                            content="this is a global view"
                          >
                            <Icon icon="globe" />
                          </Tooltip2>
                        </div>
                      )}
                      {workspace.watchlist && (
                        <div>
                          <Tooltip2
                            minimal
                            position="top"
                            content="this view can be used for watchlists"
                          >
                            <Icon icon="geosearch" />
                          </Tooltip2>
                        </div>
                      )}
                      <div>
                        <Tooltip2
                          minimal
                          position="top"
                          content={
                            <Text>
                              {workspace.description && (
                                <Text>{workspace.description}</Text>
                              )}
                              Date Created:{" "}
                              {moment(workspace.createdAt).format(
                                "MMMM Do YYYY"
                              )}
                              <br />
                              Last updated:{" "}
                              {moment(workspace.updatedAt).fromNow()}
                              <br />
                              {workspace.relative_date && (
                                <div>
                                  Relative Date: {workspace.relative_date}
                                </div>
                              )}
                            </Text>
                          }
                        >
                          <H5
                            style={{
                              margin: 0,
                              lineHeight: "1em",
                              cursor: "help"
                            }}
                          >
                            {workspace.name}
                          </H5>
                        </Tooltip2>
                      </div>
                    </Flex>
                  }
                />
              </div>
              <div className="w-[50%]">
                <div>
                  <OverflowList
                    className="gap-1"
                    collapseFrom="end"
                    items={[
                      ...Object.keys(workspace.workspace.viewers).map(
                        e => workspace.workspace.viewers[e]
                      )
                    ]}
                    visibleItemRenderer={(item, index) =>
                      overflowTag(item, index, workspace)
                    }
                    overflowRenderer={(overflowItems: any) =>
                      overflowOF(overflowItems, workspace)
                    }
                  />
                </div>
              </div>

              <div className="flex grow justify-end mr-3">
                <ButtonGroup minimal className="gap-1">
                  <Tooltip2
                    position="bottom"
                    minimal
                    content={
                      mappedLikes.includes(workspace.id)
                        ? "remove this from my workspaces"
                        : "add this to my workspaces"
                    }
                  >
                    <Button
                      intent={
                        mappedLikes.includes(workspace.id)
                          ? "danger"
                          : "success"
                      }
                      icon={
                        mappedLikes.includes(workspace.id) ? "cross" : "plus"
                      }
                      onClick={() =>
                        addWorkspace(
                          workspace,
                          mappedLikes.includes(workspace.id)
                        )
                      }
                    />
                  </Tooltip2>

                  {workspace.creator === session?.user.id && (
                    <Tooltip2
                      position="bottom"
                      minimal
                      content={
                        workspace.private ? "Make Public" : "Make Private"
                      }
                    >
                      <Button
                        icon={workspace.private ? "eye-off" : "eye-on"}
                        onClick={() => togglePrivate(workspace)}
                      />
                    </Tooltip2>
                  )}
                  <Tooltip2
                    position="bottom"
                    minimal
                    content={
                      wsUserDefault.id === workspace.id
                        ? "This is your default"
                        : "Make this my default"
                    }
                  >
                    <Button
                      icon="bookmark"
                      intent={
                        wsUserDefault.id === workspace.id ? "success" : "none"
                      }
                      onClick={() =>
                        makeDefault(
                          workspace,
                          wsUserDefault.id === workspace.id
                        )
                      }
                    />
                  </Tooltip2>

                  {session && session.user.isAdmin && (
                    <Tooltip2
                      position="bottom"
                      minimal
                      content={
                        workspace.globalDefault
                          ? "This is a global Default"
                          : "Make this a global default"
                      }
                    >
                      <Button
                        icon={workspace.globalDefault ? "globe" : "inbox-geo"}
                        onClick={() => toggleGlobalDefault(workspace)}
                      ></Button>
                    </Tooltip2>
                  )}
                  {workspace.creator === session?.user.id && (
                    <Popover2
                      minimal
                      content={
                        <div className="p-3 ">
                          <H5>Confirm deletion</H5>
                          <p>Are you sure you want to delete these items?</p>
                          <div className="flex justify-end pt-4">
                            <Button
                              onClick={e => {
                                deleteWs(workspace)
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
                  <Button
                    title="copy workspace link to clipboard"
                    icon={"share"}
                    onClick={e => {
                      e.preventDefault()
                      addToast({
                        message: "copied workpspace link to clipboard",
                        icon: "clipboard"
                      })
                      navigator.clipboard.writeText(
                        `${process.env
                          .NEXT_PUBLIC_APP_URL as string}?workspace=${
                          workspace.id
                        }`
                      )
                    }}
                  />
                </ButtonGroup>
              </div>
            </Flex>
          ))}
        </>
      )}
      {workspaces && workspaces.length === 0 && (
        <Flex className="h-full">
          <NonIdealState
            icon={"modal"}
            title={"No workspaces found"}
            layout={"vertical"}
          />
        </Flex>
      )}
    </>
  )
}

export default PublicWorkspaces
