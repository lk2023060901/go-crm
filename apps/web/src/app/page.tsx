'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // 重定向到默认租户 demo
    // 根据认证状态重定向到登录页面或仪表板
    if (isAuthenticated) {
      router.push('/demo/dashboard');
    } else {
      router.push('/demo/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-600">正在重定向...</div>
      </div>
    </div>
  );
}
