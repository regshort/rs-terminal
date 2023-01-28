import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote } from "next-mdx-remote"
import { H5, H3, H4, Text } from "@blueprintjs/core"
import path from "path"
import fsPromises from "fs/promises"
import Link from "next/link"
import { useAppSelector } from "../redux/hooks"
import { changelog } from "../redux/settingsSlice"

let components = {
  h1: H3,
  h2: H4,
  h3: H5,
}
function Changelog() {
  const data = useAppSelector(changelog)
  return (
    <div className="wrapper text-sm">
      <MDXRemote {...data} components={components} />
    </div>
  )
}
export default Changelog
