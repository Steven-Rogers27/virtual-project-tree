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

/**
 * 清除聚合树缓存历史节点
 * @param params
 */
export async function httpGetClearRecentIdInfos(params: VirtualProjectTreeNamespace.HttpGetHomePageTreeParameterParams) {
	try {
		// res.code: 0 成功
		return await http.request({
			method: 'get',
			url: '/admin/login/userBusinessTreeApp/clearRecentIdInfos',
			params,
		})
	} catch (error) {
		return {}
	}
}

/**
 * 获取缓存节点历史
 * @param params
 */
export async function httpGetAppRecentIdInfos(params: VirtualProjectTreeNamespace.HttpGetHomePageTreeParameterParams) {
	try {
		const res = await http.request({
			method: 'get',
			url: '/admin/login/userBusinessTreeApp/appRecentIdInfos',
			params,
		})
		return res.data
	} catch (error) {
		return []
	}
}

/**
 * 存入历史选择节点
 * @param params
 */
export async function httpPostPutSoleNodeSelected(params: VirtualProjectTreeNamespace.HttpGetHomePageTreeParameterParams, data: Record<string, any>) {
	try {
		return await http.request({
			method: 'post',
			url: '/admin/login/userBusinessTreeApp/putSoleNodeSelected',
			params,
			data,
		})
	} catch (error) {
		return {}
	}
}
