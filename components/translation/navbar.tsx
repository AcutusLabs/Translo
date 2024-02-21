"use client"

import {
  HStack,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { FaMoon, FaSun } from "react-icons/fa"

export const Navbar = () => {
  const { toggleColorMode } = useColorMode()
  return (
    <HStack
      boxShadow="md"
      position="static"
      top={0}
      right={0}
      align={"center"}
      justify={"space-between"}
      gap={0}
      p={4}
    >
      <Heading fontSize={"14px"}>Fast Json I18n</Heading>
      <IconButton
        aria-label="Mode Change"
        variant="empty"
        colorScheme="black"
        icon={useColorModeValue(<FaMoon />, <FaSun />)}
        onClick={toggleColorMode}
      />
    </HStack>
  )
}
