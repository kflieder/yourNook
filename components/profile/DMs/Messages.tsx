import React from 'react'
import { useLiveMessages } from '@/useLiveMessages'


function Messages({threadId}: {threadId: string}) {
  const messages = useLiveMessages(threadId)
  console.log(messages, "messages in Messages component");
  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.sender}</strong>: {message.content}
        </div>
      ))}
    </div>
  )
}

export default Messages
