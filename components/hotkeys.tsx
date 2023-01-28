import { useHotkeys } from "@blueprintjs/core"
import { useMemo } from "react"
import { addToast } from "../pages/_app"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import {
  omni,
  saveWorkspace,
  setOmni,
  setOpenWorkspace,
  setSaveWorkspace,
  setSaveWorkspaceAs,
} from "../redux/settingsSlice"
import { WSC_setActive } from "../redux/workspaceControlSlice"
export const empty = {
  name: "Untitled",
  workspace: {
    mode: "globalFilters",
    sizes: [1],
    detail: { main: null },
    viewers: {},
  },
}
function Hotkeys() {
  const dispatch = useAppDispatch()

  const omni_global = useAppSelector(omni)

  const hotkeys = useMemo(
    () => [
      {
        combo: "alt+ctrl+O",
        global: true,
        label: "Open Workspace",
        onKeyDown: () => dispatch(setOpenWorkspace(true)),
      },
      {
        combo: "alt+ctrl+S",
        global: true,
        label: "Save Workspace",
        onKeyDown: () => dispatch(setSaveWorkspace(true)),
      },
      {
        combo: "alt+ctrl+N",
        global: true,
        label: "New empty workspace",
        onKeyDown: () => dispatch(WSC_setActive(empty)),
      },
      {
        combo: "alt+ctrl+shift+S",
        global: true,
        label: "Save Workspace As",
        onKeyDown: () => dispatch(setSaveWorkspaceAs(true)),
      },
      {
        combo: "alt+ctrl+space",
        global: true,
        label: "Open omni",
        onKeyDown: () => dispatch(setOmni(!omni_global)),
      },
    ],
    [dispatch, omni_global]
  )
  useHotkeys(hotkeys)
  return <></>
}

export default Hotkeys
