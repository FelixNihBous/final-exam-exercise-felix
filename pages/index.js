import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, List, Avatar, Statistic, Skeleton, Button, Tag, Space } from 'antd';
import { TeamOutlined, FileTextOutlined, SunOutlined, MoonOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { useAppContext } from './context/AppContext';
import { useRouter } from 'next/router';



const { Title, Text, Paragraph } = Typography;

export async function getServerSideProps() {
  try {
    const studentsRes = await fetch('https://dummyjson.com/users?limit=1');
    const studentsData = await studentsRes.json();
    const totalStudents = studentsData.total || 0;

    const majorsRes = await fetch('https://dummyjson.com/products/categories');
    const majorsData = await majorsRes.json();
    const majors = majorsData.slice(0, 10);

    return {
      props: {
        totalStudents,
        majors,
      },
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      props: {
        totalStudents: 0,
        majors: [],
      },
    };
  }
}

const Dashboard = ({ totalStudents, majors }) => {
  const { theme, toggleTheme, isLoggedIn, userName, loginUser, logoutUser } = useAppContext();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const isDark = theme === 'dark';

  const goToStudents = () => {
    router.push('/students');
  };

  const colors = isDark ? {
    bgPrimary: '#0d1117',
    bgSecondary: '#161b22',
    textPrimary: '#ffffff',
    textSecondary: '#a6a6a6',
    borderColor: '#30363d',
  } : {
    bgPrimary: '#f0f2f5',
    bgSecondary: '#ffffff',
    textPrimary: '#000000',
    textSecondary: '#666666',
    borderColor: '#e8e8e8',
  };

  const [randomStudent, setRandomStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);

    const fetchRandomStudent = async () => {
      try {
        const randomId = Math.floor(Math.random() * 30) + 1;
        const res = await fetch(`https://dummyjson.com/users/${randomId}`);
        const student = await res.json();
        setRandomStudent(student);
      } catch (error) {
        console.error('Client-side fetch error:', error);
      } finally {
        setLoadingStudent(false);
      }
    };

    fetchRandomStudent();
  }, []);

  if (!isClient) {
    return (
      <div style={{
        padding: 40,
        minHeight: '100vh',
        backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
      }}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div style={{
      padding: 40,
      minHeight: '100vh',
      backgroundColor: colors.bgPrimary,
      color: colors.textPrimary,
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <Title level={1} style={{ color: colors.textPrimary, margin: 0 }}>
              📊 Academic Dashboard
            </Title>
            <Paragraph style={{ color: colors.textSecondary, marginTop: 8 }}>
              3 Data-Fetching Strategies: <Text code>SSR + Client-Side</Text>
            </Paragraph>
          </div>
          
          {/* Theme Toggle & Login Status */}
          <Space direction="vertical" align="end" style={{ gap: '12px' }}>
            {/* Theme Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag color={isDark ? 'blue' : 'gold'}>
                {isDark ? '🌙 Dark' : '☀️ Light'}
              </Tag>
              <Button 
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                size="small"
              >
                Toggle
              </Button>
            </div>

            {/* Login Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag color={isLoggedIn ? 'green' : 'red'}>
                {isLoggedIn ? `✓ ${userName}` : '✗ Not Logged In'}
              </Tag>
              {isLoggedIn ? (
                <Button 
                  icon={<LogoutOutlined />}
                  onClick={logoutUser}
                  danger
                  size="small"
                >
                  Logout
                </Button>
              ) : (
                <Button 
                  icon={<LoginOutlined />}
                  onClick={() => loginUser('Felix', 'smartphones')}
                  type="primary"
                  size="small"
                >
                  Login
                </Button>
              )}
            </div>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        
        {/* ===== CARD 1: Total Students (SSR) ===== */}
        <Col xs={24} md={12} lg={6}>
          <Card 
            title={<span><TeamOutlined /> Total Students</span>}
            style={{ 
              backgroundColor: colors.bgSecondary, 
              borderColor: colors.borderColor,
              color: colors.textPrimary,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Statistic
                value={totalStudents}
                prefix="👥 "
                valueStyle={{ color: isDark ? '#52c41a' : '#2f54eb', fontSize: 28 }}
              />
              <Paragraph style={{ color: colors.textSecondary, marginTop: 12, fontSize: 12 }}>
                ✅ Fetched via <Text code>getServerSideProps</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 11 }}>Re-renders on each request</Text>
              </Paragraph>
            </div>
            <button 
                style={{ color: 'white', backgroundColor: 'green', width: '200px', height: '30px', borderRadius: '8px' }}
                onClick={goToStudents}
            >
                Go to Students Page
            </button>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={18}>
          <Card 
            title={<span><FileTextOutlined /> Student of the Day (Client-Side)</span>}
            style={{ 
              backgroundColor: colors.bgSecondary, 
              borderColor: colors.borderColor,
              color: colors.textPrimary,
              height: '100%'
            }}
          >
            {loadingStudent ? (
              <Skeleton active />
            ) : randomStudent ? (
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={6}>
                  <Avatar 
                    size={80}
                    style={{ 
                      backgroundColor: isDark ? '#52c41a' : '#2f54eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 40
                    }}
                  >
                    👤
                  </Avatar>
                </Col>
                <Col xs={24} sm={18}>
                  <Title level={4} style={{ color: colors.textPrimary, margin: 0 }}>
                    {randomStudent.firstName} {randomStudent.lastName}
                  </Title>
                  <Text style={{ color: colors.textSecondary }}>{randomStudent.email}</Text>
                  <br />
                  <Text style={{ color: colors.textSecondary }}>{randomStudent.university}</Text>
                  <br />
                  <Paragraph style={{ color: colors.textSecondary, marginTop: 8, fontSize: 12 }}>
                    ✅ Fetched via <Text code>useEffect</Text> hook
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>Loaded on component mount</Text>
                  </Paragraph>
                </Col>
              </Row>
            ) : (
              <Text style={{ color: colors.textSecondary }}>Failed to load student</Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* ===== MAJORS LIST (SSG) ===== */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card 
            title="📚 Available Majors/Departments (SSG)"
            style={{ 
              backgroundColor: colors.bgSecondary, 
              borderColor: colors.borderColor,
              color: colors.textPrimary
            }}
          >
            <List
              grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 5 }}
              dataSource={majors}
              renderItem={(major) => (
                <List.Item>
                  <Card 
                    style={{
                      backgroundColor: isDark ? '#1f1f1f' : '#fafafa',
                      borderColor: colors.borderColor,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#262626' : '#f0f0f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#1f1f1f' : '#fafafa';
                    }}
                  >
                    <Text 
                      style={{ 
                        color: colors.textPrimary,
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: 13
                      }}
                    >
                      📚 {major.name}
                    </Text>
                  </Card>
                </List.Item>
              )}
            />
            <Paragraph style={{ color: colors.textSecondary, marginTop: 16, fontSize: 12 }}>
              ✅ Fetched via <Text code>getServerSideProps</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 11 }}>Server-rendered on every request</Text>
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;