import axios from 'axios'
import {config} from '@/config'
export const getInstance = (serverUrl:string)=>{
	const instance = axios.create({
		baseURL: serverUrl,
		// withCredentials: true,
		timeout: 30000,
	})
	// 添加请求拦截器
	instance.interceptors.request.use(
		function (config) {
			// 在发送请求之前做些什么
			// debugger
			return config
		},
		function (error) {
			// 对请求错误做些什么
			// debugger
			return Promise.reject(error)
		}
	)
	// 添加响应拦截器
	instance.interceptors.response.use(
		function (response) {
			// 2xx 范围内的状态码都会触发该函数。
			// 对响应数据做点什么
			if(response.config.baseURL === config.ethServerUrl){
				return response.data
			}
			return response
		},
		function (error) {
			// 超出 2xx 范围的状态码都会触发该函数。
			// 对响应错误做点什么
			const {status, data, headers} = error.response
			// debugger
			// if(status!==200 ){
				return Promise.reject(error)
			// }
				// if (Array.isArray(data) && data.length > 0) {
				// 	ElMessage.error(data[0].message)
				// } else if(data.message) {
				// 	ElMessage.error(data.message)
				// } else {
				// 	ElMessage.error(error.message)
				// }
		}
	)
	return instance
}

