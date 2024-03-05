import { useEffect } from 'react'
import useRouteElement from './routes/useRouteElement'
import { LocalStorageEventTarget } from './utils/auth'
import { useAppContext } from './contexts/app.context'

function App() {
  const routeElements = useRouteElement()
  const { reset } = useAppContext()
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return <>{routeElements}</>
}

export default App
