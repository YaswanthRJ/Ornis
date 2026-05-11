import React from "react"
import { Link } from "react-router-dom"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: "Home", path: "/" },
  { label: "Image", path: "/image" },
  { label: "Audio", path: "/audio" },
]

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0d2318] border-r border-white/10 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 border-b border-white/10 flex items-center px-4">
          <button
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={onClose}
              className="px-2 py-2 rounded-md text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}