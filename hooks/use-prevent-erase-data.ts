import { useCallback, useState } from "react"

type Props = {
  onClose: () => void
  shouldSave: boolean
}

const usePreventEraseData = (props: Props) => {
  const { onClose, shouldSave } = props

  const [visible, setVisible] = useState<boolean>(false)

  const onCloseSecure = useCallback(() => {
    if (shouldSave) {
      setVisible(true)
      return
    }
    onClose()
  }, [onClose, shouldSave])

  const onCloseFromModal = useCallback(
    (exit: boolean) => {
      setVisible(false)
      if (exit) {
        onClose()
      }
    },
    [onClose]
  )

  return {
    preventEraseDataVisible: visible,
    onCloseSecure,
    onCloseFromModal,
  }
}

export default usePreventEraseData
