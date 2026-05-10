import React, { useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Footer } from "./Footer"


interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1e12] text-[#e8f0ea]">
      <Header
        onMenuToggle={() => setIsSidebarOpen((p) => !p)}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 pt-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}