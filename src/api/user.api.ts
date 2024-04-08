import { User } from '@/types/user.types'
import { SuccessResponseApi } from '@/types/utils.types'
import http from '@/utils/http'

interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

const UserApi = {
  getProfile() {
    return http.get<SuccessResponseApi<User>>('/me')
  },

  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponseApi<User>>('/user', body)
  },

  uploadAvatar(body: FormData) {
    return http.post<SuccessResponseApi<string>>('/user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default UserApi
