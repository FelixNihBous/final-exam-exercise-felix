import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag } from 'antd';
import { SunOutlined, MoonOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
// FIX: Adjusted the import path to resolve the context file correctly.
import { useAppContext } from './context/AppContext';

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
    // 1. Consume Context for state and actions
    const { 
        theme, 
        toggleTheme, 
        isLoggedIn, 
        userName, 
        selectedMajor,
        loginUser,
        logoutUser 
    } = useAppContext();

    // 2. Theme-dependent styles
    const isDark = theme === 'dark';
    const containerStyle = {
        padding: 40,
        minHeight: '100vh',
        backgroundColor: isDark ? '#0d1117' : '#f0f2f5', // Dark or Light background
        color: isDark ? '#ffffff' : '#000000',
        transition: 'background-color 0.3s',
    };
    const cardStyle = {
        backgroundColor: isDark ? '#161b22' : '#ffffff',
        borderColor: isDark ? '#30363d' : '#e8e8e8',
        color: isDark ? '#c9d1d9' : '#000000',
        borderRadius: 8,
    };
    const titleStyle = {
        color: isDark ? '#c9d1d9' : '#000000',
    };
    const textStyle = {
        color: isDark ? '#a6a6a6' : '#666666',
    };

    // 3. User Action Handlers
    const handleLogin = () => {
        // Log in with sample data, which also sets the default selectedMajor filter
        loginUser('Jane Doe', 'fragrances');
    };

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <div style={containerStyle}>
            <Title level={1} style={titleStyle}>
                Academic Dashboard
            </Title>
            <Paragraph style={textStyle}>
                Welcome, <Text strong style={{ color: isDark ? '#ffffff' : '#000000' }}>{userName}</Text>. This dashboard demonstrates global state management using React Context.
            </Paragraph>

            <Row gutter={[24, 24]} style={{ marginTop: 30 }}>
                
                {/* 1. Theme and User Control Card */}
                <Col xs={24} md={12} lg={8}>
                    <Card title={<span style={titleStyle}>Application Settings</span>} style={cardStyle}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            
                            {/* Theme Toggle */}
                            <Row align="middle" justify="space-between">
                                <Text style={titleStyle}>Current Theme:</Text>
                                <Space>
                                    <Tag color={isDark ? 'blue' : 'gold'}>
                                        {isDark ? 'Dark' : 'Light'}
                                    </Tag>
                                    <Button 
                                        icon={isDark ? <SunOutlined /> : <MoonOutlined />} 
                                        onClick={toggleTheme}
                                    >
                                        Toggle Theme
                                    </Button>
                                </Space>
                            </Row>

                            {/* Login/Logout */}
                            <Row align="middle" justify="space-between" style={{ marginTop: 10 }}>
                                <Text style={titleStyle}>Status:</Text>
                                <Space>
                                    <Tag color={isLoggedIn ? 'green' : 'red'}>
                                        {isLoggedIn ? 'Logged In' : 'Logged Out'}
                                    </Tag>
                                    {isLoggedIn ? (
                                        <Button 
                                            icon={<LogoutOutlined />} 
                                            onClick={handleLogout} 
                                            danger
                                        >
                                            Logout
                                        </Button>
                                    ) : (
                                        <Button 
                                            icon={<LoginOutlined />} 
                                            onClick={handleLogin} 
                                            type="primary"
                                        >
                                            Login (Demo)
                                        </Button>
                                    )}
                                </Space>
                            </Row>

                        </Space>
                    </Card>
                </Col>

                {/* 2. User Info Card */}
                <Col xs={24} md={12} lg={8}>
                    <Card title={<span style={titleStyle}>User and Filter Status</span>} style={cardStyle}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Row align="top">
                                <Col span={10}>
                                    <Text strong style={titleStyle}>Username:</Text>
                                </Col>
                                <Col span={14}>
                                    <Tag icon={<UserOutlined />} color="cyan">{userName}</Tag>
                                </Col>
                            </Row>

                            <Row align="top">
                                <Col span={10}>
                                    <Text strong style={titleStyle}>Default Major Filter:</Text>
                                </Col>
                                <Col span={14}>
                                    {selectedMajor ? (
                                        <Tag color="volcano">{selectedMajor}</Tag>
                                    ) : (
                                        <Text type="secondary" style={textStyle}>Not set (Logged out)</Text>
                                    )}
                                </Col>
                            </Row>
                        </Space>
                    </Card>
                </Col>

                {/* 3. Navigation/Quick Links Card */}
                <Col xs={24} lg={8}>
                     <Card title={<span style={titleStyle}>Quick Actions</span>} style={cardStyle}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button 
                                type="default" 
                                style={{ width: '100%', borderColor: isDark ? '#30363d' : undefined, color: isDark ? '#c9d1d9' : undefined }}
                                // Simulating navigation to the student directory page
                                onClick={() => console.log('Navigating to Students page (simulated)')}
                                href='/students'
                            >
                                View Student List
                            </Button>
                            <Button 
                                type="default" 
                                style={{ width: '100%', borderColor: isDark ? '#30363d' : undefined, color: isDark ? '#c9d1d9' : undefined }}
                                onClick={() => console.log('Navigating to Reports page (simulated)')}
                            >
                                Run Academic Reports
                            </Button>
                        </Space>
                    </Card>
                </Col>

            </Row>
        </div>
    );
};

export default Dashboard