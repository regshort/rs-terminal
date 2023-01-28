import { createStitches } from "@stitches/react"
import { Colors } from "@blueprintjs/core"
// ["#147EB3", "#29A634", "#D1980B", "#D33D17", "#9D3F9D", "#00A396", "#DB2C6F", "#8EB125", "#946638", "#7961DB"]
export const {
  css,
  styled,
  getCssText,
  createTheme,
  globalCss
} = createStitches({
  theme: {
    colors: {
      text: Colors.DARK_GRAY5,
      texti: Colors.LIGHT_GRAY1,
      secondarytext: Colors.GRAY1,
      bg1: Colors.LIGHT_GRAY1,
      bg2: Colors.LIGHT_GRAY2,
      bg3: Colors.LIGHT_GRAY3,
      bg4: Colors.LIGHT_GRAY4,
      bg5: Colors.LIGHT_GRAY5,
      bg6: Colors.BLACK,
      bgi: Colors.LIGHT_GRAY1,
      primary: Colors.BLUE2,
      secondary: Colors.TURQUOISE1,
      success: Colors.GREEN2,
      warning: Colors.ORANGE4,
      danger: Colors.RED2
    }
  }
})

export const darkTheme = createTheme("bp4-dark", {
  colors: {
    text: Colors.LIGHT_GRAY4,
    texti: Colors.DARK_GRAY5,
    secondarytext: Colors.LIGHT_GRAY4,
    bg1: Colors.DARK_GRAY1,
    bg2: Colors.DARK_GRAY2,
    bg3: Colors.DARK_GRAY3,
    bg4: Colors.DARK_GRAY4,
    bg5: Colors.DARK_GRAY5,
    bg6: Colors.BLACK,
    bgi: Colors.GRAY5,
    primary: Colors.BLUE2,
    secondary: Colors.TURQUOISE1,
    success: Colors.GREEN2,
    warning: Colors.ORANGE4,
    danger: Colors.RED2
  }
})
const GlobalStyles = globalCss({
  body: {
    //we can call the color token values with the
    //$ prefix in a string
    unset: "all",
    fontFamily: "Robot Sans, sans-serif",
    background: "$bg1",
    color: "$text"
  }
})

//we can declare the styles here or in pages/_app.tsx
GlobalStyles()
export const Flex = styled("div", { display: "flex" })
export const Kbd = styled("div", {
  scale: 0.8,
  margin: 0,
  opacity: 0.5,
  letterSpacing: 0
})
