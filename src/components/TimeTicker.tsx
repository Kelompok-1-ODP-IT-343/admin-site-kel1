"use client"

import { useEffect, useState } from "react"

// Lightweight, self-contained time display that won't re-render the whole page
export default function TimeTicker() {
  const [dateTime, setDateTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      let formatted = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      }).format(now)

      formatted = formatted
        .replace(/\s?pukul\s?/gi, " | ")
        .replaceAll(",", " |")
        .replaceAll(".", ":")
        .trim()

      setDateTime(formatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return <span className="font-medium">{dateTime}</span>
}
