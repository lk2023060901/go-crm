'use client';

import React from 'react';
import { Layout, Card, Typography, Space } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Content className="flex items-center justify-center p-4">
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
          <Card
            className="shadow-lg border-0"
            styles={{ body: { padding: '32px' } }}
          >
            <div className="text-center mb-6">
              <Title level={3} className="mb-2">
                {title}
              </Title>
              {subtitle && (
                <Paragraph className="text-gray-600">
                  {subtitle}
                </Paragraph>
              )}
            </div>

            {children}
          </Card>

          {/* 页脚信息 */}
          <div className="text-center mt-8">
            <Paragraph className="text-gray-500 text-sm">
              © 2024 ERP System. 专业的企业管理解决方案
            </Paragraph>
          </div>
        </div>
      </Content>
    </Layout>
  );
};