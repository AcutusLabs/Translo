"use client"

import { useCallback, useMemo, useState } from "react"
import { autocompleteI18nObject } from "@/external_api/autocompleteI18nObject"
import { I18n, useI18nState } from "@/store/useI18nState"
import {
  Button,
  HStack,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react"
import { useMutation } from "react-query"

export const MainTable = () => {
  const { i18n, addTranslation, addKey, reset, setI18n } = useI18nState()
  const [newKey, setNewKey] = useState("")
  const [pauseAutocomplete, setPauseAutocomplete] = useState(false)

  const handleAddKey = useCallback(() => {
    if (newKey) {
      addKey(newKey.toLowerCase().split(" ").join("-"))
      setNewKey("")
    }
  }, [newKey, addKey])

  console.log(i18n)

  const setChatGPTPause = () => {
    setPauseAutocomplete(true)
    setTimeout(() => {
      setPauseAutocomplete(false)
    }, 10000)
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => await autocompleteI18nObject(i18n),
    onSuccess: (data: I18n) => {
      console.log("success", data)
      setI18n(data)
      setChatGPTPause()
    },
    onError: (error) => {
      console.error(error)
      setChatGPTPause()
    },
  })

  const autocomplete = useCallback(() => {
    mutate()
  }, [mutate])

  const autocompleteButtonText = useMemo(() => {
    if (isLoading) {
      return <Spinner />
    }
    return pauseAutocomplete ? "need to recharge ChatGPT..." : "Autogenerate"
  }, [isLoading, pauseAutocomplete])

  const downloadFile = useCallback(() => {
    const fileName = "i18n"
    const json = JSON.stringify(i18n, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const href = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = href
    link.download = fileName + ".json"
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  }, [i18n])

  return (
    <VStack>
      <Table>
        <Thead>
          <Tr>
            <Th>Key</Th>
            {Object.entries(i18n).map(([language]) => (
              <Th key={language}>{language}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(i18n.english).map((tag) => (
            <Tr key={tag}>
              <Td>{tag}</Td>
              {Object.entries(i18n).map(([language, translations]) => (
                <Td key={language}>
                  <Input
                    value={translations[tag] || ""}
                    onChange={(e) => {
                      addTranslation(language, tag, e.target.value)
                    }}
                  ></Input>
                </Td>
              ))}
            </Tr>
          ))}
          <Tr>
            <Td>
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              ></Input>
            </Td>
            <Td>
              <Button
                onClick={handleAddKey}
                colorScheme="green"
                disabled={!newKey}
              >
                Add key
              </Button>
            </Td>
            {Array.from(Array(Object.keys(i18n).length - 1).keys()).map(
              (index) => (
                <Td key={index} />
              )
            )}
          </Tr>
        </Tbody>
      </Table>
      <HStack>
        <Button onClick={reset} colorScheme="red" m={4}>
          Reset
        </Button>
        <Button
          onClick={autocomplete}
          colorScheme="purple"
          m={4}
          disabled={pauseAutocomplete || isLoading}
        >
          {autocompleteButtonText}
        </Button>
        <Button onClick={downloadFile} colorScheme="blue" m={4}>
          Download
        </Button>
      </HStack>
    </VStack>
  )
}
