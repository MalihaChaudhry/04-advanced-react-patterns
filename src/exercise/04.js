// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import {useState} from 'react'
import {Switch} from '../switch'

function useToggle() {
  const [on, setOn] = useState(false)
  const toggle = () => setOn(!on)

  const getTogglerProps = ({onClick, ...props} = {}) => {
    return {
      'aria-label': on,
      onClick: toggle,
      ...props,
    }
  }
  return {on, toggle, getTogglerProps}
}

function App() {
  const {on, getTogglerProps} = useToggle()
  return (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button
        {...getTogglerProps({
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
          id: 'custom-button-id',
        })}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
