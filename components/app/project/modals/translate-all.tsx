import { createPortal } from "react-dom"

import i18n from "@/lib/i18n"

type Props = {
  // progress is from 0 to 1
  progress: number | undefined
  cancel: () => void
}

const TranslateAllModal = (props: Props) => {
  const { progress, cancel } = props

  return (
    <div>
      {progress !== undefined &&
        createPortal(
          <div
            className="bg-[#f1f5f9] absolute flex flex-col z-50 shadow-xl"
            style={{
              top: "80px",
              right: "151px",
              borderRadius: "5px",
              minWidth: "200px",
              maxWidth: "450px",
              padding: "14px 10px",
              borderWidth: "1px",
            }}
          >
            <div className="flex flex-row w-full justify-between items-center">
              <p className="h3" style={{ padding: "10px 6px" }}>
                {i18n.t("Translation in progress...")}
              </p>
              <div
                className={`noselect bg-[#f84444] text-white flex items-center hover:cursor-pointer ml-6`}
                style={{
                  padding: "6.5px 16px",
                  borderRadius: "117px",
                  height: "fit-content",
                }}
                onClick={() => {
                  if (progress !== undefined) {
                    cancel()
                  }
                }}
              >
                <p className="pd-h2 pd-bold pd-white">{i18n.t("Cancel")}</p>
              </div>
            </div>
            <div style={{ marginLeft: "6px", marginTop: "14px" }}>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-[#0f172a] h-2.5 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default TranslateAllModal
