import { Button } from "@blueprintjs/core"
import { MenuItem2, Tooltip2 } from "@blueprintjs/popover2"
import Link from "next/link"

function NonIdealMenuItem(props: {
  text: string
  url: string
  content: string
}) {
  return (
    <MenuItem2
      text={props.text}
      labelElement={
        <Tooltip2 content={props.content}>
          <Link href={props.url}>
            <Button small className="p-0 m-0" minimal icon="book" />
          </Link>
        </Tooltip2>
      }
      disabled={true}
    />
  )
}
export default NonIdealMenuItem
