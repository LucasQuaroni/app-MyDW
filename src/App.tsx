import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './components/Button'

function App() {
  const [count, setCount] = useState(0)
  const [second, setSecond] = useState(0)

  console.log("rendering App.jsx")
  console.log("count =", count)
  console.log("second =", second)

  useEffect(() => {
    console.log("useEffect called")
    const interval = setInterval(() => {
      setSecond((second) => second + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const memoSample = useMemo(() => <div>Memo Sample {Math.random()}</div>, [])
  console.log("memoSample =", memoSample)

  console.log("render")

  return (
    <>
      <h1>Frontend React</h1>
      <div className="card">
        <Button count={count} setCount={setCount} />
        <br />
        <br />
        <button onClick={() => setCount(0)}>
          Reset count
        </button>
      </div>
    </>
  )
}

export default App
