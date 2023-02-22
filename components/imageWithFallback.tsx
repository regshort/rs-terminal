import { useState } from "react"
import Image from "next/image"
import { Tag } from "@blueprintjs/core"
import MiddlewarePlugin from "next/dist/build/webpack/plugins/middleware-plugin"
import { useTheme } from "next-themes"

const ImageWithFallback = (props: any) => {
  const { alt, hasImage, src, insearch, inwatchlist, ...rest } = props
  const { theme, setTheme } = useTheme()

  const [size, setSize] = useState<any>(["22px", "22px"])
  // const hasImage = secs.includes(company.ticker)
  const myLoader = ({ src, width, quality }: any) => {
    return `${process.env.NEXT_PUBLIC_CDN}${src}.png?w=${width}&q=${quality ||
      75}`
  }

  const bg = insearch !== true ? "var(--colors-bgi)" : ""
  return (
    <>
      <Tag
        minimal
        style={{
          position: "relative",
          width: 20,
          height: 20,
          padding: 2,
          margin: 0,
          borderRadius: 0,
          background: bg,
          textAlign: "center",
          color:
            theme === "light"
              ? insearch
                ? "var(--colors-text)"
                : "var(--colors-text)"
              : insearch
              ? "var(--colors-text)"
              : "var(--colors-texti)",
          fontWeight: "bold"
        }}
      >
        {hasImage && (
          <Image
            className="tagWimg"
            height={size[0]}
            width={size[1]}
            alt={alt}
            loader={myLoader}
            src={alt}
            onLoadingComplete={e =>
              setSize([e.naturalHeight + "px", e.naturalWidth + "px"])
            }
            {...rest}
          />
        )}
        {!hasImage && alt.charAt(0) + alt.charAt(alt.length - 1)}
      </Tag>

      {/* {!hasImage && !insearch && (
        <Tag
          style={{
            width: 32,
            height: 32,
            position: "relative",
            background: bg,
            color: (theme === 'light') ?"var(--colors-text)" : "var(--colors-texti)",
            fontWeight: "bold",
            textAlign: "center",
            padding: 1
          }}
        >
          {alt.charAt(0) + alt.charAt(alt.length - 1)}
        </Tag>
      )}
      {!hasImage && insearch && (
        <Tag
        minimal
          style={{
            width: 29,
            height: 29,
            position: "relative",
            background: bg,
            fontWeight: "bold",
            textAlign: "center",
            padding: 2,
            margin: 0,
            borderRadius: 0
          }}
        >
          {alt.charAt(0) + alt.charAt(alt.length - 1)}
        </Tag>
      )}
      {hasImage && insearch && (
        <Tag minimal style={{ width: 29, height: 29, padding: 2, margin: 0, borderRadius: 0 }}>
          <Image
            className="tagWimg"
            height={size[0]}
            width={size[1]}
            alt={alt}
            loader={myLoader}
            src={alt}
            onLoadingComplete={(e) =>
              setSize([e.naturalHeight + "px", e.naturalWidth + "px"])
            }
            {...rest}
          />
        </Tag>
      )}
      {hasImage && !insearch && (
        <Tag
          style={{
            width: 32, height: 32,
            position: "relative",
            background: bg,
            padding: 1,
          }}
        >
          <Image
            className="tagWimg"
            height={size[0]}
            width={size[1]}
            alt={alt}
            loader={myLoader}
            src={alt}
            onLoadingComplete={(e) =>
              setSize([e.naturalHeight + "px", e.naturalWidth + "px"])
            }
            {...rest}
          />
        </Tag>
      )} */}
    </>
  )
}

export default ImageWithFallback
