import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './components/Button'
import { useAuth } from './contexts/AuthContext'
import AuthTokenDisplay from './components/AuthTokenDisplay'

function App() {
  const [count, setCount] = useState(0)
  const [second, setSecond] = useState(0)
  const { currentUser, logout } = useAuth()

  console.log("rendering App.jsx")
  console.log("count =", count)
  console.log("second =", second)
  console.log("currentUser =", currentUser)

  useEffect(() => {
    console.log("useEffect called")
    const interval = setInterval(() => {
      setSecond((second) => second + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    console.log("Auth state changed:", currentUser ? currentUser.email : "No user")
  }, [currentUser])

  const memoSample = useMemo(() => <div>Memo Sample {Math.random()}</div>, [])
  console.log("memoSample =", memoSample)

  console.log("render")

  const handleLogout = async () => {
    try {
      await logout()
      console.log("Logout successful")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <>
      <h1>Frontend React</h1>
      
      {/* Sección de Autenticación */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Estado de Autenticación</h2>
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">✅ Autenticado</p>
              <p className="text-sm text-green-700 mt-1">
                Email: <span className="font-mono">{currentUser.email}</span>
              </p>
              <p className="text-sm text-green-700">
                UID: <span className="font-mono text-xs">{currentUser.uid}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-gray-800 font-medium">❌ No autenticado</p>
              <p className="text-sm text-gray-600 mt-1">
                Inicia sesión o regístrate para continuar
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Contenido original */}
      <div className="card">
        <Button count={count} setCount={setCount} />
        <br />
        <br />
        <button onClick={() => setCount(0)}>
          Reset count
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Tiempo transcurrido: {second} segundos
        </p>
      </div>

      {/* Información de prueba */}
      {currentUser && (
        <div className="card mt-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">🔐 Token de Autenticación</h3>
          <p className="text-sm text-blue-800 mb-4">
            Este token se puede usar para autenticar peticiones al backend.
            Revisa <code className="bg-blue-100 px-1 rounded">src/utils/auth.ts</code> para ver cómo obtenerlo programáticamente.
          </p>
          <AuthTokenDisplay />
        </div>
      )}
    </>
  )
}

export default App
