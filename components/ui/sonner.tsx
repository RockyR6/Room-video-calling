"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: '#000',
          color: '#fff',
          border: 'none'
        },
        className: 'bg-black text-white border-none'
      }}
      {...props}
    />
  )
}

export { Toaster }