"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Plus,
  Search,
  FileText,
  ImageIcon,
  File,
  X,
  Upload,
  ArrowLeft,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Record {
  id: string
  name: string
  type: "pdf" | "image" | "other"
  date: string
  size: string
  fileUrl: string
  fileData?: string
}

export function MedicalRecords() {
  const [records, setRecords] = useState<Record[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [uploadName, setUploadName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [viewingRecord, setViewingRecord] = useState<Record | null>(null)
  const [zoom, setZoom] = useState(100)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadName(file.name.split(".")[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile || !uploadName) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const fileData = e.target?.result as string
      const newRecord: Record = {
        id: Date.now().toString(),
        name: uploadName,
        type: selectedFile.type.includes("pdf") ? "pdf" : selectedFile.type.includes("image") ? "image" : "other",
        date: new Date().toLocaleDateString(),
        size: `${(selectedFile.size / 1024).toFixed(1)} KB`,
        fileUrl: URL.createObjectURL(selectedFile),
        fileData: fileData,
      }

      setRecords((prev) => [newRecord, ...prev])
      setShowUpload(false)
      setSelectedFile(null)
      setUploadName("")
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
    if (viewingRecord?.id === id) {
      setViewingRecord(null)
    }
  }

  const handleDownload = (record: Record) => {
    if (record.fileData) {
      const link = document.createElement("a")
      link.href = record.fileData
      link.download = `${record.name}.${record.type === "pdf" ? "pdf" : record.type === "image" ? "png" : "file"}`
      link.click()
    }
  }

  const filteredRecords = records.filter((record) => record.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-500" />
      default:
        return <File className="w-5 h-5 text-gray-500" />
    }
  }

  if (viewingRecord) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Document Viewer Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setViewingRecord(null)
                setZoom(100)
              }}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              {getIcon(viewingRecord.type)}
              <span className="font-medium text-gray-900">{viewingRecord.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom((prev) => Math.max(25, prev - 25))}
                disabled={zoom <= 25}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700 w-12 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom((prev) => Math.min(200, prev + 25))}
                disabled={zoom >= 200}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleDownload(viewingRecord)} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleDelete(viewingRecord.id)
              }}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Document Viewer Content */}
        <div className="flex-1 overflow-auto p-4">
          <div
            className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
            style={{
              width: viewingRecord.type === "image" ? "fit-content" : "100%",
              maxWidth: viewingRecord.type === "pdf" ? "900px" : undefined,
            }}
          >
            {viewingRecord.type === "image" ? (
              <img
                src={viewingRecord.fileData || viewingRecord.fileUrl}
                alt={viewingRecord.name}
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
                className="transition-transform"
              />
            ) : viewingRecord.type === "pdf" ? (
              <iframe
                src={viewingRecord.fileData || viewingRecord.fileUrl}
                className="w-full border-0"
                style={{
                  height: "calc(100vh - 160px)",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                  width: `${10000 / zoom}%`,
                }}
                title={viewingRecord.name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <File className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium">Preview not available</p>
                <p className="text-sm text-gray-400 mt-1">Click download to view this file</p>
              </div>
            )}
          </div>
        </div>

        {/* Document Info Footer */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-500">
          <span>Uploaded: {viewingRecord.date}</span>
          <span>Size: {viewingRecord.size}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 mt-1">Manage your prescriptions and lab reports.</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
          <Plus className="w-4 h-4" />
          Upload Record
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search records..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Records List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No records found</h2>
            <p className="text-sm text-gray-500">Upload your medical documents to keep them safe.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRecords.map((record) => (
              <div key={record.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getIcon(record.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{record.name}</p>
                  <p className="text-sm text-gray-500">
                    {record.date} • {record.size}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => setViewingRecord(record)}
                  >
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(record)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(record.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Record</h2>
              <button
                onClick={() => {
                  setShowUpload(false)
                  setSelectedFile(null)
                  setUploadName("")
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                {selectedFile ? (
                  <p className="text-sm text-emerald-600 font-medium">{selectedFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 font-medium">Click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </>
                )}
              </div>

              <div>
                <Label className="text-gray-700">Document Name</Label>
                <Input
                  type="text"
                  placeholder="e.g. Blood Test Report"
                  className="mt-2"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                />
              </div>

              <Button
                onClick={handleUpload}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={!selectedFile || !uploadName}
              >
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
