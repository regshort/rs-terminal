import { useSession } from "next-auth/react"
import InviteLink from "./settings/inviteLink"
import Markee from "./settings/markque"
import Screenshot from "./settings/screenshot"

function SettingsMenu() {
  const { data: session, status } = useSession()
  return (
    <>
      <Markee />
      <Screenshot />
      {session?.user.isAdmin && <InviteLink />}
    </>
  )
}

export default SettingsMenu
