import React from "react"

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 text-center text-sm text-white/40">
      © {new Date().getFullYear()} Ornis
    </footer>
  )
}