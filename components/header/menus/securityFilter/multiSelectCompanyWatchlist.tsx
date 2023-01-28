/* eslint-disable react-hooks/exhaustive-deps */
import { Intent, Menu, TagProps, Text } from "@blueprintjs/core"
import { useAppDispatch } from "../../../../redux/hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { mutate } from "swr"
import { addToast } from "../../../../pages/_app"

import ImageWithFallback from "../../../imageWithFallback"
import { MenuItem2 } from "@blueprintjs/popover2"
import {
  ItemListRenderer,
  ItemRenderer,
  MultiSelect2
} from "@blueprintjs/select"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import React from "react"
import { useInView } from "react-intersection-observer"
import { Flex } from "../../../../stitches.config"

// Exports
function MultiSelectCompanyWatchlist(props: any) {
  const dispatch = useAppDispatch()
  const { ref, inView } = useInView()
  const [selectedItems, setSelectedItems] = useState<any>([])
  const [query, setQuery] = useState<string>("")

  useEffect(() => {
    setSelectedItems(props.selectedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  const updateSecs = useCallback(
    async (watchlist: any, newy: any, type: number) => {
      await fetch(`/api/watchlist/${watchlist.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: watchlist.id,
          type: type, // 0 connect, 1 disconnect
          data: {
            addremove: newy
          }
        })
      })
        .then(async (res: any) => {
          mutate("/api/watchlist")
          addToast({ message: "Watchlist updated", intent: "success" })
        })
        .catch(err => {
          console.log(err)
        })
      // setWorkspaces(workspaces.filter((ws: { id: string; }) => ws.id !== id))
    },
    []
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

  function getSelectedCompanyIndex(company: any) {
    return selectedItems.indexOf(company)
  }

  function isCompanySelected(company: any) {
    return getSelectedCompanyIndex(company) !== -1
  }

  function handleCompanySelect(company: any) {
    if (!isCompanySelected(company)) {
      setSelectedItems([...selectedItems, company])
    } else {
      setSelectedItems(selectedItems.filter((item: any) => item !== company))
    }

    updateSecs(props.watchlist, [company], 0)
    // after change we should save watchlist
  }

  useEffect(() => {
    if (query) refetch()
  }, [query])
  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView])

  const secItemListRenderer: ItemListRenderer<any> = ({
    items,
    renderItem
  }) => {
    if (items.length === 0 || query === "") {
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

  function deselectCompany(index: number) {
    setSelectedItems(selectedItems.filter((_: any, i: number) => i !== index))
    updateSecs(
      props.watchlist,
      selectedItems.filter((_: any, i: number) => i === index),
      1
    )
  }

  function handleTagRemove(_tag: React.ReactNode, index: number) {
    deselectCompany(index)
  }

  const getTagProps = (_value: React.ReactNode, index: number): TagProps => ({
    intent: Intent.NONE,
    minimal: true
  })

  const renderItem: ItemRenderer<any> = (e, modifiers) => {
    return (
      <div data-id={e.index} key={modifiers.index}>
        <MenuItem2
          shouldDismissPopover={false}
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

  const tagRenderer = (e: any) => (
    <Flex className="mr-1 justify-center items-center gap-2">
      <div>
        <ImageWithFallback
          alt={e.ticker}
          hasImage={e.hasImg}
          inwatchlist={true}
        />
      </div>
      <div>{e.ticker}</div>
    </Flex>
  )

  return (
    <>
      <div>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "error" ? (
          <span>Error: {error?.message}</span>
        ) : (
          <MultiSelect2
            className={props.className}
            tagRenderer={tagRenderer}
            popoverProps={{
              minimal: true
            }}
            resetOnQuery={true}
            resetOnSelect={true}
            onQueryChange={setQuery}
            itemListRenderer={secItemListRenderer}
            itemRenderer={(active: any, handleClick: any) =>
              renderItem(active, handleClick)
            }
            items={securities}
            selectedItems={selectedItems}
            onItemSelect={handleCompanySelect}
            tagInputProps={{
              placeholder: "Select Security",
              onRemove: handleTagRemove,
              tagProps: getTagProps
            }}
          />
        )}
      </div>
    </>
  )
}

export default MultiSelectCompanyWatchlist
