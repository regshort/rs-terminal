import { useTheme } from "next-themes"
import { useCallback } from "react"
import LogoMiniDark from "../public/svg/flogod-mini.svg"
import LogoMiniLight from "../public/svg/flogo-mini.svg"
function Logo() {
  const { theme, setTheme } = useTheme()
  const Logo = useCallback(() => {
    if (theme === "light") {
      return <LogoMiniLight />
    } else if (theme === "dark") {
      return <LogoMiniDark />
    } else {
      return <LogoMiniLight />
    }
  }, [theme])
  return <Logo />
}

export default Logo
