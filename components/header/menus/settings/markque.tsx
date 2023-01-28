import { H4, H5, Slider } from "@blueprintjs/core"
import { MenuItem2 } from "@blueprintjs/popover2"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import {
  marqueeSpeed,
  setMarqueeSpeed,
  setShowTickerMarquee,
  showTickerMarquee,
} from "../../../../redux/settingsSlice"

function Markee() {
  const dispatch = useAppDispatch()
  const showMarquee = useAppSelector(showTickerMarquee)
  const speed = useAppSelector(marqueeSpeed)
  const [slider, setSlider] = useState<any>(speed)

  return (
    <MenuItem2 disabled icon="fast-backward" text={"Ticker marquee"}>
      <H5 style={{ padding: "0.3em 0em 0.1em .3em" }}>Marquee Settings</H5>
      <MenuItem2
        onClick={(e) => {
          e.preventDefault()
          dispatch(setShowTickerMarquee(!showMarquee))
        }}
        icon={showMarquee ? "eye-off" : "eye-open"}
        text={showMarquee ? "Hide Maraquee" : "Show Maraquee"}
      />
      <div style={{ padding: "1em" }}>
        Scroll-Speed
        <Slider
          initialValue={speed}
          value={slider}
          labelStepSize={50}
          onChange={setSlider}
          onRelease={() => dispatch(setMarqueeSpeed(slider))}
          min={1}
          max={200}
        ></Slider>
      </div>
    </MenuItem2>
  )
}
export default Markee
