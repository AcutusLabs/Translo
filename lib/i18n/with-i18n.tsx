import i18n from "."

export const withI18n = (Component: any) => {
  return (props) => {
    i18n.changeLanguage(props.params.lang)
    return <Component {...props} />
  }
}
