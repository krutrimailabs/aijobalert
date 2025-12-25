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
import { EDUCATION_LEVELS, INDIAN_STATES, JOB_CATEGORIES } from '@/lib/constants'
import { Loader2 } from 'lucide-react'

export function ProfileEditForm() {
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Local state for form fields, initialized from user store
  // We use simple controlled inputs here
  const [formData, setFormData] = useState({
    category: user?.category || '',
    domicileState: user?.domicileState || '',
    // Cast to string[] to simplify local state handling, will cast back when needed or just rely on backend validation
    qualification: (user?.qualification || []) as string[],
    gender: user?.gender || '',
    physicallyDisabled: user?.physicallyDisabled || false,
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
  })

  // TODO: Add support for multi-select preferredStates and qualification if UI library permits easily

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleQualificationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, qualification: [value] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')

    try {
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="qualification">Highest Qualification</Label>
          <Select
            value={formData.qualification?.[0] || ''}
            onValueChange={handleQualificationChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Qualification" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((edu) => (
                <SelectItem key={edu.value} value={edu.value}>
                  {edu.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 md:col-span-2">
          <Checkbox
            id="pwd"
            checked={formData.physicallyDisabled}
            onCheckedChange={(checked) => handleChange('physicallyDisabled', checked === true)}
          />
          <Label htmlFor="pwd">I am a Person with Disability (PWD)</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}
