import { signOut, useSession } from "next-auth/react"
import { MenuItem2, Popover2 } from "@blueprintjs/popover2"
import { Button, Icon, Menu, MenuDivider, Tag, Text } from "@blueprintjs/core"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import Link from "next/link"
import { setOpenPopover } from "../../../redux/menuSlice"
import dynamic from "next/dynamic"
import SettingsMenu from "./settingsMenu"
import {
  appStatus,
  appVersion,
  userAgent,
  wsStatus
} from "../../../redux/settingsSlice"
const Logos = dynamic(() => import("../../logo"), { ssr: false })
const LogoMini = dynamic(() => import("../../logo-mini"), { ssr: false })

export const AppDropDown = () => {
  const dispatch = useAppDispatch()
  const app_version = useAppSelector(appVersion)
  const { data: session } = useSession()
  const user_agent = useAppSelector(userAgent)
  const ws_status = useAppSelector(wsStatus)
  const app_status = useAppSelector(appStatus)

  return (
    <Popover2
      openOnTargetFocus={false}
      autoFocus={false}
      minimal
      hoverCloseDelay={0}
      hoverOpenDelay={0}
      modifiers={{ arrow: { enabled: false } }}
      canEscapeKeyClose={true}
      placement="bottom-start"
      interactionKind="hover"
      onOpened={() => dispatch(setOpenPopover(Date.now()))}
      content={
        <Menu>
          <Link
            href={(process.env.NEXT_PUBLIC_DOCS_URL as string) ?? ""}
            passHref
            target="_blank"
          >
            <MenuItem2 icon="backlink" text="Documentation" />
          </Link>

          <MenuItem2 icon="settings" text="Settings">
            <SettingsMenu />
          </MenuItem2>
          <MenuItem2
            intent="danger"
            onClick={() => signOut()}
            text={"Log Out " + session?.user.name}
            icon="log-out"
          />
          <MenuDivider />

          <Link
            passHref
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_WEB_URL}`}
          >
            <MenuItem2
              className="py-[5px]"
              label={`© ${new Date().getFullYear()}`}
              text={
                <div
                  className="miniLogo nobg "
                  style={{
                    marginTop: "3px",
                    width: "65px",
                    marginLeft: "-2px"
                  }}
                >
                  <Logos />
                </div>
              }
            />
          </Link>
          <MenuDivider />

          <div className="text-xs">
            {/* <MenuDivider title="Status" className="opacity-30"/> */}
            {app_status &&
              Object.keys(app_status).length !== 0 &&
              app_status.map((e: any, i: any) => {
                return (
                  <Link
                    key={i}
                    target="_blank"
                    passHref
                    href={`${process.env.NEXT_PUBLIC_STATUS_URL}`}
                  >
                    <MenuItem2
                      className="select-none"
                      text={<div className="opacity-30 ">{e.name}</div>}
                      labelElement={
                        <Tag
                          className="opacity-80"
                          minimal
                          round
                          intent={e.status === "up" ? "success" : "danger"}
                        >
                          <div className="flex justify-center items-center">
                            <div>
                              <Icon
                                intent={
                                  e.status === "up" ? "success" : "danger"
                                }
                                icon="dot"
                              />
                            </div>
                            <div>{e.status}</div>
                          </div>
                        </Tag>
                      }
                    />
                  </Link>
                )
              })}
            <MenuDivider />
          </div>
          <MenuItem2
            className="opacity-30 select-none !bg-transparent pointer-events-none text-xs"
            text={
              <Text className="max-w-[200px]" ellipsize={true}>
                v. {app_version} {user_agent}
              </Text>
            }
          ></MenuItem2>
        </Menu>
      }
    >
      <Button className="m-0 p-0">
        <div style={{ width: "15px" }} className="nobg sonly opacity-50">
          <LogoMini />
        </div>
      </Button>
    </Popover2>
  )
}

export default AppDropDown
