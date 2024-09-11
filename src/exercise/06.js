// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useWarning(controlPropValue) {
  const isControlled = controlPropValue != null
  const {current: wasControlled} = React.useRef(isControlled)
  React.useEffect(() => {
    warning(
      !(isControlled && !wasControlled),
      'You are changing from a uncontrolled to controlled component.',
    )
    warning(
      !(!isControlled && wasControlled),
      'You are changing from a controlled to uncontrolled component.',
    )
  }, [isControlled, wasControlled])
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  readOnly = false,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onIsControlled = controlledOn != null && controlledOn !== undefined

  console.log({
    from: 'useToggle',
    onIsControlled,
    initialOn,
    controlledOn,
    initialState,
    state,
  })

  // 🦉 "Suggested changes" refers to: the changes we would make if we were
  // managing the state ourselves. This is similar to how a controlled <input />
  // `onChange` callback works. When your handler is called, you get an event
  // which has information about the value input that _would_ be set to if that
  // state were managed internally.
  // So how do we determine our suggested changes? What code do we have to
  // calculate the changes based on the `action` we have here? That's right!
  // The reducer! So if we pass it the current state and the action, then it
  // should return these "suggested changes!"
  //
  // 💰 Sorry if Olivia the Owl is cryptic. Here's what you need to do for that onChange call:
  // `onChange(reducer({...state, on}, action), action)`
  // 💰 Also note that users don't *have* to pass an `onChange` prop (it's not required)
  // so keep that in mind when you call it! How could you avoid calling it if it's not passed?
  const on = onIsControlled ? controlledOn : state.on

  useWarning(controlledOn)

  const includesOnChange = Boolean(onChange)
  React.useEffect(() => {
    warning(
      !(!includesOnChange && onIsControlled && !readOnly),
      'You cannot pass onChange without also passing an on variable.',
    )
  }, [includesOnChange, onIsControlled, readOnly])

  const dispatchWithOnChange = action => {
    if (!onIsControlled) {
      dispatch(action)
    }
    onChange?.(reducer({...state, on}, action), action)
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, initialOn, reducer, readOnly}) {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    initialOn,
    reducer,
    readOnly,
  })

  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
