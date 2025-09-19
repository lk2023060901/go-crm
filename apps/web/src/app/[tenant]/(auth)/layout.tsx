import React, { use } from 'react';

export default function TenantAuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  // 使用 React.use() 解包异步参数
  const { tenant } = use(params);

  // 可以在这里添加租户特定的认证布局逻辑
  // 比如检查租户是否存在、是否激活等

  return (
    <div className="tenant-auth-layout">
      {children}
    </div>
  );
}