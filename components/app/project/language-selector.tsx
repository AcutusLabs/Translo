import { startTransition, useMemo, useState } from "react"
import { languages as allLanguages } from "@/constants/languages"
import { Language } from "@/store/useI18nState"
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react"
import * as RadixSelect from "@radix-ui/react-select"
import { Check, ChevronDown, Search } from "lucide-react"
import { matchSorter } from "match-sorter"

type Props = {
  currentLanguages: Language[]
  selectedLanguage?: string
  setSelectedLanguage: (language: string) => void
}

export const LanguageSelector = (props: Props) => {
  const { currentLanguages, selectedLanguage, setSelectedLanguage } = props
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const languages = useMemo(() => {
    return allLanguages.filter(
      (language) =>
        !currentLanguages.map((lang) => lang.short).includes(language.code)
    )
  }, [currentLanguages])

  const matches = useMemo(() => {
    if (!searchValue) return languages
    const keys = ["englishName", "value", "name"]
    const matches = matchSorter(languages, searchValue, { keys })
    // Radix Select does not work if we don't render the selected item, so we
    // make sure to include it in the list of matches.
    const queryLanguage = languages.find(
      (lang) => lang.code === selectedLanguage
    )
    if (queryLanguage && !matches.includes(queryLanguage)) {
      matches.push(queryLanguage)
    }
    return matches
  }, [languages, searchValue, selectedLanguage])

  return (
    <RadixSelect.Root
      value={selectedLanguage}
      onValueChange={setSelectedLanguage}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxProvider
        open={open}
        setOpen={setOpen}
        resetValueOnHide
        includesBaseElement={false}
        setValue={(value) => {
          startTransition(() => {
            setSearchValue(value)
          })
        }}
      >
        <RadixSelect.Trigger
          aria-label="Language"
          className="inline-flex h-10 items-center justify-between gap-1 rounded bg-white text-black shadow px-4"
        >
          <RadixSelect.Value placeholder="Select a language" />
          <RadixSelect.Icon>
            <ChevronDown size={20} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Content
          role="dialog"
          aria-label="Languages"
          position="popper"
          className="z-50 max-h-[min(var(--radix-select-content-available-height),336px)] bg-white shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.25),0_4px_6px_-4px_rgb(0_0_0_/_0.1)] rounded-lg"
        >
          <div className="relative flex items-center pb-0 p-1">
            <div className="pointer-events-none absolute text-[hsl(204_4%_0%_/_0.6)] left-2.5">
              <Search size={15} />
            </div>
            <Combobox
              autoSelect
              placeholder="Search languages"
              className="appearance-none rounded bg-[hsl(204_4%_0%_/_0.05)] text-black outline-none outline-offset-2 h-9 text-[15px] pl-7 pr-2 w-full"
              // Ariakit's Combobox manually triggers a blur event on virtually
              // blurred items, making them work as if they had actual DOM
              // focus. These blur events might happen after the corresponding
              // focus events in the capture phase, leading Radix Select to
              // close the popover. This happens because Radix Select relies on
              // the order of these captured events to discern if the focus was
              // outside the element. Since we don't have access to the
              // onInteractOutside prop in the Radix SelectContent component to
              // stop this behavior, we can turn off Ariakit's behavior here.
              onBlurCapture={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
            />
          </div>
          <ComboboxList className="overflow-y-auto p-1">
            {matches.map(({ englishName, code, flag }) => (
              <RadixSelect.Item
                key={code}
                value={code}
                asChild
                className="relative flex h-10 cursor-default items-center rounded text-black outline-none outline-offset-2 px-7 scroll-my-1 data-[active-item]:bg-violet-200"
              >
                <ComboboxItem>
                  <RadixSelect.ItemText>
                    <span className="text-lg mr-2">{flag}</span> {englishName}
                  </RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute left-1.5">
                    <Check size={15} />
                  </RadixSelect.ItemIndicator>
                </ComboboxItem>
              </RadixSelect.Item>
            ))}
          </ComboboxList>
        </RadixSelect.Content>
      </ComboboxProvider>
    </RadixSelect.Root>
  )
}
