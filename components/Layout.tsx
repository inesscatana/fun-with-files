import React from 'react'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar or Header */}
      <header className="bg-blue-600 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <h2 className="text-white text-2xl font-bold">Time Capsule</h2>
          <nav className="space-x-4">
            <Link href="/" className="text-white font-semibold hover:underline">
              Home
            </Link>
            <Link
              href="/upload"
              className="text-white font-semibold hover:underline"
            >
              Upload
            </Link>
            <Link
              href="/gallery"
              className="text-white font-semibold hover:underline"
            >
              View Capsule
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col justify-center container mx-auto py-8 px-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 py-4">
        <div className="text-center text-white">
          <p className="text-sm">
            Time Capsule &copy; {new Date().getFullYear()}. Capture, Share, and
            Preserve Memories.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
