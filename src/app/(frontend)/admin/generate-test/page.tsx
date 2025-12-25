'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Wand2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'

export default function TestGeneratorPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    examType: 'ibps',
    duration: 60,
    hasSectionalTimer: false,
    sections: [
      {
        name: 'Quantitative Aptitude',
        subject: 'quant',
        count: 20,
        sectionDuration: 20,
        difficulty: 'any',
        examTag: 'any',
      },
      {
        name: 'Reasoning Ability',
        subject: 'reasoning',
        count: 20,
        sectionDuration: 20,
        difficulty: 'any',
        examTag: 'any',
      },
      {
        name: 'English Language',
        subject: 'english',
        count: 20,
        sectionDuration: 20,
        difficulty: 'any',
        examTag: 'any',
      },
    ],
  })

  // Access Control
  if (!user || !['admin', 'superadmin'].includes(user.roles?.[0] || '')) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>
  }

  const handleSectionChange = (idx: number, field: string, value: any) => {
    const newSections = [...formData.sections]
    newSections[idx] = { ...newSections[idx], [field]: value }
    setFormData({ ...formData, sections: newSections })
  }

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          name: 'New Section',
          subject: 'quant',
          count: 10,
          sectionDuration: 0,
          difficulty: 'any',
          examTag: 'any',
        },
      ],
    })
  }

  const removeSection = (idx: number) => {
    const newSections = formData.sections.filter((_, i) => i !== idx)
    setFormData({ ...formData, sections: newSections })
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        alert(`Success! Test "${formData.title}" created with ${data.questionCount} questions.`)
        router.push('/admin/collections/mock-tests')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Wand2 className="w-8 h-8 text-violet-600" /> AI Test Generator
          </h1>
          <Link href="/admin">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admin
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Test Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. IBPS RRB Clerk Full Mock 1"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Exam Type</label>
                <Select
                  value={formData.examType}
                  onValueChange={(v) => setFormData({ ...formData, examType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ibps">IBPS PO/Clerk</SelectItem>
                    <SelectItem value="ssc">SSC CGL/CHSL</SelectItem>
                    <SelectItem value="rrb">Railway</SelectItem>
                    <SelectItem value="state">State Exams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Total Duration (mins)</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sections & Blueprint</CardTitle>
              <Button size="sm" variant="outline" onClick={addSection}>
                <Plus className="w-4 h-4 mr-1" /> Add Section
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.sections.map((section, idx) => (
                <div key={idx} className="flex gap-4 items-end p-4 bg-slate-50 border rounded-lg">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Section Name
                    </label>
                    <Input
                      value={section.name}
                      onChange={(e) => handleSectionChange(idx, 'name', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="w-40">
                    <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                    <Select
                      value={section.subject}
                      onValueChange={(v) => handleSectionChange(idx, 'subject', v)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quant">Quant</SelectItem>
                        <SelectItem value="reasoning">Reasoning</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="ga">General Awareness</SelectItem>
                        <SelectItem value="computer">Computer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-bold text-slate-500 uppercase">Difficulty</label>
                    <Select
                      value={section.difficulty || 'any'}
                      onValueChange={(v) => handleSectionChange(idx, 'difficulty', v)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-bold text-slate-500 uppercase">Exam Tag</label>
                    <Select
                      value={section.examTag || 'any'}
                      onValueChange={(v) => handleSectionChange(idx, 'examTag', v)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="ssc">SSC</SelectItem>
                        <SelectItem value="railway">Railway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-bold text-slate-500 uppercase">Count</label>
                    <Input
                      type="number"
                      value={section.count}
                      onChange={(e) => handleSectionChange(idx, 'count', Number(e.target.value))}
                      className="bg-white"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => removeSection(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full bg-violet-600 hover:bg-violet-700 font-bold text-lg"
            onClick={handleGenerate}
            disabled={loading || !formData.title}
          >
            {loading ? 'Generating Test...' : '✨ Auto-Generate Mock Test'}
          </Button>
        </div>
      </div>
    </div>
  )
}
