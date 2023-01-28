import { Button, FormGroup, H5, InputGroup, Switch } from "@blueprintjs/core"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { fetcher } from "../../layout"
import useSWRImmutable from "swr/immutable"
import MultiSelectCompany from "../menus/securityFilter/multiSelectCompany"
import {
  resetAll,
  setName,
  setPrivate,
  watchlistFromName,
  watchlistFromPrivate,
  watchlistFromSelectedItems,
} from "../../../redux/watchlistFromSlice"
import { addToast } from "../../../pages/_app"
import { useSWRConfig } from "swr"

function SaveWatchlistForm() {
  const dispatch = useAppDispatch()
  const { mutate } = useSWRConfig()

  const selectedItems: any = useAppSelector(watchlistFromSelectedItems)
  const formName = useAppSelector(watchlistFromName)
  const formPrivate = useAppSelector(watchlistFromPrivate)

  const submitHandler = useCallback(async () => {
    if (selectedItems.length === 0) {
      addToast({
        message: "Select at least one company",
        intent: "danger",
        icon: "error",
      })
      return
    }
    if (formName === "") {
      addToast({
        message: "Name or description is empty",
        intent: "danger",
        icon: "error",
      })
      return
    }
    await fetch("/api/watchlist", {
      body: JSON.stringify({
        name: formName,
        companies: selectedItems.map((company: any) => company.ticker),
        private: formPrivate,
      }),
      method: "POST",
    })
      .then(function (response) {
        if (response.ok) {
          return response.json()
        }
        return response.json().then(function (json) {
          throw json
        })
      })
      .then(async (e) => {
        mutate("/api/watchlist")
        addToast({
          message: "Saved Watchlist successfully",
          intent: "success",
          icon: "tick",
        })
        dispatch(resetAll())
      })
      .catch((e) => {
        if (e.error.code === "P2002") {
          addToast({
            message: "You already have a Watchlist with this name",
            icon: "error",
            intent: "danger",
          })
          return
        }
        addToast({ message: "error while saving", intent: "danger" })
        return
      })
  }, [dispatch, formName, formPrivate, mutate, selectedItems])

  return (
    <form autoComplete="off" className="p-1 w-[270px]">
      <H5>Create Watchlist</H5>
      <FormGroup
        label="Name"
        labelFor="text-input"
        labelInfo="(required)"
        helperText={`${formName.length}/42`}
      >
        <InputGroup
          maxLength={42}
          required
          id="name"
          value={formName}
          onChange={(e: any) => dispatch(setName(e.target.value))}
          placeholder="Name Watchlist"
        />
      </FormGroup>
      <FormGroup
        style={{ width: "100%" }}
        label="Securities"
        labelFor="text-input"
        labelInfo="(required)"
      >
        <MultiSelectCompany />
      </FormGroup>
      <FormGroup label="Options">
        <Switch
          id="private"
          label="Private"
          defaultChecked={formPrivate}
          innerLabelChecked="on"
          innerLabel="off"
          value={formPrivate ? "on" : "off"}
          onChange={() => dispatch(setPrivate(!formPrivate))}
        />
      </FormGroup>
      <FormGroup style={{ margin: "0 0 0 0" }}>
        <Button
          style={{ width: "100%" }}
          type="button"
          text="save"
          icon="small-tick"
          onClick={(e) => {
            e.preventDefault()
            submitHandler()
          }}
        />
      </FormGroup>
    </form>
  )
}
export default SaveWatchlistForm
