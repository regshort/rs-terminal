import { Button, Icon, Spinner } from "@blueprintjs/core"
import { useRouter } from "next/router"
import { useAppSelector } from "../../../redux/hooks"
import { wsStatus } from "../../../redux/settingsSlice"



function ConnectionStatus(){
    const ws_status = useAppSelector(wsStatus)
    const router = useRouter()

    return (
    <>
    {ws_status !== "open" &&
        <Button minimal
        intent={ws_status === "close" ? "danger" : "warning"}
        icon={ws_status === "close" ? <Icon icon="offline" /> : <Spinner size={14}/>} onClick={()=>router.reload()} >
            {ws_status === "close" ? "connection error": "connecting..."}
        </Button>
                }
    </>
    )
}

export default ConnectionStatus