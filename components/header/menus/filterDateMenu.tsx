import { Button, H5, Icon, Menu } from "@blueprintjs/core"
import { ContextMenu2, Popover2, Tooltip2 } from "@blueprintjs/popover2"
import { DateRangePicker } from "@blueprintjs/datetime"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import moment from "moment"
import {
  WSC_CurrentConfig,
  WSC_setConfigSetter
} from "../../../redux/workspaceControlSlice"
import { addToast } from "../../../pages/_app"
import {
  dateIndex,
  dateRange,
  popoverOpen,
  setDateIndex,
  setDateRange,
  setOpenPopover
} from "../../../redux/menuSlice"
import { useState } from "react"
import { Flex } from "../../../stitches.config"

export const FilterDateMenu = () => {
  const dispatch = useAppDispatch()
  const currentConfig = useAppSelector(WSC_CurrentConfig)
  const dateI = useAppSelector(dateIndex)
  const dateR = useAppSelector(dateRange)
  const [filterOpen, setFilterOpen] = useState<any>(false)
  const popOverOpen = useAppSelector(popoverOpen)

  function handleRangeChange(dateRange: any) {
    dispatch(setDateIndex(-1))
    if (
      currentConfig === null ||
      Object.keys(currentConfig.viewers).length === 0
    ) {
      addToast({
        message: "No viewes found to apply this filter to",
        intent: "danger",
        icon: "error"
      })
      return
    }
    let currentCopy = structuredClone(currentConfig)
    if (currentConfig === null) {
      addToast({
        message: "No viewes found to apply this filter to",
        intent: "danger",
        icon: "error"
      })
      dispatch(setDateIndex(-1))
      dispatch(setDateRange([null, null]))
      return
    }
    dispatch(setDateRange(dateRange))
    if (currentConfig.master !== undefined && currentConfig.master !== null) {
      const masters = currentConfig.master.widgets.map((widget: any) => widget)
      masters.map((master: any) => {
        if (dateRange[1] === null || dateRange[0] === null) {
          return
        } else {
          const filtered = currentCopy.viewers[master].filter.filter(
            (element: any, index: any) => {
              if (element[0] !== "date") return element
            }
          )
          currentCopy.viewers[master].filter = filtered
          currentCopy.viewers[master].filter.push(
            ["date", ">=", moment(dateRange[0]).unix() * 1000],
            ["date", "<=", moment(dateRange[1]).unix() * 1000]
          )
          dispatch(WSC_setConfigSetter(currentCopy))
          addToast({
            message: "setting filter to date with master",
            intent: "warning",
            icon: "calendar"
          })
        }
      })
    } else {
      Object.keys(currentCopy.viewers).map((key: any, windex) => {
        if (dateRange[0] !== null && dateRange[1] === null) {
          const filtered = currentCopy.viewers[key].filter.filter(
            (element: any, index: any) => {
              if (element[0] !== "date") return element
            }
          )
          currentCopy.viewers[key].filter = filtered
          currentCopy.viewers[key].filter.push(
            ["date", ">=", moment(dateRange[0]).unix() * 1000],
            ["date", "<=", moment(dateRange[0]).unix() * 1000]
          )
        } else {
          const filtered = currentCopy.viewers[key].filter.filter(
            (element: any, index: any) => {
              if (element[0] !== "date") return element
            }
          )
          currentCopy.viewers[key].filter = filtered
          currentCopy.viewers[key].filter.push(
            ["date", ">=", moment(dateRange[0]).unix() * 1000],
            ["date", "<=", moment(dateRange[1]).unix() * 1000]
          )
        }
      })
      dispatch(WSC_setConfigSetter(currentCopy))
      addToast({
        message: "setting date filter",
        intent: "warning",
        icon: "calendar"
      })
    }
  }
  return (
    <Popover2
      minimal
      openOnTargetFocus={false}
      hoverCloseDelay={0}
      hoverOpenDelay={0}
      modifiers={{ arrow: { enabled: false } }}
      canEscapeKeyClose={true}
      captureDismiss={false}
      placement="bottom-start"
      isOpen={filterOpen}
      interactionKind="hover"
      autoFocus={false}
      enforceFocus={false}
      onOpened={() => dispatch(setOpenPopover(Date.now()))}
      onInteraction={(nextState, e: any) => {
        if (e === undefined || e.target.nodeName === "SELECT") return
        setFilterOpen(nextState)
      }}
      content={
        <div>
          <ContextMenu2
            content={<></>}
            onContextMenu={e => {
              e.preventDefault()
              dispatch(setDateIndex(-1))
              dispatch(setDateRange([null, null]))
              return
            }}
          >
            <DateRangePicker
              allowSingleDayRange={true}
              highlightCurrentDay={true}
              maxDate={new Date()}
              onChange={handleRangeChange}
              value={dateR}
              onShortcutChange={(label, index) => {
                if (
                  currentConfig &&
                  Object.keys(currentConfig.viewers).length !== 0
                )
                  dispatch(setDateIndex(index))
              }}
              selectedShortcutIndex={dateI}
            />
            <Tooltip2
              minimal
              className="text-xs absolute right-1 bottom-1"
              content={
                <>
                  <H5>Tips</H5>
                  <ul className="list-decimal pl-4">
                    <li>right click to reset filter</li>
                    <li>premade ranges needed to save relative data</li>
                  </ul>
                </>
              }
            >
              <Icon className="opacity-10" icon="info-sign" />
            </Tooltip2>
          </ContextMenu2>
        </div>
      }
    >
      <Button
        text="Date"
        rightIcon={
          <Flex className="w-[15px] h-[20px] relative">
            <Icon
              size={12}
              className="absolute right-1 top-[2px]"
              icon="filter"
            />
            <Icon
              size={10}
              className="absolute -right-[3px] bottom-[3px]"
              icon="calendar"
            />
          </Flex>
        }
      ></Button>
    </Popover2>
  )
}

export default FilterDateMenu
