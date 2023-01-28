/* eslint-disable react-hooks/exhaustive-deps */
import { Intent, Menu, TagProps, Text } from "@blueprintjs/core"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { useEffect, useMemo, useState } from "react"
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
import {
  setSelectedCompanies,
  watchlistFromSelectedItems
} from "../../../../redux/watchlistFromSlice"
import { Flex } from "../../../../stitches.config"

// Exports
function MultiSelectCompany() {
  const dispatch = useAppDispatch()
  const { ref, inView } = useInView()
  const selectedItems: any = useAppSelector(watchlistFromSelectedItems)
  const [query, setQuery] = useState<string>("")

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

  function getSelectedCompanyIndex(company: any) {
    return selectedItems.indexOf(company)
  }
  function isCompanySelected(company: any) {
    return getSelectedCompanyIndex(company) !== -1
  }
  function handleCompanySelect(company: any, event: any) {
    event.preventDefault()
    if (!isCompanySelected(company)) {
      dispatch(setSelectedCompanies([...selectedItems, company]))
    } else {
      dispatch(
        setSelectedCompanies(
          selectedItems.filter((item: any) => item !== company)
        )
      )
    }
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
  function deselectCompany(index: number) {
    dispatch(
      setSelectedCompanies(
        selectedItems.filter((_: any, i: number) => i !== index)
      )
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

  return (
    <>
      <div>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "error" ? (
          <span>Error: {error?.message}</span>
        ) : (
          <MultiSelect2
            tagRenderer={e => {
              return (
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
            }}
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

export default MultiSelectCompany
