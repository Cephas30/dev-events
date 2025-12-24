'use client'
import posthog from 'posthog-js'
import Image from 'next/image'
import React from 'react'

const ExploreBtn = () => {
  return (
    <button
      type="button"
      onClick={() => {
        posthog.capture('explore_events_button_clicked', { scroll_target: 'events' })
        console.log("Explore button clicked")
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
      }}
      className="
        mt-7 mx-auto flex items-center gap-2
        bg-orange-600 text-white
        px-6 py-3 rounded-full
        hover:bg-orange-700 transition
      "
    >
      Explore Events
      <Image
        src="/icons/arrow-down.svg"
        alt="arrow-down"
        width={24}
        height={24}
      />
    </button>
    
  )
}

export default ExploreBtn
