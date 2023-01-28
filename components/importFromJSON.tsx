import { Alert, Button, ButtonGroup, H4, Spinner } from "@blueprintjs/core"
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { omni, setOmni } from "../redux/settingsSlice"
import dynamic from "next/dynamic"
import "@uiw/react-textarea-code-editor/dist.css"
import { useTheme } from "next-themes"
import { WSC_setConfigSetter } from "../redux/workspaceControlSlice"
import { addToast } from "../pages/_app"

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then(mod => mod.default),
  { ssr: false }
)

function ImportFromJSON() {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState<boolean>()
  const [code, setCode] = useState<string>("")
  const { theme, setTheme } = useTheme()

  const omni_open = useAppSelector(omni)
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-color-mode", "light")
    } else {
      document.documentElement.setAttribute("data-color-mode", "dark")
    }
  }, [theme])
  console.log(document.documentElement.getAttribute("data-color-mode"))
  function confirm(e: SyntheticEvent<HTMLElement, Event>) {
    e?.preventDefault()
    if (code.length === 0) {
      addToast({
        message: "Input JSON to load",
        intent: "warning",
        icon: "warning-sign"
      })
      return
    }
    try {
      JSON.parse(code)
    } catch (e) {
      addToast({
        message: "Input JSON to load",
        intent: "warning",
        icon: "warning-sign"
      })
      return
    }
    dispatch(WSC_setConfigSetter(JSON.parse(code)))
    dispatch(setOmni(false))
  }
  return (
    <Alert
      onConfirm={(e: SyntheticEvent<HTMLElement, Event>) => confirm(e)}
      cancelButtonText="cancel"
      intent="success"
      confirmButtonText="Load"
      canOutsideClickCancel={true}
      isOpen={omni_open || false}
      onCancel={() => dispatch(setOmni(false))}
    >
      <div className="flex justify-center items-center w-full h-full">
        {document.documentElement.getAttribute("data-color-mode") !== null ? (
          <div>
            <div className="flex justify-between mb-3">
              <H4>Import from JSON</H4>
              <ButtonGroup className="gap-2">
                <Button intent="success">Load</Button>
                <Button onClick={() => dispatch(setOmni(false))}>Close</Button>
              </ButtonGroup>
            </div>
            <CodeEditor
              placeholder="enter json to import"
              className="overflow-scroll"
              onChange={(evn: ChangeEvent<any>) => setCode(evn.target.value)}
              value={code}
              language="JSON"
            />
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </Alert>
  )
}

export default ImportFromJSON
