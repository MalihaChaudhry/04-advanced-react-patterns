// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import {createContext, useContext, useState} from 'react'
import {Switch} from '../switch'

const ToggleContext = createContext()

function Toggle({children}) {
  const [on, setOn] = useState(false)
  const toggle = () => setOn(!on)

  console.log({children})

  return (
    <ToggleContext.Provider value={{on, toggle}}>
      {children}
    </ToggleContext.Provider>
  )
}

const useToggle = () => {
  const context = useContext(ToggleContext)
  if (context === undefined)
    throw new Error(
      'Component must be in Toggle Component to have access to ToggleContext',
    )
  else return context
}

function ToggleOn({children}) {
  const {on} = useToggle()
  return on ? children : null
}

function ToggleOff({children}) {
  const {on} = useToggle()
  return on ? null : children
}

function ToggleButton({...props}) {
  const {on, toggle} = useToggle()
  return <Switch on={on} onClick={toggle} {...props} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
