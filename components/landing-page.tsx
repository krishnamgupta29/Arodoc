"use client"

import type React from "react"

import Link from "next/link"
import {
  ArrowRight,
  Stethoscope,
  Shield,
  Activity,
  ChevronDown,
  MessageSquare,
  MapPin,
  Bell,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingPage() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Arodoc</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={scrollToFeatures}
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Features
              </button>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                How It Works
              </a>
              <a href="#why-arodoc" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                Why Arodoc
              </a>
            </nav>
            <Link href="/auth">
              <Button variant="outline" className="rounded-full bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Your Personal AI
            <span className="block text-emerald-500">Health Companion</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Instant diagnosis support, real-time health monitoring, and emergency SOS response — powered by advanced AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="text-gray-700 rounded-full px-8 gap-2"
              onClick={scrollToFeatures}
            >
              Learn More
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features-section" className="mt-24 max-w-6xl mx-auto scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to take control of your health, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Stethoscope className="w-6 h-6 text-emerald-500" />}
              title="AI Analysis"
              description="Chat with Arodoc to understand symptoms and get personalized health advice instantly."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-emerald-500" />}
              title="Health Records"
              description="Securely store and organize lab reports, prescriptions, and medical history."
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-emerald-500" />}
              title="Live Monitoring"
              description="Track daily vitals and get alerted immediately if something looks wrong."
            />
          </div>
        </div>

        <div id="how-it-works" className="mt-32 max-w-6xl mx-auto scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get started in just a few simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Sign Up"
              description="Create your free account in seconds with just your email."
            />
            <StepCard
              number="2"
              title="Add Your Profile"
              description="Enter basic health info like allergies, conditions, and emergency contacts."
            />
            <StepCard
              number="3"
              title="Chat with AI"
              description="Describe your symptoms and get instant health guidance from Arodoc AI."
            />
            <StepCard
              number="4"
              title="Track & Monitor"
              description="Log daily vitals and receive personalized health insights."
            />
          </div>
        </div>

        <div id="why-arodoc" className="mt-32 max-w-6xl mx-auto scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Arodoc?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Trusted by thousands for reliable health assistance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard
              icon={<MessageSquare className="w-5 h-5 text-emerald-500" />}
              title="24/7 AI Support"
              description="Get health advice anytime, day or night."
            />
            <BenefitCard
              icon={<MapPin className="w-5 h-5 text-emerald-500" />}
              title="Find Nearby Help"
              description="Locate hospitals and clinics near you instantly."
            />
            <BenefitCard
              icon={<Bell className="w-5 h-5 text-emerald-500" />}
              title="Emergency SOS"
              description="One-tap emergency alert with your location."
            />
            <BenefitCard
              icon={<Heart className="w-5 h-5 text-emerald-500" />}
              title="Privacy First"
              description="Your health data stays secure and private."
            />
          </div>
        </div>

        <div className="mt-32 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
            <p className="text-emerald-50 mb-8 max-w-xl mx-auto">
              Join thousands of users who trust Arodoc for their daily health needs.
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-full px-8 gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <footer className="mt-24 pt-12 border-t border-gray-200">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Arodoc</span>
            </div>
            <p className="text-sm text-gray-500">
              2024 Arodoc. For informational purposes only. Always consult a doctor.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors">
      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  )
}
