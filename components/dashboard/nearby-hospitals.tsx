"use client"

import { useState, useEffect } from "react"
import { Phone, Navigation, Star, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Hospital {
  id: string
  name: string
  address: string
  distance: string
  rating: number
  phone: string
}

export function NearbyHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching nearby hospitals
    const fetchHospitals = async () => {
      try {
        // Check for geolocation permission
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            () => {
              // Success - load sample hospitals
              setTimeout(() => {
                setHospitals([
                  {
                    id: "1",
                    name: "City General Hospital",
                    address: "123 Main St",
                    distance: "0.5 km away",
                    rating: 4.5,
                    phone: "+91-1234567890",
                  },
                  {
                    id: "2",
                    name: "Saint Mary's Clinic",
                    address: "456 Oak Ave",
                    distance: "1.2 km away",
                    rating: 4.2,
                    phone: "+91-9876543210",
                  },
                  {
                    id: "3",
                    name: "Community Health Center",
                    address: "789 Pine Ln",
                    distance: "2.5 km away",
                    rating: 4.0,
                    phone: "+91-5555555555",
                  },
                  {
                    id: "4",
                    name: "Emergency Care Unit",
                    address: "101 Cedar Blvd",
                    distance: "3.0 km away",
                    rating: 4.8,
                    phone: "+91-4444444444",
                  },
                ])
                setLoading(false)
              }, 1000)
            },
            () => {
              // Error - still show sample data
              setLocationError("Location access denied. Showing sample hospitals.")
              setHospitals([
                {
                  id: "1",
                  name: "City General Hospital",
                  address: "123 Main St",
                  distance: "0.5 km away",
                  rating: 4.5,
                  phone: "+91-1234567890",
                },
                {
                  id: "2",
                  name: "Saint Mary's Clinic",
                  address: "456 Oak Ave",
                  distance: "1.2 km away",
                  rating: 4.2,
                  phone: "+91-9876543210",
                },
                {
                  id: "3",
                  name: "Community Health Center",
                  address: "789 Pine Ln",
                  distance: "2.5 km away",
                  rating: 4.0,
                  phone: "+91-5555555555",
                },
                {
                  id: "4",
                  name: "Emergency Care Unit",
                  address: "101 Cedar Blvd",
                  distance: "3.0 km away",
                  rating: 4.8,
                  phone: "+91-4444444444",
                },
              ])
              setLoading(false)
            },
          )
        } else {
          setLocationError("Geolocation not supported")
          setLoading(false)
        }
      } catch {
        setLocationError("Failed to fetch hospitals")
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [])

  const handleNavigate = (hospital: Hospital) => {
    const query = encodeURIComponent(hospital.name + " " + hospital.address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Nearby Hospitals</h1>
        <p className="text-gray-500 mt-1">Find emergency care near your current location.</p>
      </div>

      {locationError && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-700">{locationError}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-500">Finding nearby hospitals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                  <p className="text-sm text-gray-500">{hospital.address}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-amber-700">{hospital.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-emerald-600 mb-4">
                <Navigation className="w-4 h-4" />
                <span className="text-sm">{hospital.distance}</span>
              </div>

              <div className="flex gap-3">
                <a href={`tel:${hospital.phone}`} className="flex-1">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 gap-2">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </a>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => handleNavigate(hospital)}
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
