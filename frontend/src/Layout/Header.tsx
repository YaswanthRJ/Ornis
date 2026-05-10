import React from "react"

interface HeaderProps {
  onMenuToggle: () => void
  isSidebarOpen: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isSidebarOpen,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a1e12]/90 backdrop-blur-md border-b border-white/10">
      <button
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
        className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col justify-center gap-1 w-9 h-9 p-2 rounded-md hover:bg-white/5 transition"
      >
        <span
          className={`h-[1.5px] bg-white rounded transition ${
            isSidebarOpen ? "translate-y-1.25 rotate-45" : ""
          }`}
        />
        <span
          className={`h-[1.5px] bg-white rounded transition ${
            isSidebarOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-[1.5px] bg-white rounded transition ${
            isSidebarOpen ? "-translate-y-1.25 -rotate-45" : ""
          }`}
        />
      </button>

      <div className="h-full flex items-center justify-center">
        <h1 className="text-lg font-semibold tracking-wide text-white">
          Ornis
        </h1>
      </div>
    </header>
  )
}