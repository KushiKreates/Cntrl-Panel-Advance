"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Http from "@/lib/Http"

interface MotdData {
  enabled: boolean
  message: string
  app_name: string
}

const Motd = () => {
  const [motd, setMotd] = useState<MotdData | null>(null)
  const user = window.ssr?.props?.user

  useEffect(() => {
    Http.get<MotdData>("/api/motd")
      .then((data) => setMotd(data))
      .catch((err) => console.error("Failed to fetch MOTD", err))
  }, [])

  if (!motd || !motd.enabled) return null

  return (
    <Card className="w-full mb-6 overflow-hidden rounded-xl shadow-2xl bg-transparent">
      <CardContent className="p-2">
        <h3 className="text-xl font-bold mb-2"></h3>
        {/* Wrap the MOTD HTML in a container we can style */}
        <div className="motd-message" dangerouslySetInnerHTML={{ __html: motd.message }} />
        {user && (
          <p className="mt-4 text-sm text-muted-foreground">
            Welcome back, {user.name}!
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default Motd