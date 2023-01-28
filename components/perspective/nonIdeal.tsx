import { Text, Code, H4, H3, Icon } from "@blueprintjs/core"
import { useAppSelector } from "../../redux/hooks"
import { wsStatus } from "../../redux/settingsSlice"
import { Flex } from "../../stitches.config"

function NonIdeal() {
  const ws_status = useAppSelector(wsStatus)
  return (
    <Flex className="justify-center items-center h-screen z-0 pointer-events-none absolute t-[40px] w-full">
      <Flex className="flex-col justify-center opacity-50">
        {ws_status === "open" && (
          <>
            <H3 className="text-center">Empty Workspace</H3>
            <div className=" mt-3 bp4-text-large text-center flex flex-col gap-2">
              <Text className="flex justify-center gap-2 items-baseline">
                <kbd>right click</kbd> here to open the{" "}
                <Code>context-menu</Code>
              </Text>
              <Text className="flex justify-center gap-2 items-baseline">
                <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>O</kbd> open{" "}
                <Code>workspace menu</Code>
              </Text>
              <Text className="flex justify-center gap-2 items-baseline">
                <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> to{" "}
                <Code>save a workspace</Code>
              </Text>
              <Text className="flex justify-center gap-2 items-baseline">
                <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Shift</kbd>+<kbd>S</kbd>{" "}
                to <Code>save a workspace as</Code>
              </Text>
              <Text className="flex justify-center gap-2 items-baseline">
                <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>N</kbd> create{" "}
                <Code>new workspace</Code>
              </Text>
            </div>
          </>
        )}
        {ws_status === "close" && (
          <Flex className="items-baseline gap-3">
            <Icon intent="danger" icon="warning-sign" />
            <H3 className="text-center">Not connected</H3>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
export default NonIdeal
