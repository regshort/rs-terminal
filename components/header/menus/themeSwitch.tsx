import { Button } from "@blueprintjs/core"
import { useTheme } from "next-themes"

function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      minimal
      icon={theme === "light" ? "moon" : "flash"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    />
  )
}

export default ThemeSwitch
