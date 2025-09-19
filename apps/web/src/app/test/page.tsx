'use client';

import { Button, Input, Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function TestPage() {
  return (
    <div className="p-8">
      <Title level={1}>测试页面</Title>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-blue-600">TailwindCSS 测试</h2>
        <div className="bg-red-100 p-4 rounded">这是红色背景</div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-green-600">Ant Design 测试</h2>
        <Card title="卡片标题" className="w-96">
          <Input
            prefix={<UserOutlined />}
            placeholder="输入框测试"
            className="mb-4"
          />
          <Button type="primary">按钮测试</Button>
        </Card>
      </div>
    </div>
  );
}