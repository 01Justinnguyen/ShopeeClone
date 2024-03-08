import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useAppContext } from '@/contexts/app.context'
import AuthenticateLayout from '@/layouts/AuthenticateLayout'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import PageNotFound from '@/pages/PageNotFound'
import ProductList from '@/pages/ProductList'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'
import path from '@/constants/path'
import ProductDetail from '@/pages/ProductDetail'

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
      index: true,
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
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
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
    },
    {
      path: '*',
      element: <PageNotFound />
    }
  ])
  return routeElement
}
