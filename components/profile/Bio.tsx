'use client'
import React from 'react'
import { useUniqueUrl } from '@/hooks/useUniqueUrl'



function Bio() {
    const { uniqueUrl } = useUniqueUrl();
  return (
    <div>
        {uniqueUrl}
    </div>
  )
}

export default Bio