'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Dropdown,
  Avatar,
  Typography,
  Row,
  Col,
  Select,
  DatePicker,
  Modal,
  Form,
  message
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  MoreOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Customer } from '@/types/crm';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function CustomersPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟客户数据
  const customers: Customer[] = [
    {
      id: '1',
      name: '深圳科技有限公司',
      code: 'SZ001',
      type: 'company',
      industry: '软件开发',
      source: 'website',
      status: 'customer',
      tags: ['重点客户', 'VIP'],
      contactInfo: {
        email: 'contact@sztech.com',
        phone: '0755-12345678',
        mobile: '13800138000',
        website: 'www.sztech.com',
        address: {
          country: '中国',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          street: '科技园南区深南大道10000号',
          postalCode: '518000'
        }
      },
      companyInfo: {
        legalName: '深圳科技有限公司',
        registrationNumber: '440300123456789',
        taxId: '91440300123456789X',
        foundedYear: 2010,
        employeeCount: 500,
        annualRevenue: 50000000
      },
      businessInfo: {
        assignedUserId: '1',
        assignedUserName: '张三',
        priority: 'high',
        creditLimit: 1000000,
        paymentTerms: '30天',
        preferredLanguage: 'zh-CN',
        timezone: 'Asia/Shanghai'
      },
      stats: {
        totalOrders: 15,
        totalRevenue: 2340000,
        lastOrderDate: '2024-12-15',
        lastContactDate: '2024-12-18',
        opportunityCount: 3
      },
      tenantId: 'tenant-1',
      orgId: 'org-1',
      createdBy: 'user-1',
      createdAt: '2024-01-15T09:00:00Z',
      updatedBy: 'user-1',
      updatedAt: '2024-12-18T16:30:00Z'
    },
    {
      id: '2',
      name: '上海制造集团',
      code: 'SH002',
      type: 'company',
      industry: '制造业',
      source: 'referral',
      status: 'lead',
      tags: ['潜在客户'],
      contactInfo: {
        email: 'info@shmfg.com',
        phone: '021-87654321',
        mobile: '13900139000'
      },
      companyInfo: {
        legalName: '上海制造集团有限公司',
        registrationNumber: '310000987654321',
        taxId: '91310000987654321Y',
        foundedYear: 2005,
        employeeCount: 1200,
        annualRevenue: 120000000
      },
      businessInfo: {
        assignedUserId: '2',
        assignedUserName: '李四',
        priority: 'medium',
        preferredLanguage: 'zh-CN',
        timezone: 'Asia/Shanghai'
      },
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
        opportunityCount: 2
      },
      tenantId: 'tenant-1',
      orgId: 'org-1',
      createdBy: 'user-2',
      createdAt: '2024-11-20T14:20:00Z',
      updatedBy: 'user-2',
      updatedAt: '2024-12-17T10:15:00Z'
    }
  ];

  const columns: ColumnsType<Customer> = [
    {
      title: '客户信息',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar size={40} icon={<UserOutlined />} />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.code}</div>
            <div className="flex space-x-1 mt-1">
              {record.tags.map(tag => (
                <Tag key={tag} size="small" color="blue">{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          {record.contactInfo.email && (
            <div className="flex items-center text-sm">
              <MailOutlined className="mr-2 text-gray-400" />
              {record.contactInfo.email}
            </div>
          )}
          {record.contactInfo.phone && (
            <div className="flex items-center text-sm">
              <PhoneOutlined className="mr-2 text-gray-400" />
              {record.contactInfo.phone}
            </div>
          )}
        </div>
      )
    },
    {
      title: '行业/类型',
      key: 'industry',
      width: 120,
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium">{record.industry || '-'}</div>
          <Tag color={record.type === 'company' ? 'blue' : 'green'}>
            {record.type === 'company' ? '企业' : '个人'}
          </Tag>
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
          prospect: { color: 'default', text: '潜在客户' },
          lead: { color: 'processing', text: '线索' },
          customer: { color: 'success', text: '客户' },
          inactive: { color: 'error', text: '非活跃' }
        };
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '负责人',
      key: 'assignedUser',
      width: 100,
      render: (_, record) => (
        <div className="text-sm">{record.businessInfo.assignedUserName}</div>
      )
    },
    {
      title: '收入/商机',
      key: 'stats',
      width: 120,
      render: (_, record) => (
        <div className="text-sm">
          <div className="font-medium">
            ¥{record.stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-gray-500">
            {record.stats.opportunityCount} 个商机
          </div>
        </div>
      )
    },
    {
      title: '最后联系',
      key: 'lastContact',
      width: 120,
      render: (_, record) => (
        <div className="text-sm text-gray-600">
          {record.stats.lastContactDate || '未联系'}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: '编辑',
                onClick: () => handleEdit(record)
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: '删除',
                danger: true,
                onClick: () => handleDelete(record.id)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  const handleEdit = (customer: Customer) => {
    form.setFieldsValue({
      name: customer.name,
      email: customer.contactInfo.email,
      phone: customer.contactInfo.phone,
      industry: customer.industry,
      status: customer.status
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个客户吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        message.success('客户删除成功');
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values);
      message.success('客户信息保存成功');
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

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <Title level={2}>客户管理</Title>
        <Space>
          <Button icon={<ExportOutlined />}>
            导出
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            新增客户
          </Button>
        </Space>
      </div>

      {/* 筛选工具栏 */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Search
              placeholder="搜索客户名称、邮箱、电话"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={4}>
            <Select placeholder="客户状态" allowClear className="w-full">
              <Option value="prospect">潜在客户</Option>
              <Option value="lead">线索</Option>
              <Option value="customer">客户</Option>
              <Option value="inactive">非活跃</Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select placeholder="客户类型" allowClear className="w-full">
              <Option value="company">企业</Option>
              <Option value="individual">个人</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <RangePicker placeholder={['开始日期', '结束日期']} className="w-full" />
          </Col>
          <Col xs={24} sm={2}>
            <Button icon={<FilterOutlined />}>
              筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 批量操作工具栏 */}
      {selectedRowKeys.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <span>已选择 {selectedRowKeys.length} 项</span>
            <Space>
              <Button>批量编辑</Button>
              <Button>批量导出</Button>
              <Button danger>批量删除</Button>
            </Space>
          </div>
        </Card>
      )}

      {/* 客户表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            total: customers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑客户弹窗 */}
      <Modal
        title="客户信息"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
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
                label="客户名称"
                name="name"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="客户状态"
                name="status"
                rules={[{ required: true, message: '请选择客户状态' }]}
              >
                <Select placeholder="请选择客户状态">
                  <Option value="prospect">潜在客户</Option>
                  <Option value="lead">线索</Option>
                  <Option value="customer">客户</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="电话"
                name="phone"
              >
                <Input placeholder="请输入电话号码" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="行业"
            name="industry"
          >
            <Select placeholder="请选择行业">
              <Option value="软件开发">软件开发</Option>
              <Option value="制造业">制造业</Option>
              <Option value="金融">金融</Option>
              <Option value="教育">教育</Option>
              <Option value="医疗">医疗</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}