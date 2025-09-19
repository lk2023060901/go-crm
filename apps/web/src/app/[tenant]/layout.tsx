'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MainLayout } from '@/components/layouts/main-layout';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();

  // 直接使用同步参数
  const { tenant } = params;

  // 检查是否是认证相关的路径（不需要登录检查）
  const isAuthPath = pathname.includes('/login') || pathname.includes('/register');

  useEffect(() => {
    // 只有在非认证路径下才检查登录状态
    if (!isAuthPath && !isAuthenticated && !isLoading) {
      router.push(`/${tenant}/login`);
    }
  }, [isAuthPath, isAuthenticated, isLoading, router, tenant]);

  // 如果正在加载，显示加载状态
  if (isLoading && !isAuthPath) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  // 如果是认证页面，直接渲染子组件
  if (isAuthPath) {
    return <>{children}</>;
  }

  // 如果未认证，不渲染内容（将被重定向）
  if (!isAuthenticated) {
    return null;
  }

  // 认证后的页面使用主布局
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}