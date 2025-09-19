'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Badge, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  ShopOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, tenant, logout } = useAuthStore();

  // 侧边栏菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: 'crm',
      icon: <ShopOutlined />,
      label: 'CRM 管理',
      children: [
        {
          key: 'customers',
          label: '客户管理',
        },
        {
          key: 'contacts',
          label: '联系人',
        },
        {
          key: 'opportunities',
          label: '商机管理',
        },
        {
          key: 'activities',
          label: '活动记录',
        },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: 'users',
          label: '用户管理',
        },
        {
          key: 'roles',
          label: '角色权限',
        },
        {
          key: 'organizations',
          label: '组织架构',
        },
      ],
    },
  ];

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ];

  return (
    <Layout className="erp-layout">
      {/* 左侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="erp-sidebar"
        width={240}
      >
        {/* Logo 区域 */}
        <div className="erp-logo">
          {collapsed ? 'ERP' : 'ERP 系统'}
        </div>

        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          defaultOpenKeys={['crm']}
          items={menuItems}
          className="border-r-0"
        />
      </Sider>

      {/* 主内容区 */}
      <Layout>
        {/* 顶部导航栏 */}
        <Header className="bg-white px-4 flex items-center justify-between shadow-sm border-b">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="mr-4"
            />

            {/* 面包屑导航 */}
            <div className="text-gray-600">
              {tenant?.name} / 仪表板
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* 搜索 */}
            <Button
              type="text"
              icon={<SearchOutlined />}
              className="text-gray-600"
            />

            {/* 通知 */}
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-gray-600"
              />
            </Badge>

            {/* 用户信息 */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <Space className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                <Avatar
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  size="small"
                />
                <span className="text-gray-700 font-medium">
                  {user?.fullName}
                </span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* 页面内容 */}
        <Content className="erp-content p-6">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};