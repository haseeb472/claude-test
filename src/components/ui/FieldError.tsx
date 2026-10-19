import { useState } from 'react'
import { Collapse } from './Collapse'

interface FieldErrorProps {
  id: string
  message?: string
}

// Slides open under a field. It keeps the last message while closing, so the
// text does not disappear before the space has finished collapsing.
export function FieldError({ id, message }: FieldErrorProps) {
  const [lastMessage, setLastMessage] = useState(message ?? '')

  if (message && message !== lastMessage) setLastMessage(message)

  return (
    <Collapse open={Boolean(message)}>
      <p
        id={id}
        role={message ? 'alert' : undefined}
        className="pt-1 text-small text-red-600"
      >
        {lastMessage}
      </p>
    </Collapse>
  )
}
