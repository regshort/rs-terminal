import { Text, Tag } from "@blueprintjs/core"
import { useCallback, useEffect, useState } from "react"
import Marquee from "react-fast-marquee"
import { Flex } from "../../../../stitches.config"
import useSWR from "swr"
import { addToast } from "../../pages/_app"
import { getCompanies } from "../../redux/companySlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  WSC_CurrentConfig,
  WSC_setConfigSetter
} from "../../redux/workspaceControlSlice"
import { fetcher } from "../layout"
import { marqueeSpeed, showTickerMarquee } from "../../redux/settingsSlice"

function ScrollingSecs() {
  const [selectedItem, setSelectedItem] = useState<any>()
  const dispatch = useAppDispatch()
  const showMarquee = useAppSelector(showTickerMarquee)
  const speed = useAppSelector(marqueeSpeed)

  const { data: workspaces, error: ws_error } = useSWR(
    "/api/workspace/",
    fetcher
  )
  const data = [
    [-14, "AMC", 434],
    [-32, "GME", 134],
    [13, "AAPL", 532],
    [-8, "AHD", 732],
    [-3, "FFIE", 13],
    [43, "FITBI", 323],
    [4, "UBS", 123],
    [-4, "K", 323],
    [-3, "Faze", 231],
    [-14, "AMC", 434],
    [-32, "GME", 134],
    [13, "AAPL", 532],
    [-8, "AHD", 732],
    [-3, "FFIE", 13],
    [43, "FITBI", 323],
    [4, "UBS", 123],
    [-4, "K", 323],
    [-3, "Faze", 231]
  ]

  const handleSubmitCF = useCallback(async () => {
    const main_config: any = workspaces.find(
      (c: any) => c.id === "cl77ah6g70242o2g5uhvbr4qo"
    )
    if (main_config.id === null) return
    // dispatch(WSC_setActive(main_config))
    // setTimeout(()=>{

    // }, 1000)
    let currentCopy = structuredClone(main_config.workspace)
    if (currentCopy.viewers !== undefined) {
      Object.keys(currentCopy.viewers).map((key: any) => {
        const filtered = currentCopy.viewers[key].filter.filter(
          (element: any) => {
            if (element[0] !== "ticker") return element
          }
        )
        currentCopy.viewers[key].filter = filtered
        currentCopy.viewers[key].filter.push(["ticker", "==", selectedItem])
      })
      addToast({
        message: "setting filter to ticker " + selectedItem,
        intent: "warning",
        icon: "signal-search"
      })
      dispatch(WSC_setConfigSetter(currentCopy))
    } else {
      addToast({
        message: "No viewes found to apply this filter to",
        intent: "danger",
        icon: "error"
      })
    }
  }, [workspaces, selectedItem, dispatch])

  useEffect(() => {
    if (selectedItem === undefined) return
    handleSubmitCF()
  }, [selectedItem, handleSubmitCF])
  const listItems = data.map(sec => {
    return (
      <Tag
        minimal
        intent={sec[0] < 0 ? "danger" : "success"}
        style={{ marginRight: ".5em" }}
      >
        <Flex style={{ gap: ".5em", alignItems: "center" }}>
          <Text>{(sec[0] >= 0 ? "+" : "") + sec[0] + "%"}</Text>

          <Tag
            style={{ fontWeight: "bold" }}
            onClick={() => setSelectedItem(sec[1])}
          >
            {/* <ImageWithFallback alt={sec[1]} hasImage={hasImage} /> */}
            {sec[1]}
          </Tag>
          <Text>{sec[2] + "$"}</Text>
        </Flex>
      </Tag>
    )
  })

  return (
    <Flex>
      {showMarquee && (
        <Marquee
          speed={speed}
          pauseOnHover={true}
          gradient={false}
          style={{ width: "100%" }}
        >
          <Flex>{listItems}</Flex>
        </Marquee>
      )}
    </Flex>
  )
}

export default ScrollingSecs
