import { Popover2 } from "@blueprintjs/popover2"
import { useRouter } from "next/router"
import { Icon, Text } from "@blueprintjs/core"
import { useAppSelector } from "../../../redux/hooks"
import {
  WSC_Active,
  WSC_Changes,
  WSC_CurrentConfig
} from "../../../redux/workspaceControlSlice"
import WorkspaceSettings from "../forms/settingsWorkspaceForm"
import { appVersion, userAgent } from "../../../redux/settingsSlice"
import { useEffect, useState } from "react"
import { popoverOpen } from "../../../redux/menuSlice"
import { Flex } from "../../../stitches.config"

function ActiveWorkspace() {
  const diff = useAppSelector(WSC_Changes)
  const currentConfig = useAppSelector(WSC_CurrentConfig)
  const [settingsOpen, setSettingsOpen] = useState<any>()
  const active = useAppSelector(WSC_Active)
  const router = useRouter()
  const popOverOpen = useAppSelector(popoverOpen)

  useEffect(() => {
    setSettingsOpen(false)
  }, [popOverOpen])
  if (router.pathname === "/" && active !== null) {
    return (
      <div>
        <Flex className="gap-2 items-center">
          {active.name !== null && (
            <Popover2
              openOnTargetFocus={false}
              interactionKind="hover"
              minimal
              content={
                <Text className="p-2">
                  Changes: (WIP) <br />
                  {diff !== null ? diff.length : "null"}
                  <pre className="text-xs max-h-56 overflow-auto">
                    {JSON.stringify(diff, null, 2)}
                  </pre>
                </Text>
              }
            >
              <Text className="leading-loose">
                {diff && diff.length >= 1 && <Icon icon="dot" />}
              </Text>
            </Popover2>
          )}
          {active.id !== undefined && active.id !== null && (
            <Popover2
              minimal
              autoFocus={false}
              isOpen={settingsOpen}
              onInteraction={e => {
                setSettingsOpen(e)
              }}
              popoverClassName="settingsPopover"
              content={
                <div className="p-1">
                  <WorkspaceSettings />
                </div>
              }
            >
              <div
                className="leading-loose font-bold      "
                title={
                  active.name
                    ? "Your currently loaded workspace is " + active.name
                    : "You have no workspace loaded"
                }
              >
                {active.name}
              </div>
            </Popover2>
          )}
        </Flex>
      </div>
    )
  } else if (router.pathname === "/" && active === null) {
    return <Text>No workspace loaded</Text>
  } else {
    return <Text></Text>
  }
}

export default ActiveWorkspace
