import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo đối tượng Axios (AuthorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của một request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép Axios tự động gửi cookie trong mỗi request lên BE (Phục vụ việc chúng ta sẽ lưu JWT Token (refresh & access) vào httpOnly Cookie của trình duyệt
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình Interceptors (Bộ đánh chặn giữa mọi Request & Response)
// request interceptor : can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// response interceptor: can thiệp vào giữa những cái response nhận về
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)

    //Bất kỳ mã trạng thái nào nằm ngoài phạm vi 2xx là error sẽ rơi vào đây
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }
    // Dùng toast để hiển thị mọi mã lỗi lên màn hình trừ 410 - GONE phục vụ việc refresh lại token
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
