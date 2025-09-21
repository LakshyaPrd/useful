'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthSuccess() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  const authMethod = searchParams.get('method') || 'email'
  
  useEffect(() => {
    if (isLoaded && user) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsRedirecting(true)
            
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isLoaded, user, router])



  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push('/sign-in')
    return null
  }

  const getSuccessMessage = () => {
    const email = user.emailAddresses[0]?.emailAddress
    switch (authMethod) {
      case 'google':
        return `Successfully signed in with Google as ${email}`
      case 'signup':
        return `Account created successfully! Welcome ${user.firstName || email}`
      default:
        return `Successfully signed in as ${email}`
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            {authMethod === 'signup' ? 'Welcome!' : 'Welcome Back!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700 font-medium">
              {getSuccessMessage()}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">
              {isRedirecting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                `Redirecting to dashboard in ${countdown} seconds...`
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
