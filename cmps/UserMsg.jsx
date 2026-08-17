import { eventBusService } from '../services/event-bus.service.js'
const { useState, useEffect, useRef } = React

export function UserMsg() {

  const [msg, setMsg] = useState(null)
  const timeoutIdRef = useRef()

  useEffect(() => {
    const unsubscribe = eventBusService.on('show-user-msg', (msg) => {
      setMsg(msg)
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = null
      }
      timeoutIdRef.current = setTimeout(closeMsg, 3000)
    })
    return () => {
      unsubscribe()
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
    }
  }, [])

  function closeMsg() {
    setMsg(null)
  }
  if (!msg) return null

  return (
    <section
      className={`user-msg ${msg.type} open`}
      role={msg.type === 'error' ? 'alert' : 'status'}
      aria-live={msg.type === 'error' ? 'assertive' : 'polite'}
    >
      <span>{msg.txt}</span>
      <button type="button" aria-label="Dismiss message" onClick={closeMsg}>×</button>
    </section>
  )
}

