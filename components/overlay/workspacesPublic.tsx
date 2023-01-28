import { Drawer, Icon, InputGroup } from "@blueprintjs/core"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  setWorkspacePublicOverlay,
  workspacePublicOverlay
} from "../../redux/overlaySlice"
import PublicWorkspaces from "../workspaces/public"
import { Flex } from "../../stitches.config"

function WorkspacePublicOverlay() {
  const dispatch = useAppDispatch()
  const workspace = useAppSelector(workspacePublicOverlay)
  const [query, setQuery] = useState<string>("")

  return (
    <Drawer
      onClose={() => dispatch(setWorkspacePublicOverlay(false))}
      title={
        <Flex className="items-center">
          <Icon size={22} icon="modal" />
          <div>Public Workspaces</div>
          <Flex className="justify-center w-full">
            <div className="mr-2">
              <InputGroup
                autoFocus={true}
                rightElement={
                  <Icon
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      right: "0px",
                      top: "7px"
                    }}
                    icon="search"
                  />
                }
                placeholder="Filter Workspaces"
                value={query}
                onChange={e => setQuery(e.target.value)}
              ></InputGroup>
            </div>
          </Flex>
        </Flex>
      }
      isOpen={workspace}
    >
      <div className="h-full overflow-auto">
        <PublicWorkspaces query={query} />
      </div>
    </Drawer>
  )
}

export default WorkspacePublicOverlay
