import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenResponse } from '@/types/auth.types'
import { clearDataFromLS, getTokenFromLS, setProfileToLS, setTokenToLS } from './auth'
import { AUTH_URL } from '@/api/auth.api'
import { isAxiosExpiredTokenErrors, isAxiosUnauthorizedErrors } from './utils'

class Http {
  instante: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getTokenFromLS('access_token')
    this.refreshToken = getTokenFromLS('refresh_token')
    this.refreshTokenRequest = null
    this.instante = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60, // 10s
        'expire-refresh-token': 60 * 60 // 1 giờ
      }
    })

    this.instante.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instante.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === AUTH_URL.URL_LOGIN || url === AUTH_URL.URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token

          setTokenToLS('access_token', this.accessToken)
          setTokenToLS('refresh_token', this.refreshToken)
          setProfileToLS(data.data.user)
        } else if (url === AUTH_URL.URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearDataFromLS()
        }
        return response
      },
      (error: AxiosError) => {
        console.log('🐻 ~ Http ~ constructor ~ error:', error)
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        // Lỗi Unauthorized: 401 có rất nhiều trường hợp
        // 1. Token không đúng
        // 2. Không truyền token
        // 3. Token hết hạn

        // Nếu lỗi 401
        if (isAxiosUnauthorizedErrors(error)) {
          const config = error.response && error.response.config
          const url = config?.url
          // Trường hợp Token hết hạn và request đó không phải là của request refresh_token thì chúng ta mới tiến hành gọi refresh-token
          if (isAxiosExpiredTokenErrors(error) && url !== AUTH_URL.URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  this.refreshTokenRequest = null
                })

            return this.refreshTokenRequest.then((access_token) => {
              if (config && config.headers) config.headers.Authorization = access_token
              // Ý là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instante(config as any)
            })
          }
          clearDataFromLS()
          this.accessToken = ''
          this.refreshToken = ''
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instante
      .post<RefreshTokenResponse>(AUTH_URL.URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setTokenToLS('access_token', access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((err) => {
        clearDataFromLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw err
      })
  }
}

const http = new Http().instante

export default http
