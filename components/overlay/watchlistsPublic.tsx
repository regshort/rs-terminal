import { Drawer, Icon, InputGroup } from "@blueprintjs/core"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  setWatchlistPublicOverlay,
  watchlistPublicOverlay
} from "../../redux/overlaySlice"
import PublicWatchlists from "../watchlists/public"
import { Flex } from "../../stitches.config"

function WatchlistPublicOverlay() {
  const dispatch = useAppDispatch()
  const open = useAppSelector(watchlistPublicOverlay)
  const [query, setQuery] = useState<string>("")

  return (
    <Drawer
      onClose={() => dispatch(setWatchlistPublicOverlay(false))}
      title={
        <Flex className="items-center">
          <Icon size={22} icon="geosearch" />
          <div>Public Watchlists</div>
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
      isOpen={open}
    >
      <div className="h-full overflow-auto">
        <PublicWatchlists query={query} />
      </div>
    </Drawer>
  )
}

export default WatchlistPublicOverlay
