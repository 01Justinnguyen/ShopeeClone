import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useAppContext } from '@/contexts/app.context'
import AuthenticateLayout from '@/layouts/AuthenticateLayout'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import PageNotFound from '@/pages/PageNotFound'
import ProductList from '@/pages/ProductList'
import Register from '@/pages/Register'
import path from '@/constants/path'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import CartLayout from '@/layouts/CartLayout'
import UserLayout from '@/pages/User/layouts/UserLayout'
import ChangePassword from '@/pages/User/pages/ChangePassword'
import HistoryPurchases from '@/pages/User/pages/HistoryPurchases'
import Profile from '@/pages/User/pages/Profile'

function ProtectedRoute() {
  const { isAuthenticated } = useAppContext()
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
  const { isAuthenticated } = useAppContext()
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: '*',
      index: true,
      element: <PageNotFound />
    },
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout></UserLayout>
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchases />
            }
          ]
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        }
      ]
    },

    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <AuthenticateLayout>
              <Login />
            </AuthenticateLayout>
          )
        },
        {
          path: path.register,
          element: (
            <AuthenticateLayout>
              <Register />
            </AuthenticateLayout>
          )
        }
      ]
    }
  ])
  return routeElement
}
