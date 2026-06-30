import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Layout, Menu, Button, Breadcrumb, Avatar, Dropdown, Space, theme } from 'antd';
import { ShoppingOutlined, TagsOutlined, LogoutOutlined, ShopOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useEffect } from "react";
import axiosClient from "../axios-client";

const { Header, Sider, Content } = Layout;

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onLogout = () => {
    axiosClient.post('/logout').then(() => {
        setUser({});
        setToken(null);
    });
  }

  useEffect(() => {
    if (token) {
        axiosClient.get('/user')
        .then(({data}) => {
             setUser(data);
        })
    }
  }, [token, setUser])

  if (!token) {
    return <Navigate to="/login" />;
  }

  const breadcrumbItems = [
    { title: <Link to="/">首页</Link> },
  ];

  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbNameMap = {
      'products': '商品管理',
      'categories': '分类管理',
      'orders': '订单管理',
      'profile': '个人中心'
  };

  pathSnippets.forEach((snippet) => {
      if (breadcrumbNameMap[snippet]) {
          breadcrumbItems.push({ title: breadcrumbNameMap[snippet] });
      }
  });

  const menuItems = [
    {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to="/profile">个人中心</Link>
    },
    {
        type: 'divider',
    },
    {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: onLogout
    }
  ];

  const sideMenuItems = [
    {
        key: 'products',
        icon: <ShopOutlined />,
        label: <Link to="/products">商品管理</Link>
    },
    {
        key: 'categories',
        icon: <TagsOutlined />,
        label: <Link to="/categories">分类管理</Link>
    },
    {
        key: 'orders',
        icon: <ShoppingOutlined />,
        label: <Link to="/orders">订单管理</Link>
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 24px', 
          background: colorBgContainer,
          boxShadow: '0 2px 8px #f0f1f2',
          zIndex: 10
      }}>
        <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded mr-2 flex items-center justify-center text-white font-bold text-lg">M</div>
            <div className="text-xl font-bold text-gray-800">电商管理系统</div>
        </div>
        
        <Dropdown menu={{ items: menuItems }}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar style={{ backgroundColor: '#1890ff', marginRight: 8 }} icon={<UserOutlined />} />
                <span className="mr-2 font-medium text-gray-700">{user?.name || '用户'}</span>
                <DownOutlined style={{ fontSize: '12px', color: '#999' }} />
            </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={220} style={{ background: colorBgContainer }}>
            <Menu 
                mode="inline" 
                defaultSelectedKeys={['1']} 
                selectedKeys={[pathSnippets[0] || 'products']}
                style={{ height: '100%', borderRight: 0, padding: '10px 0' }}
                items={sideMenuItems}
            />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
            <div style={{ margin: '16px 0' }}>
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <Content style={{ 
                padding: 24, 
                margin: 0, 
                minHeight: 280, 
                background: colorBgContainer, 
                borderRadius: borderRadiusLG,
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
            }}>
                <Outlet />
            </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
