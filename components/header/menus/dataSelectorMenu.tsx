/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Icon } from "@blueprintjs/core"
import { MenuItem2 } from "@blueprintjs/popover2"
import { Select2 } from "@blueprintjs/select"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { wsStatus } from "../../../redux/settingsSlice"
import { WSC_setDataSelector } from "../../../redux/workspaceControlSlice"

function DataSelector() {
  const dispatch = useAppDispatch()
  const [selectedItem, setSelectedItem] = useState()
  const ws_status = useAppSelector(wsStatus)

  const [items, setItems] = useState<Array<any>>([
    "Last 6 Months",
    "Last 12 Months",
    "Last 24 Months",
    "Full Data"
  ])

  useEffect(() => {
    return setSelectedItem(items[0])
  }, [])

  const itemR = (e: any, { modifiers, handleClick }: any) => {
    return (
      <MenuItem2
        key={e}
        active={modifiers.active}
        onClick={handleClick}
        text={e}
      />
    )
  }
  function handleDataSel(data: any) {
    setSelectedItem(data)
    dispatch(WSC_setDataSelector(data))
  }

  return (
    <Select2
      popoverProps={{ minimal: true }}
      filterable={false}
      items={items}
      itemRenderer={itemR}
      onItemSelect={handleDataSel}
    >
      <Button
        disabled={ws_status !== "open"}
        minimal
        text={selectedItem}
        title="select underlying data"
        icon={
          <>
            {<Icon icon="database" />}
            {ws_status === "open" && (
              <Icon
                icon="dot"
                className="left-1 top-[2px] absolute"
                intent="success"
              />
            )}
          </>
        }
      />
    </Select2>
  )
}

export default DataSelector
