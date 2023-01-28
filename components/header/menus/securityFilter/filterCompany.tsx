/* eslint-disable react-hooks/exhaustive-deps */
import { Icon, Menu, MenuDivider, Text } from "@blueprintjs/core"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { mutate } from "swr"
import { fetcher } from "../../../layout"
import useSWRImmutable from "swr/immutable"
import { addToast } from "../../../../pages/_app"
import {
  WSC_CurrentConfig,
  WSC_setConfigSetter
} from "../../../../redux/workspaceControlSlice"
import ImageWithFallback from "../../../imageWithFallback"
import { MenuItem2 } from "@blueprintjs/popover2"
import { ItemListRenderer, ItemRenderer, Suggest2 } from "@blueprintjs/select"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import React from "react"
import { useInView } from "react-intersection-observer"
import { popoverOpen } from "../../../../redux/menuSlice"
import { Flex } from "../../../../stitches.config"

// Exports
function FilterCompanyMenu(props: { disabled: any }) {
  const dispatch = useAppDispatch()
  const currentConfig = useAppSelector(WSC_CurrentConfig)
  const [selectedItem, setSelectedItem] = useState<any>([])
  const { ref, inView } = useInView()
  const [query, setQuery] = useState<string>("")
  const popOverOpen = useAppSelector(popoverOpen)
  const inputRef = useRef<any>()
  const popRef = useRef<any>()
  const [open, setOpen] = useState<any>()
  const { data: recentFilters, error: rf_error } = useSWRImmutable(
    "/api/security/recent",
    fetcher
  )
  const { data: trendingFilter, error: tf_error } = useSWRImmutable(
    "/api/security/trending",
    fetcher
  )
  const { status, data, error, refetch, fetchNextPage }: any = useInfiniteQuery(
    ["security"],
    async ({ pageParam = 0 }) => {
      const res = await axios.get(
        "/api/security?cursor=" + pageParam + "&where=" + query
      )
      return res.data
    },
    {
      getPreviousPageParam: firstPage => firstPage.previusCursor ?? undefined,
      getNextPageParam: lastPage => lastPage.nextCursor ?? undefined
    }
  )
  const securities = useMemo(() => {
    return data?.pages
      .map((e: any, pageIndex: any) => {
        return e.data.map((e: any, dataIndex: any) => {
          if (e.index === undefined) e.index = pageIndex * 10 + dataIndex
          return e
        })
      })
      .flat()
  }, [data])
  const setRecentFilters = useCallback(async () => {
    await fetch("/api/security/recent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recentFilters: recentFilters,
        selectedItem: selectedItem
      })
    }).then(e => {
      mutate("/api/security/recent")
    })
  }, [recentFilters, selectedItem])

  const handleSubmitCF = useCallback(async () => {
    if (
      currentConfig === null ||
      Object.keys(currentConfig.viewers).length === 0
    ) {
      addToast({
        message: "No viewes found to apply this filter to",
        intent: "danger",
        icon: "error"
      })
      setSelectedItem([])
      return
    }
    let currentCopy = structuredClone(currentConfig)
    if (currentCopy.viewers !== undefined) {
      Object.keys(currentCopy.viewers).map((key: any) => {
        const filtered = currentCopy.viewers[key].filter.filter(
          (element: any) => {
            if (element[0] !== "ticker") return element
          }
        )
        currentCopy.viewers[key].filter = filtered
        currentCopy.viewers[key].filter.push([
          "ticker",
          "==",
          selectedItem.ticker
        ])
      })
      addToast({
        message: "Setting filter to ticker " + selectedItem.ticker,
        intent: "warning",
        icon: "signal-search"
      })
      dispatch(WSC_setConfigSetter(currentCopy))
    } else {
      addToast({
        message: "No viewes found to apply this filter to",
        intent: "danger",
        icon: "error"
      })
    }
  }, [selectedItem, currentConfig])

  useEffect(() => {
    setOpen(false)
  }, [popOverOpen])

  useEffect(() => {
    if (selectedItem.ticker !== undefined) {
      handleSubmitCF()
      setRecentFilters()
    }
  }, [selectedItem])

  useEffect(() => {
    if (query) refetch()
  }, [query])
  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView])

  if (!recentFilters) return <div>loading</div>
  const secItemListRenderer: ItemListRenderer<any> = ({
    items,
    renderItem
  }) => {
    if (query === "") {
      return (
        <Flex className="gap-5">
          <Menu className="p-1">
            <MenuDivider title="Recent Searches" className="pb-1" />
            {recentFilters.data !== undefined &&
              recentFilters.data.map((e: any, index: any) => {
                return (
                  <MenuItem2
                    className="flex"
                    key={index}
                    onClick={() => setSelectedItem(e)}
                    icon={
                      e.hasImg === true ? (
                        <ImageWithFallback hasImage={true} alt={e.ticker} />
                      ) : (
                        <ImageWithFallback hasImage={false} alt={e.ticker} />
                      )
                    }
                    text={<Text className="w-full">{e.ticker}</Text>}
                  />
                )
              })}
            {recentFilters.data === undefined && (
              <MenuItem2 disabled text="No recent searches" />
            )}
          </Menu>
          <Menu>
            <MenuDivider title="Trending Searches" className="pb-1" />
            {trendingFilter &&
              trendingFilter.data.map((e: any, index: any) => {
                return (
                  <MenuItem2
                    key={index}
                    className="flex"
                    onClick={() => setSelectedItem(e)}
                    labelElement={
                      <Flex>
                        <Icon icon="flame" />
                        {e._count.recentFilter > 1 ? e._count.recentFilter : ""}
                      </Flex>
                    }
                    icon={
                      e.hasImg === true ? (
                        <ImageWithFallback hasImage={true} alt={e.ticker} />
                      ) : (
                        <ImageWithFallback hasImage={false} alt={e.ticker} />
                      )
                    }
                    text={<Text className="w-full">{e.ticker}</Text>}
                  />
                )
              })}
            {trendingFilter && trendingFilter.data.length === 0 && (
              <MenuItem2 disabled text="No trending searches" />
            )}
          </Menu>
        </Flex>
      )
    }
    if (items.length === 0) {
      return (
        <Menu>
          <MenuItem2 disabled text="No result" icon="error" />
        </Menu>
      )
    }
    return (
      <div>
        <Menu id={"menuRef"} className="max-h-[300px] overflow-auto">
          <React.Fragment>
            {items.map((e: any, index: any) => renderItem(e, index))}
          </React.Fragment>
          <div ref={ref}></div>
        </Menu>
      </div>
    )
  }
  const renderItem: ItemRenderer<any> = (e, modifiers) => {
    return (
      <div data-id={e.index} key={modifiers.index}>
        <MenuItem2
          active={modifiers.modifiers.active}
          onClick={modifiers.handleClick}
          className="flex"
          labelElement={
            <Text className="max-w-[200px]" ellipsize={true}>
              {e.name}{" "}
            </Text>
          }
          icon={
            e.hasImg === true ? (
              <ImageWithFallback hasImage={true} alt={e.ticker} />
            ) : (
              <ImageWithFallback hasImage={false} alt={e.ticker} />
            )
          }
          text={<Text className="w-full">{e.ticker}</Text>}
        />
      </div>
    )
  }

  return (
    <>
      <div>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "error" ? (
          <span>Error: {error?.message}</span>
        ) : (
          <Suggest2
            className="mt-[0px] ml-[1px] filterSec"
            scrollToActiveItem={true}
            popoverProps={{
              minimal: true,
              isOpen: open,
              onInteraction: e => setOpen(e)
            }}
            inputValueRenderer={(i: any) => i.ticker}
            onQueryChange={setQuery}
            selectedItem={selectedItem}
            itemListRenderer={secItemListRenderer}
            itemRenderer={(active: any, handleClick: any) =>
              renderItem(active, handleClick)
            }
            items={securities}
            inputProps={{
              placeholder: "Security filter",
              inputRef: inputRef
            }}
            popoverRef={popRef}
            onItemSelect={(i, e) => {
              e?.preventDefault()
              setSelectedItem(i)
            }}
          />
        )}
      </div>
    </>
  )
}

export default FilterCompanyMenu
