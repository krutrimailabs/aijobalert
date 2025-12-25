'use client'

import { useState } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, School, GraduationCap } from 'lucide-react'

// Define type locally based on Schema if not fully available yet, or use Partial<User['educationHistory'][number]>
export type EducationEntry = {
  level: '10th' | '12th' | 'Diploma' | 'Graduate' | 'PostGraduate' | 'PhD'
  degree?: string
  stream?: string
  passingYear?: number
  percentage?: number
  id?: string // Payload generates IDs for array items
}

interface EducationHistoryFormProps {
  value: EducationEntry[]
  onChange: (val: EducationEntry[]) => void
}

export function EducationHistoryForm({ value = [], onChange }: EducationHistoryFormProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<EducationEntry>>({
    level: '10th',
    degree: '',
    stream: '',
    passingYear: new Date().getFullYear(),
    percentage: 0,
  })

  const handleAdd = () => {
    if (!newEntry.level) return
    // Basic validation
    if (['Graduate', 'PostGraduate', 'Diploma'].includes(newEntry.level) && !newEntry.degree) {
      alert('Degree name is required for higher education')
      return
    }

    onChange([...value, newEntry as EducationEntry])
    setIsAdding(false)
    setNewEntry({
      level: '10th',
      degree: '',
      stream: '',
      passingYear: new Date().getFullYear(),
      percentage: 0,
    })
  }

  const handleRemove = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  const sortedHistory = [...value].sort((a, b) => (b.passingYear || 0) - (a.passingYear || 0))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Education History</Label>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="outline" size="sm" type="button">
            <Plus className="mr-2 h-4 w-4" /> Add Education
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {sortedHistory.map((edu, idx) => (
          <Card
            key={idx}
            className="relative overflow-hidden border-dashed border-2 hover:border-solid hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-4 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                {['10th', '12th'].includes(edu.level) ? (
                  <School className="h-5 w-5" />
                ) : (
                  <GraduationCap className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">
                  {edu.level} {edu.degree ? `- ${edu.degree}` : ''}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {edu.stream ? `${edu.stream} • ` : ''} {edu.passingYear} • {edu.percentage}%
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleRemove(idx)}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {value.length === 0 && !isAdding && (
          <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed text-muted-foreground text-sm">
            No education history added yet.
          </div>
        )}
      </div>

      {isAdding && (
        <Card className="border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Add New Qualification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={newEntry.level}
                  onValueChange={(val) =>
                    setNewEntry({ ...newEntry, level: val as EducationEntry['level'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th">10th (Matriculation)</SelectItem>
                    <SelectItem value="12th">12th (Intermediate)</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="PostGraduate">Post Graduate</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Passing Year</Label>
                <Input
                  type="number"
                  value={newEntry.passingYear}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, passingYear: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Degree Name</Label>
                <Input
                  placeholder="e.g. B.Tech, B.Sc"
                  value={newEntry.degree}
                  onChange={(e) => setNewEntry({ ...newEntry, degree: e.target.value })}
                  disabled={['10th', '12th'].includes(newEntry.level || '')}
                />
              </div>
              <div className="space-y-2">
                <Label>Stream / Specialization</Label>
                <Input
                  placeholder="e.g. Computer Science"
                  value={newEntry.stream}
                  onChange={(e) => setNewEntry({ ...newEntry, stream: e.target.value })}
                  disabled={['10th'].includes(newEntry.level || '')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Percentage / CGPA</Label>
              <Input
                type="number"
                max={100}
                value={newEntry.percentage}
                onChange={(e) => setNewEntry({ ...newEntry, percentage: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsAdding(false)} type="button">
                Cancel
              </Button>
              <Button onClick={handleAdd} type="button">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
