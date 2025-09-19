'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Form, Input, Button, Checkbox, Alert, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { LoginRequest } from '@/types/auth';

const { Title, Paragraph } = Typography;

interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [form] = Form.useForm<LoginForm>();

  // 从URL参数获取租户代码
  const tenantCode = params.tenant as string;

  const handleSubmit = async (values: LoginForm) => {
    try {
      setError('');

      const loginData: LoginRequest = {
        username: values.username,
        password: values.password,
        tenantCode: tenantCode, // 从URL路径自动获取
        rememberMe: values.rememberMe
      };

      await login(loginData);

      // 登录成功，跳转到对应租户的仪表板
      router.push(`/${tenantCode}/dashboard`);
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 区域 */}
        <div className="text-center mb-8">
          <Space direction="vertical" size="large" className="w-full">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg">
              <LoginOutlined className="text-2xl text-white" />
            </div>
            <div>
              <Title level={2} className="mb-2 text-gray-800">
                ERP 管理系统
              </Title>
              <Paragraph className="text-gray-600 text-base">
                智能化企业资源管理平台
              </Paragraph>
            </div>
          </Space>
        </div>

        {/* 认证表单卡片 */}
        <Card className="shadow-lg border-0" styles={{ body: { padding: '32px' } }}>
          <div className="text-center mb-6">
            <Title level={3} className="mb-2">
              登录账户
            </Title>
            <Paragraph className="text-gray-600">
              欢迎回来，请输入您的登录信息
            </Paragraph>
          </div>

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
        </Card>

        {/* 页脚信息 */}
        <div className="text-center mt-8">
          <Paragraph className="text-gray-500 text-sm">
            © 2024 ERP System. 专业的企业管理解决方案
          </Paragraph>
        </div>
      </div>
    </div>
  );
}