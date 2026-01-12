"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Activity, Plus, FileText, ChevronRight, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function HealthDashboard() {
  const [showCheckin, setShowCheckin] = useState(false)
  const [checkinData, setCheckinData] = useState({
    feeling: "",
    heartRate: "",
    bloodPressure: "",
    mood: "",
  })
  const [vitals, setVitals] = useState<{
    heartRate: string
    bloodPressure: string
    mood: string
    lastUpdated: string
  } | null>(null)

  const handleSubmitCheckin = (e: React.FormEvent) => {
    e.preventDefault()
    setVitals({
      heartRate: checkinData.heartRate,
      bloodPressure: checkinData.bloodPressure,
      mood: checkinData.mood,
      lastUpdated: "Today",
    })
    setShowCheckin(false)
    setCheckinData({ feeling: "", heartRate: "", bloodPressure: "", mood: "" })
  }

  const healthScore = vitals ? 75 : 0

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Health Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, here is your daily overview.</p>
        </div>
        <Button onClick={() => setShowCheckin(true)} className="bg-gray-900 hover:bg-gray-800 gap-2 hidden sm:flex">
          <Plus className="w-4 h-4" />
          Daily Check-in
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Status Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Overall Status</h2>
            {vitals && <span className="text-sm text-emerald-500 font-medium">Updated {vitals.lastUpdated}</span>}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Health Score Circle */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={healthScore > 50 ? "#10b981" : "#f59e0b"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${healthScore * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{healthScore}%</span>
                <span className="text-sm text-gray-500">{healthScore > 50 ? "Good" : "Critical"}</span>
              </div>
            </div>

            {/* AI Insight & Vitals */}
            <div className="flex-1 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-gray-900">AI Insight</span>
                </div>
                <p className="text-sm text-gray-600">
                  {vitals
                    ? "Your vitals are stable. Consistent heart rate observed. Consider increasing hydration today due to high temperature."
                    : "No vitals recorded yet. Complete your daily check-in to receive personalized insights."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Heart Rate</span>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {vitals?.heartRate || "--"} <span className="text-sm font-normal text-gray-500">bpm</span>
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">BP</span>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {vitals?.bloodPressure || "--"} <span className="text-sm font-normal text-gray-500">mmHg</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-900">Action Required</h2>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard/chat"
              className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-gray-900">Discuss symptoms</p>
              <p className="text-sm text-gray-500">Chat with Arodoc AI</p>
            </Link>
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="font-medium text-gray-900">Upcoming Vaccine</p>
              <p className="text-sm text-gray-500">Due in 5 days</p>
            </div>
          </div>

          <Link
            href="/dashboard/records"
            className="flex items-center justify-between p-4 mt-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Records</p>
                <p className="text-sm text-gray-500">3 New Reports</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Mobile Check-in Button */}
      <Button
        onClick={() => setShowCheckin(true)}
        className="sm:hidden fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gray-900 hover:bg-gray-800 shadow-lg z-30"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Daily Check-in Modal */}
      {showCheckin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Daily Check-in</h2>
              <button onClick={() => setShowCheckin(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCheckin} className="space-y-4">
              <div>
                <Label className="text-gray-700">How are you feeling today?</Label>
                <Textarea
                  placeholder="e.g. Mild headache, feeling energetic..."
                  className="mt-2 min-h-[100px]"
                  value={checkinData.feeling}
                  onChange={(e) => setCheckinData({ ...checkinData, feeling: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    placeholder="72"
                    className="mt-2"
                    value={checkinData.heartRate}
                    onChange={(e) =>
                      setCheckinData({
                        ...checkinData,
                        heartRate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Blood Pressure</Label>
                  <Input
                    type="text"
                    placeholder="120/80"
                    className="mt-2"
                    value={checkinData.bloodPressure}
                    onChange={(e) =>
                      setCheckinData({
                        ...checkinData,
                        bloodPressure: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Mood</Label>
                <Select
                  value={checkinData.mood}
                  onValueChange={(value) => setCheckinData({ ...checkinData, mood: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="okay">Okay</SelectItem>
                    <SelectItem value="tired">Tired</SelectItem>
                    <SelectItem value="stressed">Stressed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 gap-2">
                Log Vitals
                <Check className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
