import React, { useEffect, useState } from "react"
import "./App.css"
import { DebugContextProvider, useDebug } from "./useDebug"

function App() {
  const [showing, setShowing] = useState(true)

  return (
    <DebugContextProvider>
      <div className="App">
        <div className="buttons">
          <button onClick={() => setShowing(!showing)}>
            {showing ? `Hide and unsub` : `Reveal and sub`}
          </button>
          {showing && <Click id={1} />}
          <Click id={2} />
          <Click id={3} />
        </div>
        <Scroll />
        <Time />
      </div>
    </DebugContextProvider>
  )
}

function Click({ id }) {
  const [count, setCount] = useState(0)
  const unsubscribe = useDebug(`count-${id}`, count)

  useEffect(() => unsubscribe, [unsubscribe])

  return <button onClick={() => setCount(count + 1)}>Click {id}</button>
}

function Scroll() {
  const [scrollPos, setScrollPos] = useState(null)
  useDebug("scroll", scrollPos)
  const listener = () => setScrollPos(window.scrollY)
  useEffect(() => {
    window.addEventListener(`scroll`, listener)
    return () => window.removeEventListener(`scroll`, listener)
  }, [])
  return <div style={{ height: `120vh` }}></div>
}

function Time() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  useDebug("time", time)
  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
  }, [])
  return null
}

export default App
