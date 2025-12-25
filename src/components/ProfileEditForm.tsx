'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { INDIAN_STATES, JOB_CATEGORIES } from '@/lib/constants'
import { Loader2 } from 'lucide-react'
import { EducationHistoryForm, EducationEntry } from '@/components/profile/EducationHistoryForm'

export function ProfileEditForm() {
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Local state for form fields, initialized from user store
  const [formData, setFormData] = useState<{
    category: string
    domicileState: string
    educationHistory: EducationEntry[]
    gender: string
    disability: {
      isEnabled: boolean
      type?: 'VI' | 'HI' | 'LD' | 'Other' | null
      percentage?: number | null
    }
    dateOfBirth: string
  }>({
    category: user?.category || 'General',
    domicileState: user?.domicileState || '',
    // @ts-expect-error user type might be stale
    educationHistory: user?.educationHistory || [],
    gender: user?.gender || '',
    // @ts-expect-error user type might be stale
    disability: user?.disability || { isEnabled: false, type: 'Other', percentage: 0 },
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')

    try {
      // Using /api/profile endpoint as it maps to the custom route we verified
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user) // Update global store
        setSuccessMessage('Profile updated successfully!')
        router.refresh()

        // Clear message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        // handle error
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {successMessage && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm font-medium">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={user.name} disabled className="bg-slate-50" />
          <p className="text-[10px] text-muted-foreground">Name cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled className="bg-slate-50" />
          <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Eligibility Details */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {JOB_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Domicile State</Label>
          <Select
            value={formData.domicileState}
            onValueChange={(val) => handleChange('domicileState', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-1 md:col-span-2">
          <EducationHistoryForm
            value={formData.educationHistory}
            onChange={(val) => handleChange('educationHistory', val)}
          />
        </div>

        {/* Disability Section */}
        <div className="space-y-4 col-span-1 md:col-span-2 border rounded-lg p-4 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pwd"
              checked={formData.disability?.isEnabled}
              onCheckedChange={(checked) => {
                const current = formData.disability || {
                  isEnabled: false,
                  type: 'Other',
                  percentage: 0,
                }
                handleChange('disability', { ...current, isEnabled: checked === true })
              }}
            />
            <Label htmlFor="pwd" className="font-semibold">
              I am a Person with Disability (PWD)
            </Label>
          </div>

          {formData.disability?.isEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-primary/20 ml-1">
              <div className="space-y-2">
                <Label>Disability Type</Label>
                <Select
                  value={formData.disability.type || undefined}
                  onValueChange={(val: 'VI' | 'HI' | 'LD' | 'Other') =>
                    handleChange('disability', { ...formData.disability, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VI">Visual Impairment (VI)</SelectItem>
                    <SelectItem value="HI">Hearing Impairment (HI)</SelectItem>
                    <SelectItem value="LD">Locomotor Disability (LD)</SelectItem>
                    <SelectItem value="Other">Other / Multiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Percentage (%)</Label>
                <Input
                  type="number"
                  value={formData.disability.percentage || ''}
                  onChange={(e) =>
                    handleChange('disability', {
                      ...formData.disability,
                      percentage: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}
