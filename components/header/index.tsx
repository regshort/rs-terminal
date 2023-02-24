import { AppDropDown } from "./menus/appMenu"
import { useRouter } from "next/router"
import { Button, ButtonGroup, Menu } from "@blueprintjs/core"
import { useSession } from "next-auth/react"
import FilterCompanyMenu from "./menus/securityFilter/filterCompany"
import FilterDateMenu from "./menus/filterDateMenu"
import ActiveWorkspace from "./menus/activeWorkspaceMenu"
import WorkspaceMenu from "./menus/workspaceMenu"
import WatchlistDropDown from "./menus/watchlistMenu"
import Warnings from "./menus/warningMenu"
import DataSelector from "./menus/dataSelectorMenu"
import { Popover2 } from "@blueprintjs/popover2"
import ThemeSwitch from "./menus/themeSwitch"
import ConnectionStatus from "./menus/connectionStatusMenu"
import { Flex } from "../../stitches.config"

export default function Header() {
  const router = useRouter()

  const { data: session, status } = useSession()
  return (
    <nav className="z-1">
      {session && session.user.canAccess && (
        <>
          <Flex
            css={{ justifyContent: "space-between" }}
            className="hidden sm:flex navigation"
          >
            <ButtonGroup>
              <AppDropDown />
              <WorkspaceMenu />
              <WatchlistDropDown />
              <FilterDateMenu />
              <FilterCompanyMenu />
            </ButtonGroup>

            <ButtonGroup>
              <ActiveWorkspace />
            </ButtonGroup>

            <ButtonGroup>
              <ConnectionStatus />
              {/* <DataSelector /> */}
              <Warnings />
              <ThemeSwitch />
            </ButtonGroup>
          </Flex>

          {/* MOBILE NAVIGATION */}
          <Flex
            css={{ justifyContent: "space-between" }}
            className="flex sm:hidden navigation"
          >
            <Popover2
              content={
                <Menu>
                  <AppDropDown />
                  <WorkspaceMenu disabled={router.pathname !== "/"} />
                  <WatchlistDropDown disabled={router.pathname !== "/"} />
                  <FilterDateMenu disabled={router.pathname !== "/"} />
                  <FilterCompanyMenu disabled={router.pathname !== "/"} />
                </Menu>
              }
            >
              <Button minimal icon="menu" />
            </Popover2>

            <ButtonGroup>
              <ActiveWorkspace />
            </ButtonGroup>

            <ButtonGroup>
              <DataSelector />
              <Warnings />
              <ThemeSwitch />
            </ButtonGroup>
          </Flex>
        </>
      )}
    </nav>
  )
}
