"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  MapPin,
  User,
  Menu,
  X,
  LogOut,
  Activity,
  AlertTriangle,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/chat", label: "Arodoc AI", icon: MessageSquare },
  { href: "/dashboard/records", label: "Records", icon: FileText },
  { href: "/dashboard/nearby", label: "Nearby", icon: MapPin },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSOS, setShowSOS] = useState(false)

  useEffect(() => {
    // Check auth
    const user = localStorage.getItem("arodoc_user")
    if (!user) {
      router.push("/auth")
    }
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("arodoc_user")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col z-40">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Arodoc</span>
          </Link>
        </div>

        <nav className="flex-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors",
                  isActive ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 space-y-2">
          <Button
            variant="destructive"
            className="w-full gap-2 bg-red-500 hover:bg-red-600"
            onClick={() => setShowSOS(true)}
          >
            <AlertTriangle className="w-4 h-4" />
            EMERGENCY SOS
          </Button>
          <Button variant="ghost" className="w-full gap-2 text-gray-600" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Arodoc</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 flex items-center justify-between border-b">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Arodoc</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors",
                  isActive ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 border-t">
          <Button
            variant="destructive"
            className="w-full gap-2 bg-red-500 hover:bg-red-600"
            onClick={() => {
              setSidebarOpen(false)
              setShowSOS(true)
            }}
          >
            <AlertTriangle className="w-4 h-4" />
            EMERGENCY SOS
          </Button>
          <Button variant="ghost" className="w-full gap-2 text-gray-600" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                  isActive ? "text-emerald-500" : "text-gray-500",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
          <button onClick={() => setShowSOS(true)} className="flex flex-col items-center gap-1 px-3 py-2 text-red-500">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center -mt-4 shadow-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium">SOS</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-24 lg:pb-0">{children}</main>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Emergency SOS</h2>
              <p className="text-gray-500 text-sm mt-1">Select an emergency service</p>
            </div>

            <div className="space-y-3">
              <a
                href="tel:108"
                className="flex items-center gap-4 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ambulance</p>
                  <p className="text-sm text-gray-500">Call 108</p>
                </div>
              </a>
              <a
                href="tel:112"
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Police</p>
                  <p className="text-sm text-gray-500">Call 112</p>
                </div>
              </a>
              <a
                href="tel:101"
                className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Fire</p>
                  <p className="text-sm text-gray-500">Call 101</p>
                </div>
              </a>
            </div>

            <Button variant="outline" className="w-full mt-6 bg-transparent" onClick={() => setShowSOS(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
