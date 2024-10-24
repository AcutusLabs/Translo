export const getParamsApiCreateProject = (title: string = "test") => {
  const data = JSON.stringify({
    title,
  })

  return data
}
