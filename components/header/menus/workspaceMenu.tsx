import {
  Button,
  Card,
  Code,
  H4,
  Icon,
  Menu,
  MenuDivider,
  Overlay,
  Position,
  Text,
  useHotkeys
} from "@blueprintjs/core"
import { MenuItem2, Popover2, Tooltip2 } from "@blueprintjs/popover2"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import {
  WSC_Active,
  WSC_Changes,
  WSC_CurrentConfig,
  WSC_setActive
} from "../../../redux/workspaceControlSlice"
import useSWRImmutable from "swr/immutable"
import { fetcher } from "../../layout"
import SaveWorkSpaceForm from "../forms/saveWorkspaceForm"
import { addToast } from "../../../pages/_app"
import {
  setWorkspaceOverlay,
  setWorkspacePublicOverlay
} from "../../../redux/overlaySlice"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { setOpenPopover } from "../../../redux/menuSlice"
import useSWR, { mutate } from "swr"
import WorkspaceSettings from "../forms/settingsWorkspaceForm"
import NonIdealMenuItem from "./nonIdealMenu"
import {
  omni,
  openWorkspace,
  saveWorkspace,
  saveWorkspaceAs,
  setOmni,
  setOpenWorkspace,
  setSaveWorkspace,
  setSaveWorkspaceAs
} from "../../../redux/settingsSlice"
import { empty } from "../../hotkeys"
import { Flex, Kbd } from "../../../stitches.config"

function WorkspaceMenu(props: any) {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const active = useAppSelector(WSC_Active)
  const current_config = useAppSelector(WSC_CurrentConfig)
  const [saveAs, setSaveAs] = useState<any>()
  const [workspaceOpen, setWorkspaceOpen] = useState<any>()
  const diff = useAppSelector(WSC_Changes)
  const currentConfig = useAppSelector(WSC_CurrentConfig)
  const omni_global = useAppSelector(omni)

  const ws_open = useAppSelector(openWorkspace)
  const ws_save = useAppSelector(saveWorkspace)
  const ws_save_as = useAppSelector(saveWorkspaceAs)

  const [openAlertUnsaved, setOpenAlertUnsaved] = useState<any>()
  const [preventiveActive, setPreventiveActive] = useState<any>()
  const popRef = useRef<any>()

  const save = useCallback(async () => {
    if (!active.id) {
      addToast({
        message: "No active Workspace to save",
        intent: "warning",
        icon: "warning-sign"
      })
      return
    }
    if (active.creator !== session?.user.id) {
      if (popRef.current.state.isOpen) {
        setSaveAs(true)
      } else {
        popRef.current.state.isOpen = true
        setSaveAs(true)
      }
      addToast({
        message: "You are unable so save someone elses workspace",
        intent: "warning",
        icon: "warning-sign"
      })
      return
    }

    if (
      current_config.viewers === undefined ||
      current_config.viewers === null ||
      Object.keys(current_config.viewers).length === 0
    ) {
      addToast({
        message: "Workspace is empty, nothing to save",
        intent: "warning",
        icon: "warning-sign"
      })
      return
    }
    const ws: any = window.document.querySelector("perspective-workspace")
    const haveNames: any = []
    ws?.shadowRoot
      ?.querySelectorAll(".p-TabBar-tab")
      .forEach((b: HTMLElement) => {
        const lab: any = b.querySelector(".p-TabBar-tabLabel")
        if (lab.getAttribute("value") !== "[untitled]") return
        const oldBG = b.style.background
        b.style.background = "#fbb360"
        const i1 = setInterval(() => {
          b.style.background = "unset"
          setTimeout(() => {
            b.style.background = "#fbb360"
          }, 350)
        }, 700)

        setTimeout(() => {
          clearInterval(i1)
          b.style.background = oldBG
        }, 2000)
        haveNames.push(false)
        return
      })

    if (haveNames.includes(false)) {
      addToast({
        message: "All views must have a name",
        intent: "warning",
        icon: "warning-sign"
      })
      return
    }

    await fetch(`/api/workspace/${active.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: active.id,
        creator: active.creator,
        data: {
          workspace: current_config
        }
      })
    })
      .then(async res => {
        const a = await res.json()
        if (res.status !== 200) {
          addToast({ message: "error: " + a.error, intent: "danger" })
        } else {
          mutate("/api/workspace/")
          addToast({
            message: "Saved workspace successfully",
            intent: "success",
            icon: "tick"
          })
        }
      })
      .catch((err: any) => {
        console.log("error saving workspace", err)
      })
  }, [active, current_config, session?.user.id])

  useEffect(() => {
    if (ws_open) {
      setWorkspaceOpen(true)

      popRef.current.state.isOpen = true
    }
    return () => {
      setTimeout(() => {
        dispatch(setOpenWorkspace(false))
        setWorkspaceOpen(false)
      }, 1000)
    }
  }, [dispatch, ws_open])

  useEffect(() => {
    if (ws_save) save()
    return () => {
      dispatch(setSaveWorkspace(false))
    }
  }, [dispatch, save, ws_save])

  useEffect(() => {
    if (ws_save_as) {
      if (
        currentConfig === null ||
        Object.keys(currentConfig.viewers).length === 0
      ) {
        addToast({
          message: "This workspace cannot be saved as",
          icon: "warning-sign",
          intent: "warning"
        })
        return
      }
      setSaveAs(true)
      popRef.current.state.isOpen = true
    }

    return () => {
      setTimeout(() => {
        dispatch(setSaveWorkspaceAs(false))
        setSaveAs(false)
      }, 1000)
    }
  }, [currentConfig, dispatch, ws_save_as])

  const { data: likedWorkspaces, error: lw_error } = useSWR(
    "/api/user/like/workspace",
    fetcher
  )
  const { data: workspaces, error: ws_error } = useSWR(
    "/api/workspace",
    fetcher
  )
  const { data: wsUserDefault, error: ud_error } = useSWRImmutable(
    "/api/user/default",
    fetcher
  )
  const renderOverlayChanges = () => {
    return (
      <Overlay transitionDuration={0} isOpen={openAlertUnsaved}>
        <Flex className="w-full h-screen justify-center items-center">
          <Card>
            <H4>You have unsaved changes</H4>
            <Flex style={{ gap: ".5em", marginTop: "1em" }}>
              <Button
                onClick={() => {
                  setOpenAlertUnsaved(false)
                }}
                text="Cancel"
              />
              <Button
                intent="warning"
                text="Discard changes and Load"
                onClick={() => {
                  dispatch(WSC_setActive(preventiveActive))
                  setOpenAlertUnsaved(false)
                }}
              />

              <Button
                onClick={() => {
                  if (active.creator !== session?.user.id) {
                    save()
                    setOpenAlertUnsaved(false)
                    return
                  }
                  dispatch(WSC_setActive(preventiveActive))
                  setOpenAlertUnsaved(false)
                }}
                intent="success"
                text="Save and Load"
              />
            </Flex>
          </Card>
        </Flex>
      </Overlay>
    )
  }
  return (
    <>
      {renderOverlayChanges()}
      <Popover2
        openOnTargetFocus={false}
        autoFocus={false}
        ref={popRef}
        minimal
        hoverCloseDelay={0}
        hoverOpenDelay={0}
        placement="bottom-start"
        interactionKind="hover"
        disabled={props.disabled}
        onOpened={() => dispatch(setOpenPopover(Date.now()))}
        content={
          <Menu>
            <MenuItem2
              popoverProps={{
                defaultIsOpen: workspaceOpen
              }}
              text="Open"
              title="open workspace"
              labelClassName="hasKBD"
              labelElement={<Kbd>Ctrl + Alt + O</Kbd>}
            >
              <MenuDivider className="hidden" />

              {workspaces &&
                workspaces.map((config: any) => {
                  return (
                    <Tooltip2
                      hoverOpenDelay={500}
                      minimal
                      key={config.id}
                      inheritDarkTheme
                      content={
                        <Flex style={{ flexDirection: "column", gap: ".5em" }}>
                          <Text>
                            {config.description ? (
                              <Text>config.description</Text>
                            ) : (
                              <Code>No description</Code>
                            )}
                          </Text>
                          <Text>
                            Private <Code>{config.private.toString()}</Code>
                          </Text>
                          <Text>
                            Views:{" "}
                            <Code>
                              {Object.keys(config.workspace.viewers).length}
                            </Code>
                          </Text>
                          <Text>
                            Date Created:{" "}
                            <Code>
                              {moment(config.createdAt).format("MMMM Do YYYY")}
                            </Code>
                          </Text>
                          <Text>
                            Last updated:{" "}
                            <Code>{moment(config.updatedAt).fromNow()}</Code>
                          </Text>
                          <Text>
                            Created by <Code>{config.user.name}</Code>
                          </Text>
                        </Flex>
                      }
                      position={Position.RIGHT}
                      openOnTargetFocus={false}
                    >
                      <MenuItem2
                        active={active.id === config.id}
                        labelElement={
                          config.creator === session?.user.id ? (
                            <Icon title="yours" icon="user" />
                          ) : (
                            <Text ellipsize={true}>
                              {config.user.name.charAt(0) +
                                config.user.name.charAt(
                                  config.user.name.length - 1
                                )}
                            </Text>
                          )
                        }
                        onClick={event => {
                          event.preventDefault()

                          setPreventiveActive(config)
                          if (config.id === active.id) {
                            // loading same config
                            if (diff?.length === 0) {
                              // 0 diff
                              addToast({
                                message: "Workspace already loaded",
                                intent: "warning",
                                icon: "warning-sign"
                              })
                              return
                            }
                          }
                          if (diff && diff?.length > 0) {
                            setOpenAlertUnsaved(true)
                            return
                          }
                          dispatch(WSC_setActive(config))
                        }}
                        text={config.name}
                        icon={
                          wsUserDefault === config.id
                            ? "bookmark"
                            : config.private
                            ? "eye-off"
                            : "eye-open"
                        }
                      />
                    </Tooltip2>
                  )
                })}
              {workspaces && workspaces.length === 0 && (
                <NonIdealMenuItem
                  text="No Workspaces"
                  url={process.env.NEXT_PUBLIC_DOCS_URL as string}
                  content="Open Docs"
                />
              )}
              <MenuDivider title="Liked Workspaces" />

              {likedWorkspaces &&
                likedWorkspaces.data.map((config: any) => {
                  return (
                    <Tooltip2
                      hoverOpenDelay={500}
                      minimal
                      key={config.id}
                      inheritDarkTheme
                      content={
                        <Flex style={{ flexDirection: "column", gap: ".5em" }}>
                          <Text>
                            {config.description ? (
                              <Text>config.description</Text>
                            ) : (
                              <Code>No description</Code>
                            )}
                          </Text>
                          <Text>
                            Private <Code>{config.private.toString()}</Code>
                          </Text>
                          <Text>
                            Views:{" "}
                            <Code>
                              {Object.keys(config.workspace.viewers).length}
                            </Code>
                          </Text>
                          <Text>
                            Date Created:{" "}
                            <Code>
                              {moment(config.createdAt).format("MMMM Do YYYY")}
                            </Code>
                          </Text>
                          <Text>
                            Last updated:{" "}
                            <Code>{moment(config.updatedAt).fromNow()}</Code>
                          </Text>
                          <Text>
                            Created by <Code>{config.user.name}</Code>
                          </Text>
                        </Flex>
                      }
                      position={Position.RIGHT}
                      openOnTargetFocus={false}
                    >
                      <MenuItem2
                        active={active.id === config.id}
                        labelElement={
                          config.creator === session?.user.id ? (
                            <Icon title="yours" icon="user" />
                          ) : (
                            <Text ellipsize={true}>
                              {config.user.name.charAt(0) +
                                config.user.name.charAt(
                                  config.user.name.length - 1
                                )}
                            </Text>
                          )
                        }
                        onClick={event => {
                          event.preventDefault()

                          setPreventiveActive(config)
                          if (config.id === active.id) {
                            // loading same config
                            if (diff?.length === 0) {
                              // 0 diff
                              addToast({
                                message: "Workspace already loaded",
                                intent: "warning",
                                icon: "warning-sign"
                              })
                              return
                            }
                          }
                          if (diff && diff?.length > 0) {
                            setOpenAlertUnsaved(true)
                            return
                          }
                          dispatch(WSC_setActive(config))
                        }}
                        text={config.name}
                        icon={
                          wsUserDefault === config.id
                            ? "bookmark"
                            : config.private
                            ? "eye-off"
                            : "eye-open"
                        }
                      />
                    </Tooltip2>
                  )
                })}
              {!likedWorkspaces ||
                (likedWorkspaces.data.length === 0 && (
                  <NonIdealMenuItem
                    text="No liked Workspaces"
                    url={process.env.NEXT_PUBLIC_DOCS_URL as string}
                    content="Open Docs"
                  />
                ))}
            </MenuItem2>
            <MenuItem2
              labelClassName="hasKBD"
              title={
                active && active.creator !== session?.user.id
                  ? "you cannot save someone elses worksapace"
                  : "save current workspace"
              }
              onClick={e => {
                e.preventDefault()
                save()
              }}
              disabled={active && active.creator !== session?.user.id}
              text="Save"
              labelElement={<Kbd>Ctrl + Alt + S</Kbd>}
            />

            <MenuItem2
              disabled={
                currentConfig === null ||
                Object.keys(currentConfig.viewers).length === 0
              }
              labelClassName="hasKBD"
              popoverProps={{
                defaultIsOpen: saveAs
              }}
              labelElement={<Kbd>Ctrl + Alt + Shift + S</Kbd>}
              title="save current workspace as new workspace"
              text="Save as"
            >
              <SaveWorkSpaceForm inputsActive={true} />
            </MenuItem2>
            {/* <MenuDivider title="Edit" /> */}

            <MenuItem2
              labelClassName="hasKBD"
              title="create new empty workspace"
              labelElement={<Kbd>Ctrl + Alt + N</Kbd>}
              onClick={event => {
                event.preventDefault()
                setPreventiveActive(empty)
                // if (active.id === undefined) {
                //   addToast({
                //     message: "so you already have an empty workspace, chill",
                //     intent: "warning",
                //   })
                //   return
                // }
                if (diff && diff?.length > 2) {
                  setOpenAlertUnsaved(true)
                  return
                }
                dispatch(WSC_setActive(empty))
              }}
              text="New empty"
            />
            <MenuDivider title="Current workspace" />
            <MenuItem2
              disabled={active.creator !== session?.user.id}
              // icon="wrench"
              labelClassName="hasKBD"
              title="current workspace settings"
              text="Settings"
            >
              <WorkspaceSettings />
            </MenuItem2>

            <MenuDivider />
            <MenuItem2
              title="open sidebar to manage workspaces"
              // intent="warning"
              text="Manage"
              labelElement={<Icon icon="filter-list" />}
              onClick={() => dispatch(setWorkspaceOverlay(true))}
            />
            <MenuItem2
              title="open sidebar to manage public workspaces"
              // intent="warning"
              text="Discover"
              labelElement={<Icon icon="search" />}
              onClick={() => dispatch(setWorkspacePublicOverlay(true))}
            />
          </Menu>
        }
      >
        <Button
          autoFocus={false}
          rightIcon={<Icon icon="modal" />}
          title="Workspace menu, save, load and manage workspaces"
          disabled={props.disabled}
          text="Workspace"
        />
      </Popover2>
    </>
  )
}
export default WorkspaceMenu
