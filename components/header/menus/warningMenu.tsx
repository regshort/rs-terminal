import { Button, Callout, H5 } from "@blueprintjs/core"
import { Popover2 } from "@blueprintjs/popover2"
import Link from "next/link"
import { useAppSelector } from "../../../redux/hooks"
import { WS_warnings } from "../../../redux/warningsSlice"
import { Flex } from "../../../stitches.config"
function Warnings() {
  const warningsWS = useAppSelector(WS_warnings)
  if (warningsWS.length > 0) {
    return (
      <Popover2
        minimal
        hoverCloseDelay={0}
        hoverOpenDelay={0}
        interactionKind="hover"
        content={
          <>
            {[...warningsWS].reverse().map((warning: any, i) => {
              return (
                <Callout icon={warning.icon} intent={warning.intent} key={i}>
                  <H5>{warning.title}</H5>
                  <Flex
                    style={{
                      justifyContent: "space-between",
                      alignItems: "baseline"
                    }}
                  >
                    <p>{warning.content}</p>
                    {warning.button && (
                      <div>
                        <Link href={warning.button.link}>
                          <Button>{warning.button.text}</Button>
                        </Link>
                      </div>
                    )}
                  </Flex>
                </Callout>
              )
            })}
          </>
        }
      >
        <Button
          minimal
          intent="danger"
          className="browser-warning-button"
          icon="warning-sign"
        />
      </Popover2>
    )
  } else {
    return null
  }
}

export default Warnings
