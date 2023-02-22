import { Callout, EditableText, FormGroup, H5, Switch } from "@blueprintjs/core"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { addToast } from "../../../pages/_app"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { dateIndex } from "../../../redux/menuSlice"
import {
  WSC_Active,
  WSC_setActiveDescription,
  WSC_setActiveName
} from "../../../redux/workspaceControlSlice"
import { fetcher } from "../../layout"
import { dateIndexToString } from "../../../lib/dateRangeIndex2String"

function WorkspaceSettings() {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const { mutate } = useSWRConfig()
  const active = useAppSelector(WSC_Active)
  const [changed, setChanged] = useState<any>()

  const [formName, setFromName] = useState<string | null>()
  const [formDescription, setFormDescription] = useState<string | null>()
  const [formPrivate, setFormPrivate] = useState<boolean | undefined>()
  const [formUserDefault, setFormUserDefault] = useState<boolean | null>()
  const [formRelative, setFormRelative] = useState<boolean | null>()
  const [formWatchlist, setFormWatchlist] = useState<boolean | null>()
  const relativeDate = useAppSelector(dateIndex)
  const [initDone, setInitDone] = useState(false)

  const { data: wsUserDefault, error: ud_error } = useSWR(
    "/api/user/default",
    fetcher
  )
  const { data: workspaces, error: ws_error } = useSWR(
    "/api/workspace",
    fetcher
  )

  const activeSWR: any = useMemo(() => {
    return workspaces.filter((e: any) => {
      if (e.id === active.id) return e
    })
  }, [workspaces, active])

  const init = useCallback(() => {
    const b = activeSWR[0]
    if (!b) return
    setFromName(b.name)
    setFormDescription(b.description)
    setFormPrivate(b.private)
    setFormUserDefault(wsUserDefault === b.id)
    setFormRelative(b.relativeDate !== null)
    setFormWatchlist(b.watchlist)
    setInitDone(true)
  }, [activeSWR, wsUserDefault])

  useEffect(() => {
    if (activeSWR) init()
  }, [activeSWR, init])

  const submitNameChange = useCallback(async () => {
    if (formName === undefined || formName === active.name) return
    await fetch(`/api/workspace/${active.id}`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        creator: active.creator,
        id: active.id,
        data: {
          name: formName
        }
      }),
      method: "PATCH"
    })
      .then(function(response) {
        if (response.ok) {
          return response.json()
        }
        return response.json().then(function(json) {
          throw json
        })
      })
      .then(e => {
        addToast({ message: "Successfully updated name" })
        mutate("/api/workspace")
        dispatch(WSC_setActiveName(formName))
      })
      .catch(err => {
        console.log(err)
      })
  }, [formName, active.name, active.id, active.creator, mutate, dispatch])

  const submitDescriptionChange = useCallback(async () => {
    if (formDescription === undefined || formDescription === active.description)
      return

    await fetch(`/api/workspace/${active.id}`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: {
          description: formDescription
        },
        creator: active.creator,
        id: active.id
      }),
      method: "PATCH"
    }).then(e => {
      addToast({ message: "Successfully updated description" })
      dispatch(WSC_setActiveDescription(formDescription))
      mutate("/api/workspace")
    })
  }, [
    active.description,
    active.id,
    active.creator,
    dispatch,
    mutate,
    formDescription
  ])

  const submitChanges = useCallback(async () => {
    await fetch(`/api/workspace/${active.id}`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: {
          private: formPrivate,
          watchlist: formWatchlist,
          relative_date: dateIndexToString(relativeDate)
        },
        creator: active.creator,
        id: active.id
      }),
      method: "PATCH"
    }).then(e => {
      addToast({ message: "Successfully saved workspace" })
      mutate("/api/workspace")
    })
  }, [
    active.id,
    active.creator,
    formPrivate,
    formWatchlist,
    relativeDate,
    mutate
  ])

  async function makeDefault(workspace: any, isSame: boolean) {
    await fetch(`/api/user/default`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        isSame: isSame,
        id: workspace.id
      })
    })
      .then((res: any) => {
        mutate("/api/user/default")
      })
      .catch(err => {
        console.log(err)
      })
  }

  // on change save
  useEffect(() => {
    if (changed === undefined) return
    submitChanges()
    return () => setChanged(undefined)
  }, [changed, submitChanges])

  return (
    <>
      <div style={{ width: "300px", height: "100%", padding: "0.5em" }}>
        <H5>Workspace Settings</H5>

        <div className="mb-4">
          {active.creator !== session?.user.id && (
            <Callout intent="warning" className="mb-3">
              You cannot edit this workspace, save it as a new one.
            </Callout>
          )}
          <H5>
            <EditableText
              disabled={active.creator === session?.user.id ? false : true}
              defaultValue={active.name as any}
              value={formName || "no data?"}
              placeholder="Click to edit name"
              onChange={setFromName}
              onConfirm={submitNameChange}
              maxLength={42}
              multiline
              confirmOnEnterKey={true}
            />
          </H5>
          <EditableText
            disabled={active.creator === session?.user.id ? false : true}
            defaultValue={active.description as any}
            value={formDescription || ""}
            placeholder="Click to edit description"
            onChange={setFormDescription}
            onConfirm={submitDescriptionChange}
            maxLength={244}
            confirmOnEnterKey={true}
            multiline
          />
        </div>
        <FormGroup
          label="Options"
          disabled={active.creator === session?.user.id ? false : true}
        >
          <Switch
            disabled={active.creator === session?.user.id ? false : true}
            id="private"
            label={"Private"}
            innerLabelChecked="on"
            innerLabel="off"
            defaultChecked={formPrivate}
            onChange={e => {
              // e.preventDefault()
              setFormPrivate(!formPrivate)
              setChanged(true)
            }}
          />
          <Switch
            disabled={active.creator === session?.user.id ? false : true}
            id="default"
            label="User default"
            innerLabelChecked="on"
            innerLabel="off"
            defaultChecked={wsUserDefault.id === active.id ? true : false}
            onChange={() => {
              setFormUserDefault(!formUserDefault)
              makeDefault(active, wsUserDefault.id === active.id)
            }}
          />
        </FormGroup>
        <FormGroup
          disabled={
            active.creator === session?.user.id ? relativeDate === -1 : true
          }
          label="Relative Date"
          labelFor="relativeDate"
          labelInfo={"(beta)"}
          helperText={`Set this if you dont want harcoded date filters`}
        >
          <Switch
            disabled={
              active.creator === session?.user.id ? relativeDate === -1 : true
            }
            id="relativeDate"
            label={
              relativeDate !== -1
                ? `Set ${dateIndexToString(relativeDate)} relatively`
                : `Relative Date`
            }
            innerLabelChecked="on"
            innerLabel="off"
            defaultChecked={formRelative || false}
            onChange={() => {
              setFormRelative(!formRelative)
              setChanged(true)
            }}
          />
        </FormGroup>
        <FormGroup
          disabled={active.creator === session?.user.id ? false : true}
          label="Watchlist View"
          labelFor="watchlist"
          labelInfo="(beta)"
          helperText="We will loop over your watchlist with this view. "
        >
          <Switch
            disabled={active.creator === session?.user.id ? false : true}
            id="watchlist"
            label="Watchlist View"
            innerLabelChecked="on"
            innerLabel="off"
            defaultChecked={formWatchlist || false}
            onChange={() => {
              setFormWatchlist(!formWatchlist)
              setChanged(true)
            }}
          />
        </FormGroup>
      </div>
    </>
  )
}

export default WorkspaceSettings
