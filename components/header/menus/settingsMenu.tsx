import { useSession } from "next-auth/react"
import InviteLink from "./settings/inviteLink"
import Markee from "./settings/markque"

function SettingsMenu() {
  const { data: session, status } = useSession()
  return (
    <>
      <Markee />
      {session?.user.isAdmin && <InviteLink />}
    </>
  )
}

export default SettingsMenu
