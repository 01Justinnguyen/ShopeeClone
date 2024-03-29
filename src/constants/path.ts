const path = {
  home: '/',
  login: '/login',
  user: '/user',
  register: '/register',
  logout: '/logout',
  cart: '/cart',
  productDetail: ':nameId',
  profile: '/user/profile',
  changePassword: '/user/change-password',
  historyPurchase: '/user/history-purchase'
} as const

export default path
