'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/login?mode=forgot');
  }, [router]);

  return null;
}
