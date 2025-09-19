'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Space, Button, Table, Tag, Carousel } from 'antd';
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
          success: { className: 'tag-success', text: '完成' },
          warning: { className: 'tag-warning', text: '警告' },
          processing: { className: 'tag-processing', text: '进行中' }
        };
        const config = statusMap[status];
        return <Tag className={config.className}>{config.text}</Tag>;
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
      {/* 统计卡片和轮播 */}
      <Row gutter={[16, 16]}>
        {/* 左侧：2x2 统计卡片 */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="总客户数"
                  value={156}
                  prefix={<TeamOutlined />}
                  suffix={
                    <span className="text-success text-sm ml-2">
                      <ArrowUpOutlined /> 12%
                    </span>
                  }
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="活跃商机"
                  value={42}
                  prefix={<ShopOutlined />}
                  suffix={
                    <span className="text-success text-sm ml-2">
                      <ArrowUpOutlined /> 8%
                    </span>
                  }
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="本月收入"
                  value={234560}
                  valueStyle={{ fontSize: '24px' }}
                  formatter={(value) => `¥${value.toLocaleString()}`}
                  suffix={
                    <span className="text-error text-sm ml-2">
                      <ArrowDownOutlined /> 3%
                    </span>
                  }
                />
              </Card>
            </Col>
            <Col span={12}>
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
        </Col>

        {/* 右侧：轮播幻灯片 */}
        <Col xs={24} lg={12}>
          <Card title="重要信息" style={{ height: '100%' }}>
            <Carousel autoplay dots={{ className: 'custom-dots' }} dotPosition="bottom">
              <div className="px-1" style={{ minHeight: '85px' }}>
                <h4 className="text-sm font-semibold mb-2">团队表现</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>销售团队完成率</span>
                    <span className="font-semibold text-success">120%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>客服满意度</span>
                    <span className="font-semibold text-success">98.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>新客户转化</span>
                    <span className="font-semibold text-success">15.2%</span>
                  </div>
                </div>
              </div>
              <div className="px-1" style={{ minHeight: '85px' }}>
                <h4 className="text-sm font-semibold mb-2">系统公告</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">• 新增客户标签功能</span>
                    <span className="text-xs text-gray-400">2024-12-20 14:30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">• 优化商机跟进流程</span>
                    <span className="text-xs text-gray-400">2024-12-20 09:15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">• 增强数据导出功能</span>
                    <span className="text-xs text-gray-400">2024-12-19 16:45</span>
                  </div>
                </div>
              </div>
              <div className="px-1" style={{ minHeight: '85px' }}>
                <h4 className="text-sm font-semibold mb-2">市场洞察</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>市场增长率</span>
                    <span className="font-semibold text-success">+15.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>竞争指数</span>
                    <span className="font-semibold text-warning">中等</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>机会评分</span>
                    <span className="font-semibold text-success">8.5/10</span>
                  </div>
                </div>
              </div>
            </Carousel>
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
                <Progress percent={66.7} showInfo={false} strokeColor="#1890ff" />
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
                <Progress percent={23.3} showInfo={false} strokeColor="#52c41a" />
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
                  strokeColor="#1890ff"
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