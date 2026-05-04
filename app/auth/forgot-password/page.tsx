import Link from 'next/link';
import { AppBackground } from '@/app/components/AppChrome';

export default function ForgotPasswordPage() {
  return (
    <AppBackground>
      <div className="relative z-10 mx-auto max-w-md px-4 py-16">
        <Link href="/auth/signin" className="text-sm text-app-accent hover:text-app-accent-hover">
          ← Back to sign in
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-app-text">Forgot password</h1>
        <p className="mt-4 leading-relaxed text-app-muted">
          Password reset by email is not configured on this demo yet. Contact your administrator or use Django
          admin if you have access.
        </p>
      </div>
    </AppBackground>
  );
}
