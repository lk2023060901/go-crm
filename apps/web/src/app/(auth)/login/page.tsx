'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { LoginRequest } from '@/types/auth';

interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [form] = Form.useForm<LoginForm>();

  const handleSubmit = async (values: LoginForm) => {
    try {
      setError('');

      // 从URL自动获取租户代码
      const tenantCode = 'demo'; // TODO: 从路由参数获取

      const loginData: LoginRequest = {
        username: values.username,
        password: values.password,
        tenantCode: tenantCode,
        rememberMe: values.rememberMe
      };

      await login(loginData);

      // 登录成功，跳转到仪表板
      router.push('/demo/dashboard');
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    }
  };

  return (
    <AuthLayout
      title="登录账户"
      subtitle="欢迎回来，请输入您的登录信息"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{
          username: 'admin',
          password: 'admin123',
          rememberMe: true
        }}
      >
        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4"
            closable
            onClose={() => setError('')}
          />
        )}

        {/* 用户名 */}
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            size="large"
          />
        </Form.Item>

        {/* 密码 */}
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            size="large"
          />
        </Form.Item>

        {/* 记住我 */}
        <Form.Item name="rememberMe" valuePropName="checked">
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        {/* 登录按钮 */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? '登录中...' : '登录'}
          </Button>
        </Form.Item>

        {/* 提示信息 */}
        <div className="text-center text-gray-500 text-sm">
          <div>演示账户：admin / admin123</div>
        </div>
      </Form>
    </AuthLayout>
  );
}