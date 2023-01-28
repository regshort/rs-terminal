import { useTheme } from "next-themes"
import { useCallback } from "react"
import LogoLight from "../public/svg/flogo.svg"
import LogoDark from "../public/svg/flogod.svg"

function Logo() {
  const { theme, setTheme } = useTheme()
  const Logo = useCallback(() => {
    if (theme === "light") {
      return <LogoLight />
    } else if (theme === "dark") {
      return <LogoDark />
    } else {
      return <LogoLight />
    }
  }, [theme])

  return <Logo />
}

export default Logo
