import { H4, H5, Slider } from "@blueprintjs/core"
import { MenuItem2 } from "@blueprintjs/popover2"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import {
  marqueeSpeed,
  screenshotMode,
  setMarqueeSpeed,
  setScreenshotMode,
  setShowTickerMarquee,
  showTickerMarquee
} from "../../../../redux/settingsSlice"

function Screenshot() {
  const dispatch = useAppDispatch()
  const screenshot = useAppSelector(screenshotMode)
  const speed = useAppSelector(marqueeSpeed)
  const [slider, setSlider] = useState<any>(speed)

  return (
    <MenuItem2
      onClick={e => {
        dispatch(setScreenshotMode(!screenshot))
      }}
      icon={"camera"}
      text={"Screenshot mode "}
    />
  )
}
export default Screenshot
