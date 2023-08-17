export let http: VirtualProjectTreeNamespace.Axios
export const registerAxios = (axios: VirtualProjectTreeNamespace.Axios) => {
  http = axios
}

export async function httpGetSubSystemTree(params: VirtualProjectTreeNamespace.HttpGetSubSystemTreeParams) {
  try {
    const res = await http.request({
      method: 'get',
      url: '/admin/login/userBusinessTreeApp/subSystemTree',
      params,
    })

    return res.data
  } catch (error) {
    return []
  }
}

export async function httpGetHomePageTreeParameter(params: VirtualProjectTreeNamespace.HttpGetHomePageTreeParameterParams) {
  try {
    const res = await http.request({
      method: 'get',
      url: '/admin/login/userBusinessTreeApp/homePageTreeParameter',
      params,
    })
    return res.data
  } catch (error) {
    return {}
  }
}
