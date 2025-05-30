import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { interceptorLoadingElements } from '~/utils/formatters'

/**
 * Không thể import {store} from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm InjectStore ngay lập tức để gắn biến mainStore vào biến axiosReduxStore cục bộ trong file này
 */
let axiosReduxStore

export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}

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

// Khởi tạo một cái promise cho việc gọi Api refresh_token
// Mục đích tạo Promise này để khi nào gọi Api refresh_token xong xuôi thì mới retry lại nhiều Api bị lỗi trước đó
let refreshTokenPromise = null

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

    /* Xử lý Refresh Token tự động */
    // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì sẽ gọi API đăng xuất luôn
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi API refresh token để làm mới lại accessToken
    // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
    const originalRequests = error.config
    // console.log('🚀 ~ originalRequests:', originalRequests)
    if (error.response?.status === 410 && !originalRequests._retry) {
      //Gắn thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi một lần tại một thời điểm
      originalRequests._retry = true

      // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện việc gọi api refresh_token đồng thời gắn cho cái refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // Đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE)
            return data?.accessToken
          })
          .catch((_error) => {
            // Nếu nhận bất kỳ lỗi nào từ API refresh token thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            // Dù API có ok hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null
          })
      }

      // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây
      return refreshTokenPromise.then((accessToken) => {
        /**
         * B1: đối với trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây
         * Hiện tại ở đây không cần B1 này vì chúng ta đã đưa accessToken vào cookie (xử lý ở BE) sau khi api refreshToken được gọi thành công
         */

        // B2: Bước quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
        return authorizedAxiosInstance(originalRequests)
      })
    }

    // Xử lý tập trung phần hiển thị lỗi trả về từ mọi API ở đây (viết code một lần: Clean code)
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
