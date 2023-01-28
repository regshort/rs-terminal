import {
  FormGroup,
  NumericInput,
  Button,
  Label,
  Spinner,
  Icon,
  H5
} from "@blueprintjs/core"
import { MenuItem2 } from "@blueprintjs/popover2"
import moment from "moment"
import { DateInput2 } from "@blueprintjs/datetime2"
import { useState } from "react"
import { addToast } from "../../../../pages/_app"
import useSWR, { mutate } from "swr"
import { fetcher } from "../../../layout"
import { Flex } from "../../../../stitches.config"

function InviteLink() {
  const [date, setDate] = useState<string | null>(
    moment()
      .add(3, "days")
      .format("Y-M-D")
  )
  const [uses, setUses] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const { data: links, error: ws_error } = useSWR("/api/user/link", fetcher)
  if (!links) return <div>loading</div>

  async function postData() {
    setLoading(true)
    await fetch(`/api/user/link`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uses: uses,
        date: date
      }),
      method: "POST"
    }).then(async (e: any) => {
      let r = await e.json()
      addToast({ message: "Link copied to clipboard" })
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}/?k=${r.data.key}`
      )
      mutate("/api/user/link")
      setLoading(false)
    })
  }
  async function deleteData(e: any) {
    setLoading(true)
    await fetch(`/api/user/link`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: e.key
      }),
      method: "DELETE"
    }).then(async (e: any) => {
      let r = await e.json()
      mutate("/api/user/link")
      setLoading(false)
    })
  }

  function createTag(e: any) {
    if (moment(e.expiresAt).isSameOrAfter(new Date())) {
      if (e.uses === e._count.usedBy && e._count.usedBy !== 0) {
        return `used up`
      }
      return `expires ${moment(e.expiresAt).fromNow()}`
    } else {
      if (e.uses === e._count.usedBy && e._count.usedBy !== 0) {
        return `used up`
      }
      return `expired`
    }
  }
  function IconIntent(e: any) {
    if (e.uses === 0) {
      return "success"
    } else {
      if (e.uses - e._count.usedBy > 0) {
        return "success"
      } else {
        return "danger"
      }
    }
  }
  return (
    <MenuItem2 icon="link" text="create invite link">
      <div className="p-2 w-[270px]">
        <H5>Create Invite link</H5>

        <FormGroup
          label="How many times can this link be used?"
          labelFor="uses"
        >
          <NumericInput
            intent={uses === 0 ? "warning" : "primary"}
            onValueChange={setUses}
            value={uses}
            fill
            defaultValue={1}
            min={0}
            placeholder="uses"
          />
          <div style={{ marginTop: ".5em" }}>
            {uses === 0 ? (
              <Label style={{ color: "var(--colors-warning)" }}>
                0 will be handled as infinite uses
              </Label>
            ) : (
              <Label style={{ color: "var(--colors-text)", opacity: 0.5 }}>
                0 will be handled as infinite uses
              </Label>
            )}
          </div>
        </FormGroup>

        <FormGroup
          helperText=""
          label="When should this link expire?"
          labelFor="uses"
        >
          <DateInput2
            minDate={new Date()}
            closeOnSelection={false}
            highlightCurrentDay={true}
            onChange={setDate}
            formatDate={date => moment(date).format("Y-M-D")}
            parseDate={str => new Date(str)}
            placeholder="M/D/YYYY"
            value={date}
          />
        </FormGroup>
        <Button
          onClick={postData}
          icon={loading && <Spinner size={13}></Spinner>}
          intent="primary"
          fill
        >
          {"Create Link"}
        </Button>
        {links && links.length > 0 && (
          <Label style={{ marginTop: "1em" }}>
            click a link to copy to clipboard
          </Label>
        )}

        <div
          style={{ maxHeight: "100px", overflow: "scroll", marginTop: "1em" }}
        >
          {links.data.map((e: any, index: number) => {
            return (
              <Flex key={index} className="linkmenuitems">
                <MenuItem2
                  disabled={
                    (e.uses !== 0 && e.uses === e._count.usedBy) ||
                    moment(e.expiresAt).isSameOrBefore(new Date())
                  }
                  shouldDismissPopover={false}
                  onClick={(event: any) => {
                    event.preventDefault()
                    addToast({ message: "Link copied to clipboard" })
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_APP_URL}/?k=${e.key}`
                    )
                  }}
                  labelElement={
                    <Flex style={{ gap: ".5em" }}>
                      <Flex
                        title={
                          e.uses > 0
                            ? `uses left ${e.uses - e._count.usedBy}`
                            : `used: ${e._count.usedBy}`
                        }
                      >
                        <Icon
                          intent={IconIntent(e)}
                          style={{ padding: "0.2em" }}
                          size={12}
                          icon={e.uses > 0 ? "repeat" : "refresh"}
                        />
                      </Flex>
                      <div>{createTag(e)}</div>
                    </Flex>
                  }
                  icon="link"
                  text={`#${links.data.length - index}`}
                />
                <Button
                  minimal
                  icon="cross"
                  onClick={event => {
                    event.preventDefault()
                    deleteData(e)
                  }}
                />
              </Flex>
            )
          })}
        </div>
      </div>
    </MenuItem2>
  )
}

export default InviteLink
