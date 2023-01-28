import Header from "./header/index"
import store from "../redux/store"
import { Provider } from "react-redux"
import { AnchorButton, Button, ButtonGroup } from "@blueprintjs/core"
interface Props {
  children: React.ReactNode
}
export const fetcher = (...args: any[]) =>
  fetch([...args] as any).then((res) => res.json())
export default function Layout({ children }: Props) {
  return (
    <Provider store={store}>
      <Header />
      <div style={{ position: "relative", minHeight: "calc(100vh - 40px)" }}>
        {children}
      </div>
    </Provider>
  )
}
