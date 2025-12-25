'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle, Upload, ShieldAlert } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Link from 'next/link'

const EXAMPLE_JSON = `[
  {
    "category": "General Aptitude",
    "topic": "Problems on Trains",
    "questions": [
      {
        "text": "A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?",
        "options": [
           { "text": "65 sec", "isCorrect": false },
           { "text": "89 sec", "isCorrect": true },
           { "text": "100 sec", "isCorrect": false },
           { "text": "150 sec", "isCorrect": false }
        ],
        "explanation": "Speed = 240/24 = 10 m/s. Required time = (240 + 650) / 10 = 89 sec."
      }
    ]
  }
]`

export default function BulkImportPage() {
  const { user } = useAuthStore()
  const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [resultMsg, setResultMsg] = useState('')

  const handleImport = async () => {
    try {
      setStatus('loading')
      setResultMsg('')

      // Validate JSON first
      let parsedData
      try {
        parsedData = JSON.parse(jsonInput)
      } catch {
        setStatus('error')
        setResultMsg('Invalid JSON format. Please check your syntax.')
        return
      }

      const res = await fetch('/api/admin/bulk-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsedData }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setResultMsg(data.message)
      } else {
        setStatus('error')
        setResultMsg(data.error || 'Import failed.')
      }
    } catch (err: unknown) {
      setStatus('error')
      setResultMsg(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  // Access Control (Frontend check, API does real check)
  if (!user || !['admin', 'superadmin'].includes(user.roles?.[0] || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">You need Admin privileges to access this tool.</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Upload className="w-8 h-8 text-blue-600" /> Bulk Import
            </h1>
            <p className="text-slate-500 mt-1">Add multiple topics and questions at once.</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="text-sm font-medium text-slate-700">JSON Input</div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => setJsonInput(EXAMPLE_JSON)}
            >
              Reset Example
            </Button>
          </div>

          <div className="p-6">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="font-mono text-sm h-[400px] mb-6"
              placeholder="Paste your JSON here..."
            />

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                {status === 'loading' && (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />{' '}
                    Processing...
                  </span>
                )}
                {status === 'success' && (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" /> {resultMsg}
                  </span>
                )}
                {status === 'error' && (
                  <span className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" /> {resultMsg}
                  </span>
                )}
              </div>
              <Button
                onClick={handleImport}
                disabled={status === 'loading'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {status === 'loading' ? 'Importing...' : 'Run Import'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">Help & Guide</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Paste a JSON array of Topic objects.</li>
            <li>
              Each object must have <code>topic</code> and <code>questions</code>.
            </li>
            <li>
              Questions must have <code>text</code>, <code>options</code> (with isCorrect), and{' '}
              <code>explanation</code>.
            </li>
            <li>Existing topics will be reused; new topics will be created automatically.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
