import { Drawer, Icon, InputGroup } from "@blueprintjs/core"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setWatchlistOverlay, watchlistOverlay } from "../../redux/overlaySlice"
import Watchlists from "../watchlists"
import { Flex } from "../../stitches.config"

function WatchlistOverlay() {
  const dispatch = useAppDispatch()
  const watchlists = useAppSelector(watchlistOverlay)
  const [query, setQuery] = useState<string>("")

  return (
    <Drawer
      onClose={() => dispatch(setWatchlistOverlay(false))}
      title={
        <Flex className="items-center">
          <Icon size={22} icon="geosearch" />
          <div>Watchlists</div>
          <Flex className="justify-center w-full">
            <div className="mr-2">
              <InputGroup
                autoFocus={true}
                rightElement={
                  <Icon
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      right: "0px",
                      top: "7px"
                    }}
                    icon="search"
                  />
                }
                placeholder="Filter Watchlists"
                value={query}
                onChange={e => setQuery(e.target.value)}
              ></InputGroup>
            </div>
          </Flex>
        </Flex>
      }
      isOpen={watchlists}
    >
      <div className="h-full overflow-auto">
        <Watchlists query={query} />
      </div>
    </Drawer>
  )
}

export default WatchlistOverlay
