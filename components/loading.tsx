import { Spinner } from "@blueprintjs/core"
import { Flex } from "../stitches.config"

function LoadingComp() {
  return (
    <Flex
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        gap: "1em"
      }}
    >
      <div style={{ height: "fit-content" }}>
        <Spinner size={15} style={{ marginBottom: "2em" }} />
      </div>
    </Flex>
  )
}
export default LoadingComp
