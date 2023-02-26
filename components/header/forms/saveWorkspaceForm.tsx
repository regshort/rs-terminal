import {
  Button,
  FormGroup,
  InputGroup,
  Switch,
  TextArea,
  Text,
  H5
} from "@blueprintjs/core"
import { useSession } from "next-auth/react"
import { useSWRConfig } from "swr"
import { addToast } from "../../../pages/_app"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { WSC_CurrentConfig } from "../../../redux/workspaceControlSlice"
import {
  setDescription,
  setGlobalDefault,
  setName,
  setPrivate,
  setRelativeDate,
  setUserDefault,
  setWatchlist,
  workspaceFormDescription,
  workspaceFormGlobalDefault,
  workspaceFormName,
  workspaceFormPrivate,
  workspaceFormRelativeDate,
  workspaceFormReset,
  workspaceFormUserDefault,
  workspaceFormWatchlist
} from "../../../redux/workspaceFormSlice"
import { dateIndex } from "../../../redux/menuSlice"
import { Flex } from "../../../stitches.config"
import { dateIndexToString } from "../../../lib/dateRangeIndex2String"

function SaveWorkSpaceForm(props: any) {
  const { data: session } = useSession()
  const { mutate } = useSWRConfig()
  const dispatch = useAppDispatch()

  const formName = useAppSelector(workspaceFormName)
  const formDescription = useAppSelector(workspaceFormDescription)
  const formDefault = useAppSelector(workspaceFormUserDefault)
  const formPrivate = useAppSelector(workspaceFormPrivate)
  const formGlobalDefault = useAppSelector(workspaceFormGlobalDefault)
  const formWatchlist = useAppSelector(workspaceFormWatchlist)
  const formRelative = useAppSelector(workspaceFormRelativeDate)

  const currentConfig = useAppSelector(WSC_CurrentConfig)
  const relativeDate = useAppSelector(dateIndex)

  const submitHandler = async (e: any) => {
    e.preventDefault()
    if (formWatchlist) {
      if (Object.keys(currentConfig.viewers).length === 1) {
        if (currentConfig.master && currentConfig.master.length !== 0) {
          addToast({
            message:
              "You can't save a workspace as a watchlist view if it only contains a global filter view",
            intent: "danger"
          })
          return
        }
      } else {
        addToast({
          message:
            "You can't save a workspace as a watchlist view if it contains more than one view",
          intent: "danger"
        })
        return
      }
    }
    if (Object.keys(currentConfig.viewers).length === 0) {
      addToast({
        message: "No workspace to save",
        intent: "danger"
      })
      return
    }
    // THIS IS SO BAD DONT DO THIS
    const ws: any = window.document.querySelector("perspective-workspace")
    const haveNames: any = []
    ws?.shadowRoot
      ?.querySelectorAll(".p-TabBar-tab")
      .forEach((b: HTMLElement) => {
        const lab: any = b.querySelector(".p-TabBar-tabLabel")
        if (lab.getAttribute("value") !== "[untitled]") return
        const input: any = b.querySelectorAll("#label")[0]
        const oldBG = b.style.background
        b.style.background = "#fbb360"
        const i1 = setInterval(() => {
          b.style.background = oldBG
          setTimeout(() => {
            b.style.background = "#fbb360"
          }, 350)
        }, 700)

        setTimeout(() => {
          clearInterval(i1)
          b.style.background = oldBG
        }, 2000)
        // b.style.borderColor = "#fbb360"
        // b.style.border = '10px solid #ff00ff'
        haveNames.push(false)
        return
      })
    if (haveNames.includes(false)) {
      addToast({
        message: "All views must have a name",
        intent: "warning",
        icon: "warning-sign"
      })
      return
    }
    if (formName === "") {
      addToast({
        message: "All workspaces must have a name",
        intent: "warning"
      })
      return
    } else {
      await fetch("/api/workspace/", {
        body: JSON.stringify({
          name: formName,
          description: formDescription || "",
          default: formDefault,
          globalDefault: formGlobalDefault,
          private: formPrivate,
          workspace: currentConfig,
          watchlist: formWatchlist,
          relativeDate: dateIndexToString(relativeDate)
        }),
        method: "POST"
      })
        .then(function(response) {
          if (response.ok) {
            return response.json()
          }
          return response.json().then(function(json) {
            throw json
          })
        })
        .then(function(data) {
          addToast({
            message: "Saved workspace successfully",
            icon: "tick",
            intent: "success"
          })
          mutate("/api/workspace")
          dispatch(workspaceFormReset())
        })
        .catch(function(error) {
          if (error.error.code === "P2002") {
            addToast({
              message: "You already have a workspace with this name",
              icon: "error",
              intent: "danger"
            })
          }
        })
    }
  }
  return (
    <form
      autoComplete="off"
      onSubmit={submitHandler}
      style={{ padding: ".5em", minWidth: "290px" }}
    >
      <H5>Save Workspace</H5>

      {props.inputsActive && (
        <>
          <FormGroup
            label={
              <Flex style={{ justifyContent: "space-between", width: "100%" }}>
                <Flex style={{ gap: ".5em" }}>
                  Name
                  <Text className="bp4-text-muted">(required)</Text>
                </Flex>
                <Flex className="bp4-text-muted">{formName.length}/42</Flex>
              </Flex>
            }
            labelFor="name"
          >
            <InputGroup
              maxLength={42}
              autoFocus={true}
              value={formName}
              onChange={e => {
                dispatch(setName(e.target.value))
              }}
              required
              id="name"
              placeholder="Name new workspace"
            />
          </FormGroup>
          <FormGroup
            label={
              <Flex style={{ justifyContent: "space-between", width: "100%" }}>
                <Flex style={{ gap: ".5em" }}>
                  Description
                  <Text className="bp4-text-muted">(recommended)</Text>
                </Flex>
                <Flex className="bp4-text-muted">
                  {formDescription.length}/244
                </Flex>
              </Flex>
            }
            labelFor="description"
          >
            <TextArea
              placeholder="Describe this workspace in a few words"
              maxLength={244}
              style={{ fontSize: "1em", width: "100%" }}
              value={formDescription}
              onChange={e => dispatch(setDescription(e.target.value))}
              id="description"
              growVertically={true}
              large={true}
            />
          </FormGroup>
        </>
      )}
      {/**
       * @name Options
       */}
      <FormGroup label="Options">
        <Switch
          id="private"
          label="Private"
          innerLabelChecked="on"
          innerLabel="off"
          defaultChecked={formPrivate}
          onChange={() => dispatch(setPrivate(!formPrivate))}
        />
        <Switch
          id="default"
          label="User default"
          innerLabelChecked="on"
          innerLabel="off"
          defaultChecked={formDefault}
          onChange={() => dispatch(setUserDefault(!formDefault))}
        />
      </FormGroup>
      {/**
       * @name Relative-Date
       */}
      <FormGroup
        disabled={relativeDate === -1}
        label="Relative Date"
        labelFor="relativeDate"
        labelInfo={"(beta)"}
        helperText={`Set this if you dont want harcoded date filters`}
      >
        <Switch
          disabled={relativeDate === -1}
          id="relativeDate"
          label={
            relativeDate !== -1
              ? `Set ${dateIndexToString(relativeDate)} relatively`
              : `Relative Date`
          }
          innerLabelChecked="on"
          innerLabel="off"
          defaultChecked={formRelative}
          onChange={() => dispatch(setRelativeDate(!formRelative))}
        />
      </FormGroup>
      {/**
       * @name Watchlist-View
       */}
      <FormGroup
        label="Watchlist View"
        labelFor="watchlist"
        labelInfo="(beta)"
        helperText="We will loop over your watchlist with this view. "
      >
        <Switch
          id="watchlist"
          label="Watchlist View"
          innerLabelChecked="on"
          innerLabel="off"
          defaultChecked={formWatchlist}
          onChange={() => dispatch(setWatchlist(!formWatchlist))}
        />
      </FormGroup>
      {/**
       * @name Admin-Options
       */}
      {session && session.user && session.user.isAdmin && (
        <FormGroup label="Admin Options">
          <Switch
            id="globalDefault"
            label="Global Default"
            innerLabelChecked="on"
            innerLabel="off"
            defaultChecked={formGlobalDefault}
            onChange={() => dispatch(setGlobalDefault(!formGlobalDefault))}
          />
        </FormGroup>
      )}
      <FormGroup style={{ margin: 0 }}>
        <Button
          style={{ width: "100%" }}
          type="submit"
          text="save"
          icon="small-tick"
          intent="success"
        />
      </FormGroup>
    </form>
  )
}

export default SaveWorkSpaceForm
