import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { redirect } from 'next/navigation'

export default async function SignInPage() {

  console.log("COGNITO_CLIENT_ID: ", process.env.COGNITO_CLIENT_ID);
  console.log("COGNITO_CLIENT_SECRET: ", process.env.COGNITO_CLIENT_SECRET);
  console.log("COGNITO_ISSUER: ", process.env.COGNITO_ISSUER);
  console.log("AUTH_SECRET: ", process.env.AUTH_SECRET);

  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <LoginButton />
    </div>
  )
}
