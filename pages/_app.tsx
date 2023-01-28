import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import CookieConsent from "react-cookie-consent"
import { Provider } from "react-redux"
import {
  HotkeysProvider,
  IToastProps,
  Position,
  Toaster
} from "@blueprintjs/core"
import { FocusStyleManager } from "@blueprintjs/core"
import store from "../redux/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "@finos/perspective-workspace/dist/css/material-dark.css"
import "@finos/perspective-workspace/dist/css/material.css"
import "normalize.css/normalize.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css"
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css"
import "../public/styles.scss"
import { darkTheme } from "../stitches.config"

FocusStyleManager.onlyShowFocusOnTabs()

const AppToaster =
  typeof window !== "undefined"
    ? Toaster.create({
        canEscapeKeyClear: true,
        className: "ex-toaster",
        position: Position.BOTTOM_RIGHT
      })
    : null

export function addToast(toast: IToastProps) {
  toast.timeout = 1200
  AppToaster?.show(toast)
}
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})
export default function App({ Component, pageProps }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <HotkeysProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              value={{
                light: "light",
                dark: darkTheme.className
              }}
            >
              <CookieConsent
                cookieName="CC"
                location="bottom"
                style={{
                  background: "var(--colors-bg3)",
                  width: "fit-content",
                  zIndex: 999
                }}
                buttonStyle={{
                  background: "var(--colors-bg1)",
                  color: "var(--colors-text)",
                  fontSize: "13px"
                }}
                expires={150}
              >
                This website uses cookies to enhance the user experience.{" "}
              </CookieConsent>
              <Component {...pageProps} />
            </ThemeProvider>
          </HotkeysProvider>
        </SessionProvider>
      </Provider>
    </QueryClientProvider>
  )
}
