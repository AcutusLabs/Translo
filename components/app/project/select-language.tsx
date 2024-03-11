import * as React from "react"
import { Language } from "@/store/useI18nState"

import i18n from "@/lib/i18n"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectLanguageProps = {
  languageSelected?: string
  languages: Language[]
  onChangeLanguage: (short: string) => void
}

const SelectLanguage = (props: SelectLanguageProps) => {
  const { languageSelected, languages, onChangeLanguage } = props

  return (
    <Select value={languageSelected} onValueChange={onChangeLanguage}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={i18n.t("Select the language")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{i18n.t("Languages")}</SelectLabel>
          {languages.map((language) => (
            <SelectItem
              key={language.short}
              value={language.short}
              className="hover:cursor-pointer"
            >
              {language.lang}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectLanguage
