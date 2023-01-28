import { Drawer, Icon, InputGroup } from "@blueprintjs/core"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setWorkspaceOverlay, workspaceOverlay } from "../../redux/overlaySlice"
import Workspaces from "../workspaces"
import { Flex } from "../../stitches.config"

function WorkspaceOverlay() {
  const dispatch = useAppDispatch()
  const workspace = useAppSelector(workspaceOverlay)
  const [query, setQuery] = useState<string>("")

  return (
    <Drawer
      onClose={() => dispatch(setWorkspaceOverlay(false))}
      title={
        <Flex className="items-center">
          <Icon size={22} icon="modal" />
          <div>Workspaces</div>
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
        <Workspaces query={query} />
      </div>
    </Drawer>
  )
}

export default WorkspaceOverlay
