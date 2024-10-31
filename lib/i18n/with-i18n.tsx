import i18n from "."

export const withI18n = (Component: any) => {
  return async (props: { params: Promise<any> }) => {
    const params = await props.params
    i18n.changeLanguage(params.lang)
    const newProps = { ...props, params }
    return <Component {...newProps} />
  }
}
