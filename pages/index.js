import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, List, Avatar, Statistic, Skeleton } from 'antd';
import { SunOutlined, MoonOutlined, UserOutlined, LogoutOutlined, LoginOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAppContext } from '../context/AppContext';
import { useRouter } from 'next/router';

const { Title, Text, Paragraph } = Typography;

export async function getServerSideProps() {
    try {
        const studentsRes = await fetch('https://dummyjson.com/users?limit=1');
        const studentsData = await studentsRes.json();
        const totalStudents = studentsData.total || 0;

        return {
            props: {
                totalStudents,
            },
        };
    } catch (error) {
        console.error('SSR Error:', error);
        return {
            props: {
                totalStudents: 0,
            },
        };
    }
}


const Dashboard = ({ totalStudents }) => {
    const router = useRouter();



    const {
        theme,
        toggleTheme,
        isLoggedIn,
        userName,
        selectedMajor,
        loginUser,
        logoutUser
    } = useAppContext();

    const isDark = theme === 'dark';

    const themeColors = {
        light: {
            bgPrimary: '#f0f2f5',
            bgSecondary: '#ffffff',
            textPrimary: '#000000',
            textSecondary: '#666666',
            borderColor: '#e8e8e8',
        },
        dark: {
            bgPrimary: '#0d1117',
            bgSecondary: '#161b22',
            textPrimary: '#ffffff',
            textSecondary: '#a6a6a6',
            borderColor: '#30363d',
        }
    };

    const colors = isDark ? themeColors.dark : themeColors.light;

    // ===== CLIENT-SIDE MOUNT CHECK =====
    const [isClient, setIsClient] = useState(false);

    // ===== CLIENT-SIDE FETCH: Random Student & Majors =====
    const [randomStudent, setRandomStudent] = useState(null);
    const [loadingStudent, setLoadingStudent] = useState(true);
    const [majors, setMajors] = useState([]);

    useEffect(() => {
        // Mark as mounted on client
        setIsClient(true);

        // Fetch random student on component mount
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

        // Fetch majors/categories
        const fetchMajors = async () => {
            try {
                const majorsRes = await fetch('https://dummyjson.com/products/categories');
                const majorsData = await majorsRes.json();
                setMajors(majorsData.slice(0, 10)); // Get first 10 majors
            } catch (error) {
                console.error('Failed to fetch majors:', error);
                setMajors([]);
            }
        };

        fetchRandomStudent();
        fetchMajors();
    }, []);

    // ===== EVENT HANDLERS =====
    const handleLogin = () => {
        loginUser('Jane Doe', 'fragrances');
    };

    const handleLogout = () => {
        logoutUser();
    };
    
    const gotoPage = () => {
        router.push('/students');
    }


    return (
        <div style={{
            padding: 40,
            minHeight: '100vh',
            backgroundColor: colors.bgPrimary,
            color: colors.textPrimary,
            transition: 'all 0.3s ease'
        }}
            suppressHydrationWarning={true}
        >
            {/* Page Header */}
            <div style={{ marginBottom: 30 }}>
                <Title level={1} style={{ color: colors.textPrimary, margin: 0 }}>
                    📊 Academic Dashboard
                </Title>
                <Paragraph style={{ color: colors.textSecondary, marginTop: 8 }}>
                    Welcome, <Text strong style={{ color: colors.textPrimary }}>{userName}</Text>.
                    This dashboard demonstrates <Text code style={{ color: isDark ? '#52c41a' : '#2f54eb' }}>3 Data-Fetching Strategies</Text>.
                </Paragraph>
            </div>

            <Row gutter={[24, 24]}>

                {/* ===== CARD 1: Application Settings ===== */}
                <Col xs={24} md={12} lg={6}>
                    <Card
                        title="⚙️ Settings"
                        style={{
                            backgroundColor: colors.bgSecondary,
                            borderColor: colors.borderColor,
                            color: colors.textPrimary,
                            height: '100%'
                        }}
                    >
                        <Space direction="vertical" style={{ width: '100%', gap: '16px' }}>

                            {/* Theme Toggle - Only render on client to avoid hydration mismatch */}
                            {isClient && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingBottom: '12px',
                                    borderBottom: `1px solid ${colors.borderColor}`
                                }}>
                                    <Text style={{ color: colors.textPrimary }}>Theme:</Text>
                                    <Space>
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
                                    </Space>
                                </div>
                            )}

                            {/* Login Status */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: colors.textPrimary }}>Status:</Text>
                                <Space>
                                    <Tag color={isLoggedIn ? 'green' : 'red'}>
                                        {isLoggedIn ? '✓ Logged In' : '✗ Logged Out'}
                                    </Tag>
                                    {isLoggedIn ? (
                                        <Button
                                            icon={<LogoutOutlined />}
                                            onClick={handleLogout}
                                            danger
                                            size="small"
                                        >
                                            Logout
                                        </Button>
                                    ) : (
                                        <Button
                                            icon={<LoginOutlined />}
                                            onClick={handleLogin}
                                            type="primary"
                                            size="small"
                                        >
                                            Login
                                        </Button>
                                    )}
                                </Space>
                            </div>

                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <Card
                        title={<span><TeamOutlined /> Total Students (SSR)</span>}
                        style={{
                            backgroundColor: colors.bgSecondary,
                            borderColor: colors.borderColor,
                            color: colors.textPrimary,
                            height: '100%'
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
                        <button className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-blue-500 rounded-lg h-[60px]"
                            onClick={gotoPage}
                        >
                            Go to Student List
                        </button>
                    </Card>
                </Col>

                {/* ===== CARD 3: Random Student (Client-Side) ===== */}
                <Col xs={24} md={12} lg={12}>
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
                                        icon={<UserOutlined />}
                                        style={{
                                            backgroundColor: isDark ? '#52c41a' : '#2f54eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    />
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
                        title={<span>📚 Available Majors/Departments (SSG)</span>}
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
                                                textAlign: 'center'
                                            }}
                                        >
                                            📚 {typeof major === 'string' ? major : major.name || major.slug || 'Major'}
                                        </Text>
                                    </Card>
                                </List.Item>
                            )}
                        />
                        <Paragraph style={{ color: colors.textSecondary, marginTop: 16, fontSize: 12 }}>
                            ✅ Fetched via <Text code>getStaticProps</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 11 }}>Static generation at build time (revalidates every 24 hours)</Text>
                        </Paragraph>
                    </Card>
                </Col>
            </Row>

            {/* ===== QUICK INFO ===== */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                    <Card
                        title="📖 Data-Fetching Strategies Explained"
                        style={{
                            backgroundColor: colors.bgSecondary,
                            borderColor: colors.borderColor,
                            color: colors.textPrimary
                        }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8}>
                                <Title level={5} style={{ color: '#faad14' }}>🔄 SSR (Server-Side)</Title>
                                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                                    <b>Total Students Card:</b> Fetched on every request. Always fresh data.
                                </Text>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Title level={5} style={{ color: '#52c41a' }}>⚡ SSG (Static)</Title>
                                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                                    <b>Majors List:</b> Built at compile time. Fast, cached, and revalidated periodically.
                                </Text>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Title level={5} style={{ color: '#1890ff' }}>🌐 Client-Side</Title>
                                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                                    <b>Student of the Day:</b> Fetched in the browser using useEffect. Interactive and dynamic.
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
