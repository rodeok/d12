"use client";

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Home } from 'lucide-react';
import BannedAccountModal from '@/components/BannedAccountModal';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBannedModal, setShowBannedModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'banned' | 'deleted'>('banned');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Check if it's a banned/deleted account error
        if (result.error.includes('banned') || result.error.includes('deleted')) {
          const isBanned = result.error.includes('banned');
          setAccountStatus(isBanned ? 'banned' : 'deleted');
          setShowBannedModal(true);
          toast.error(`Account ${isBanned ? 'banned' : 'deleted'}. You can submit an appeal.`);
        } else {
          toast.error('Invalid credentials');
        }
      } else {
        const session = await getSession();
        if (session) {
          toast.success('Welcome back!');
          router.push('/dashboard');
        }
      }
    } catch (error) {
      toast.error('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your landlord account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <Link href="/" className="text-green-600 hover:underline center flex items-center justify-center">
                <Home />
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <BannedAccountModal
        isOpen={showBannedModal}
        onClose={() => setShowBannedModal(false)}
        userEmail={email}
        accountStatus={accountStatus}
      />
    </div>
  );
}