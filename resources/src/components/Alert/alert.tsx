"use client"

import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import ssr from "@/lib/ssr"

interface AlertData {
  enabled: boolean
  type: string
  message: string
}

const MAX_CHAR = 512

const AppAlert: React.FC = () => {
  // Get the alertData from SSR; adjust this if you have a different access method
  const alertData: AlertData | undefined = ssr.get("alertData")

  if (!alertData || !alertData.enabled) {
    return null
  }

  // Determine if the message needs to be truncated
  const showReadMore = alertData.message.length > MAX_CHAR
  const truncatedMessage = showReadMore
    ? alertData.message.slice(0, MAX_CHAR) + "..."
    : alertData.message

  // Map alert types to Tailwind color classes (adjust the colors as needed)
  const typeColors: Record<string, string> = {
    danger: "bg-red-50 text-red-700 border-red-300",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-300",
    info: "bg-blue-50 text-blue-700 border-blue-300",
    success: "bg-green-50 text-green-700 border-green-300",
  }
  const alertClasses = typeColors[alertData.type] || "bg-gray-50 text-gray-700 border-gray-300"

  return (
    <div className={`border-l-4 p-4 ${alertClasses} rounded-md my-4`}>
      <div className="flex justify-between items-start">
        <div>
          <AlertTitle className="font-bold">Alert</AlertTitle>
          <AlertDescription
            className="mt-1"
            dangerouslySetInnerHTML={{ __html: truncatedMessage }}
          />
        </div>
        {showReadMore && (
          <Dialog>
            <DialogTrigger asChild>
              <Button  size="sm" className="ml-4">
                Read More
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-3">Alert Details</DialogTitle>
                <DialogDescription
                  dangerouslySetInnerHTML={{ __html: alertData.message }}
                />
              </DialogHeader>
              <DialogClose asChild>
                <Button >Close</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default AppAlert