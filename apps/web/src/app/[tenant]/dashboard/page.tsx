'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Space, Button, Table, Tag } from 'antd';
import {
  TeamOutlined,
  ShopOutlined,
  DollarOutlined,
  TrophyOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;

interface RecentActivity {
  key: string;
  type: 'customer' | 'opportunity' | 'activity';
  description: string;
  time: string;
  status: 'success' | 'warning' | 'processing';
}

interface TopCustomer {
  key: string;
  name: string;
  revenue: number;
  opportunities: number;
  lastContact: string;
}

export default function DashboardPage() {
  // 模拟数据
  const recentActivities: RecentActivity[] = [
    {
      key: '1',
      type: 'customer',
      description: '新增客户：上海科技公司',
      time: '2分钟前',
      status: 'success'
    },
    {
      key: '2',
      type: 'opportunity',
      description: '商机进展：ERP系统采购项目进入议价阶段',
      time: '15分钟前',
      status: 'processing'
    },
    {
      key: '3',
      type: 'activity',
      description: '完成客户拜访：深圳制造企业',
      time: '1小时前',
      status: 'success'
    },
    {
      key: '4',
      type: 'opportunity',
      description: '商机关闭：财务软件项目成功签约',
      time: '2小时前',
      status: 'success'
    }
  ];

  const topCustomers: TopCustomer[] = [
    {
      key: '1',
      name: '深圳科技有限公司',
      revenue: 156000,
      opportunities: 3,
      lastContact: '2024-12-18'
    },
    {
      key: '2',
      name: '上海制造集团',
      revenue: 234000,
      opportunities: 5,
      lastContact: '2024-12-17'
    },
    {
      key: '3',
      name: '北京软件公司',
      revenue: 89000,
      opportunities: 2,
      lastContact: '2024-12-16'
    }
  ];

  const activityColumns: ColumnsType<RecentActivity> = [
    {
      title: '活动',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">{record.time}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusMap = {
          success: { color: 'green', text: '完成' },
          warning: { color: 'orange', text: '警告' },
          processing: { color: 'blue', text: '进行中' }
        };
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    }
  ];

  const customerColumns: ColumnsType<TopCustomer> = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '总收入',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => `¥${value.toLocaleString()}`
    },
    {
      title: '商机数',
      dataIndex: 'opportunities',
      key: 'opportunities'
    },
    {
      title: '最后联系',
      dataIndex: 'lastContact',
      key: 'lastContact'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">
            仪表板
          </Title>
          <Paragraph className="text-gray-600">
            欢迎回来！这是您的业务概览
          </Paragraph>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            新增客户
          </Button>
          <Button icon={<PlusOutlined />}>
            新增商机
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总客户数"
              value={156}
              prefix={<TeamOutlined />}
              suffix={
                <span className="text-green-500 text-sm ml-2">
                  <ArrowUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃商机"
              value={42}
              prefix={<ShopOutlined />}
              suffix={
                <span className="text-green-500 text-sm ml-2">
                  <ArrowUpOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本月收入"
              value={234560}
              prefix={<DollarOutlined />}
              precision={2}
              suffix={
                <span className="text-red-500 text-sm ml-2">
                  <ArrowDownOutlined /> 3%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="转化率"
              value={68.5}
              prefix={<TrophyOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 销售漏斗和进度 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="销售漏斗" extra={<Button type="link">查看详情</Button>}>
            <Space direction="vertical" className="w-full">
              <div>
                <div className="flex justify-between mb-2">
                  <span>潜在客户</span>
                  <span>120</span>
                </div>
                <Progress percent={100} showInfo={false} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>合格线索</span>
                  <span>80</span>
                </div>
                <Progress percent={66.7} showInfo={false} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>商机</span>
                  <span>42</span>
                </div>
                <Progress percent={35} showInfo={false} strokeColor="#faad14" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>成交客户</span>
                  <span>28</span>
                </div>
                <Progress percent={23.3} showInfo={false} strokeColor="#f5222d" />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="月度目标进度" extra={<Button type="link">设置目标</Button>}>
            <Space direction="vertical" className="w-full" size="large">
              <div>
                <div className="flex justify-between mb-2">
                  <span>销售目标</span>
                  <span>¥234,560 / ¥500,000</span>
                </div>
                <Progress
                  percent={46.9}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>新客户目标</span>
                  <span>15 / 20</span>
                </div>
                <Progress percent={75} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>活动完成率</span>
                  <span>85%</span>
                </div>
                <Progress percent={85} strokeColor="#faad14" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 最近活动和顶级客户 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="最近活动"
            extra={<Button type="link">查看全部</Button>}
          >
            <Table
              columns={activityColumns}
              dataSource={recentActivities}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="重点客户"
            extra={<Button type="link">客户管理</Button>}
          >
            <Table
              columns={customerColumns}
              dataSource={topCustomers}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}