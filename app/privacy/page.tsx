import Link from 'next/link';
import { AppBackground } from '@/app/components/AppChrome';

export default function PrivacyPage() {
  return (
    <AppBackground>
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-16">
        <Link href="/" className="text-sm text-app-accent hover:text-app-accent-hover">
          ← Back to home
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-app-text">Privacy policy</h1>
        <p className="mt-6 leading-relaxed text-app-muted">
          This is a placeholder page for your demo deployment. Replace this content with your real privacy
          policy after legal review.
        </p>
      </div>
    </AppBackground>
  );
}
