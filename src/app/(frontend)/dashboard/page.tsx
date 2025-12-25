'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SavedJobsList } from '@/components/SavedJobsList'
import { ApplicationsList } from '@/components/ApplicationsList'
import { ProfileEditForm } from '@/components/ProfileEditForm'
import { MyAttemptsList } from '@/components/MyAttemptsList'

import { RecommendedJobsList } from '@/components/RecommendedJobsList'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="mb-8 w-full justify-start overflow-x-auto">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jobs You Might Like</CardTitle>
              <CardDescription>Personalized recommendations based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendedJobsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>Jobs you have bookmarked for later</CardDescription>
            </CardHeader>
            <CardContent>
              <SavedJobsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track your job application status</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Practice Performance</CardTitle>
              <CardDescription>Track your mock test scores and practice history</CardDescription>
            </CardHeader>
            <CardContent>
              <MyAttemptsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
