import React, { useCallback, useContext, useEffect, useReducer } from "react"
import "./DebugBox.css"

const filterObject = (obj, key) =>
  Object.keys(obj)
    .filter((k) => k !== key)
    .reduce((newObj, k) => ({ ...newObj, [k]: obj[k] }), {})

const reducer = (state, action) => {
  const { type, payload } = action
  const { key, value } = payload

  switch (type) {
    case `UNSUBSCRIBE`:
      return filterObject(state, key)
    case `UPDATE`:
      return {
        ...state,
        [key]: value,
      }
    default:
      return state
  }
}

const DebugContext = React.createContext(null)

export const DebugContextProvider = ({ children, boxStyles }) => {
  const [trackedValues, dispatch] = useReducer(reducer, {})
  const valuesExist = JSON.stringify(trackedValues) !== "{}"

  return (
    <>
      {valuesExist && (
        <DebugBox boxStyles={boxStyles} trackedValues={trackedValues} />
      )}
      <DebugContext.Provider value={{ dispatch }}>
        {children}
      </DebugContext.Provider>
    </>
  )
}

const DebugBox = ({ trackedValues, boxStyles }) => (
  <div className="debug-box" style={boxStyles}>
    {Object.entries(trackedValues).map(([key, value]) => (
      <div key={key}>
        {key} — {value}
      </div>
    ))}
  </div>
)

export const useDebug = (key, value) => {
  const { dispatch } = useContext(DebugContext)

  const unsubscribe = useCallback(() => {
    dispatch({ type: `UNSUBSCRIBE`, payload: { key, value: null } })
  }, [key, dispatch])

  useEffect(() => {
    dispatch({ type: `UPDATE`, payload: { key, value } })
  }, [key, value, dispatch])

  return unsubscribe
}
