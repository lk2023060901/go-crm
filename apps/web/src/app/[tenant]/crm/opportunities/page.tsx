'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Progress,
  Typography,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Modal,
  Form,
  Input,
  message,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  FilterOutlined,
  ExportOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Opportunity, OpportunityStage } from '@/types/crm';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function OpportunitiesPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟商机阶段数据
  const stages: OpportunityStage[] = [
    { id: '1', name: '潜在需求', order: 1, probability: 10, isWon: false, isLost: false },
    { id: '2', name: '需求确认', order: 2, probability: 25, isWon: false, isLost: false },
    { id: '3', name: '方案演示', order: 3, probability: 50, isWon: false, isLost: false },
    { id: '4', name: '商务谈判', order: 4, probability: 75, isWon: false, isLost: false },
    { id: '5', name: '合同签署', order: 5, probability: 90, isWon: false, isLost: false },
    { id: '6', name: '成交', order: 6, probability: 100, isWon: true, isLost: false }
  ];

  // 模拟商机数据
  const opportunities: Opportunity[] = [
    {
      id: '1',
      title: 'ERP系统采购项目',
      description: '深圳科技公司计划采购一套完整的ERP管理系统',
      customerId: '1',
      customerName: '深圳科技有限公司',
      stage: stages[2], // 方案演示
      status: 'open',
      probability: 50,
      amount: 500000,
      currency: 'CNY',
      expectedCloseDate: '2024-12-30',
      assignedUserId: '1',
      assignedUserName: '张三',
      source: 'inbound',
      competitors: ['用友', '金蝶'],
      tags: ['重点项目', '大客户'],
      priority: 'high',
      contactIds: ['1', '2'],
      productIds: ['1'],
      tenantId: 'tenant-1',
      orgId: 'org-1',
      createdBy: 'user-1',
      createdAt: '2024-11-01T09:00:00Z',
      updatedBy: 'user-1',
      updatedAt: '2024-12-18T16:30:00Z'
    },
    {
      id: '2',
      title: '财务管理系统升级',
      description: '上海制造集团需要升级现有财务管理系统',
      customerId: '2',
      customerName: '上海制造集团',
      stage: stages[1], // 需求确认
      status: 'open',
      probability: 25,
      amount: 300000,
      currency: 'CNY',
      expectedCloseDate: '2025-01-15',
      assignedUserId: '2',
      assignedUserName: '李四',
      source: 'referral',
      tags: ['升级项目'],
      priority: 'medium',
      contactIds: ['3'],
      productIds: ['2'],
      tenantId: 'tenant-1',
      orgId: 'org-1',
      createdBy: 'user-2',
      createdAt: '2024-12-01T14:20:00Z',
      updatedBy: 'user-2',
      updatedAt: '2024-12-17T10:15:00Z'
    },
    {
      id: '3',
      title: 'CRM系统采购',
      customerId: '1',
      customerName: '深圳科技有限公司',
      stage: stages[4], // 合同签署
      status: 'open',
      probability: 90,
      amount: 200000,
      currency: 'CNY',
      expectedCloseDate: '2024-12-25',
      assignedUserId: '1',
      assignedUserName: '张三',
      source: 'website',
      tags: ['快速成交'],
      priority: 'high',
      contactIds: ['1'],
      productIds: ['3'],
      tenantId: 'tenant-1',
      orgId: 'org-1',
      createdBy: 'user-1',
      createdAt: '2024-11-15T11:30:00Z',
      updatedBy: 'user-1',
      updatedAt: '2024-12-18T14:45:00Z'
    }
  ];

  const columns: ColumnsType<Opportunity> = [
    {
      title: '商机信息',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-900 mb-1">{text}</div>
          <div className="text-sm text-gray-500 mb-2">{record.customerName}</div>
          <div className="flex space-x-1">
            {record.tags.map(tag => (
              <Tag key={tag} size="small" color="blue">{tag}</Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount, record) => (
        <div className="text-right">
          <div className="font-medium text-lg">
            ¥{amount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {record.currency}
          </div>
        </div>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: '阶段/进度',
      key: 'stage',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{record.stage.name}</span>
            <span className="text-sm text-gray-500">{record.probability}%</span>
          </div>
          <Progress
            percent={record.probability}
            size="small"
            strokeColor={
              record.probability >= 75 ? '#52c41a' :
              record.probability >= 50 ? '#1890ff' :
              record.probability >= 25 ? '#faad14' : '#f5222d'
            }
            showInfo={false}
          />
        </div>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority) => {
        const priorityMap = {
          low: { color: 'default', text: '低' },
          medium: { color: 'processing', text: '中' },
          high: { color: 'error', text: '高' }
        };
        const config = priorityMap[priority];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '负责人',
      dataIndex: 'assignedUserName',
      key: 'assignedUserName',
      width: 100,
      render: (name) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-gray-400" />
          <span className="text-sm">{name}</span>
        </div>
      )
    },
    {
      title: '预计成交',
      dataIndex: 'expectedCloseDate',
      key: 'expectedCloseDate',
      width: 120,
      render: (date) => (
        <div className="flex items-center text-sm">
          <CalendarOutlined className="mr-2 text-gray-400" />
          {date}
        </div>
      ),
      sorter: (a, b) => new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime()
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑商机">
            <Button type="text" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </Tooltip>
          <Tooltip title="推进阶段">
            <Button type="text" size="small">
              推进
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleEdit = (opportunity: Opportunity) => {
    form.setFieldsValue({
      title: opportunity.title,
      customerId: opportunity.customerId,
      amount: opportunity.amount,
      expectedCloseDate: opportunity.expectedCloseDate,
      stageId: opportunity.stage.id,
      priority: opportunity.priority,
      description: opportunity.description
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('商机数据:', values);
      message.success('商机信息保存成功');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // 统计数据
  const totalAmount = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const avgProbability = opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length;
  const highPriorityCount = opportunities.filter(opp => opp.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2}>商机管理</Title>
          <div className="flex space-x-8 mt-2">
            <div className="flex items-center text-sm text-gray-600">
              <DollarOutlined className="mr-1" />
              总金额: ¥{totalAmount.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <TrophyOutlined className="mr-1" />
              平均概率: {avgProbability.toFixed(1)}%
            </div>
            <div className="flex items-center text-sm text-gray-600">
              高优先级: {highPriorityCount} 个
            </div>
          </div>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>
            导出
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            新增商机
          </Button>
        </Space>
      </div>

      {/* 筛选工具栏 */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Select placeholder="商机阶段" allowClear className="w-full">
              {stages.map(stage => (
                <Option key={stage.id} value={stage.id}>{stage.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select placeholder="优先级" allowClear className="w-full">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select placeholder="负责人" allowClear className="w-full">
              <Option value="1">张三</Option>
              <Option value="2">李四</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <RangePicker placeholder={['开始日期', '结束日期']} className="w-full" />
          </Col>
          <Col xs={24} sm={4}>
            <Space>
              <Button icon={<FilterOutlined />}>筛选</Button>
              <Button>重置</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 批量操作 */}
      {selectedRowKeys.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <span>已选择 {selectedRowKeys.length} 个商机</span>
            <Space>
              <Button>批量推进</Button>
              <Button>批量分配</Button>
              <Button>批量导出</Button>
            </Space>
          </div>
        </Card>
      )}

      {/* 商机表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={opportunities}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            total: opportunities.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑商机弹窗 */}
      <Modal
        title="商机信息"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="商机标题"
                name="title"
                rules={[{ required: true, message: '请输入商机标题' }]}
              >
                <Input placeholder="请输入商机标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="客户"
                name="customerId"
                rules={[{ required: true, message: '请选择客户' }]}
              >
                <Select placeholder="请选择客户">
                  <Option value="1">深圳科技有限公司</Option>
                  <Option value="2">上海制造集团</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="商机金额"
                name="amount"
                rules={[{ required: true, message: '请输入商机金额' }]}
              >
                <InputNumber
                  placeholder="请输入金额"
                  className="w-full"
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="商机阶段"
                name="stageId"
                rules={[{ required: true, message: '请选择商机阶段' }]}
              >
                <Select placeholder="请选择阶段">
                  {stages.map(stage => (
                    <Option key={stage.id} value={stage.id}>{stage.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="优先级"
                name="priority"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="预计成交日期"
            name="expectedCloseDate"
            rules={[{ required: true, message: '请选择预计成交日期' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="商机描述"
            name="description"
          >
            <TextArea
              rows={4}
              placeholder="请输入商机详细描述"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}