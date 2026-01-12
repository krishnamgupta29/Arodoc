"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Calendar, LogOut, Edit2, X, Check, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserProfile {
  name: string
  email: string
  memberSince: number
  age?: string
  gender?: string
  bloodGroup?: string
  height?: string
  weight?: string
  allergies?: string[]
  chronicDiseases?: string[]
  emergencyContact?: string
}

export function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    const storedUser = localStorage.getItem("arodoc_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...editData }
      setUser(updatedUser)
      localStorage.setItem("arodoc_user", JSON.stringify(updatedUser))
      setEditMode(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("arodoc_user")
    router.push("/")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0).toLowerCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 text-gray-500">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member since {user.memberSince}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-red-500 border-red-200 hover:bg-red-50 gap-2 bg-transparent"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
            {editMode ? (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditMode(false)}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={handleSave}>
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="text-emerald-600"
                onClick={() => {
                  setEditData(user)
                  setEditMode(true)
                }}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    placeholder="25"
                    className="mt-1"
                    value={editData.age || ""}
                    onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={editData.gender || ""}
                    onValueChange={(value) => setEditData({ ...editData, gender: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Blood Group</Label>
                <Select
                  value={editData.bloodGroup || ""}
                  onValueChange={(value) => setEditData({ ...editData, bloodGroup: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="170"
                    className="mt-1"
                    value={editData.height || ""}
                    onChange={(e) => setEditData({ ...editData, height: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="70"
                    className="mt-1"
                    value={editData.weight || ""}
                    onChange={(e) => setEditData({ ...editData, weight: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <DetailRow label="Age" value={user.age || "--"} />
              <DetailRow label="Gender" value={user.gender || "--"} />
              <DetailRow label="Blood Group" value={user.bloodGroup || "--"} />
              <DetailRow label="Height" value={user.height || "--"} />
              <DetailRow label="Weight" value={user.weight || "--"} />
            </div>
          )}
        </div>

        {/* Medical Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Medical Info</h2>

          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Allergies</span>
              <div className="mt-2 bg-green-50 rounded-lg px-3 py-2">
                <span className="text-sm text-green-700">
                  {user.allergies?.length ? user.allergies.join(", ") : "None"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Chronic Diseases</span>
              <div className="mt-2 bg-amber-50 rounded-lg px-3 py-2">
                <span className="text-sm text-amber-700">
                  {user.chronicDiseases?.length ? user.chronicDiseases.join(", ") : "None"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Emergency Contact</span>
              <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{user.emergencyContact || "--"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}
