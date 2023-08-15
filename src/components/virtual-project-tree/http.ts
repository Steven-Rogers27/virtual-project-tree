export let http: VirtualProjectTree.Axios
export const registerAxios = (axios: VirtualProjectTree.Axios) => {
  http = axios 
}

export async function httpGetSubSystemTree(params: VirtualProjectTree.HttpGetSubSystemTreeParams) {
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

export async function httpGetHomePageTreeParameter(params: VirtualProjectTree.HttpGetHomePageTreeParameterParams) {
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