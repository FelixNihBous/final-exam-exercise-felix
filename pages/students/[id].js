
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Skeleton, Typography, Row, Col, Button, Modal, Form, Input, message, Space, Divider } from 'antd';
import { useAppContext } from '../../context/AppContext'; // Import the fixed hook
import Head from 'next/head';
import {DeleteOutlined, EditOutlined, ArrowLeftOutlined, MailOutlined, PhoneOutlined, HomeOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const USERS_API = 'https://dummyjson.com/users';

async function fetchUserIds() {
    try {
        const res = await fetch(`${USERS_API}?limit=30`);
        if (!res.ok) throw new Error('Failed to fetch user list');
        const data = await res.json();
        return data.users.map(user => user.id.toString());
    } catch (error) {
        console.error("Error fetching user IDs:", error);
        return [];
    }
}

export async function getStaticPaths() {
    try {
        const res = await fetch(`${USERS_API}?limit=30`);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        return {
            paths: data.users.map(u => ({ params: { id: String(u.id) }})),
            fallback: true, // keep dynamic support
        };

    } catch (error) {
        console.error("ERROR getStaticPaths:", error);

        return {
            paths: [],      // build will NOT fail
            fallback: true, // dynamic fetch still works
        };
    }
}


export async function getStaticProps({ params }) {
    try {
        const res = await fetch(`https://dummyjson.com/users/${params.id}`);

        if (!res.ok) {
            return { props: { student: null }};
        }

        const student = await res.json();

        return {
            props: { student },
            revalidate: 10, // ISR enabled
        };

    } catch (error) {
        console.error("Error Fetching Student Data:", error);

        return {
            props: { student: null }, // prevents build failure
            revalidate: 10
        };
    }
}



const StudentDetail = ({ student }) => {
    const router = useRouter();
    
    // FIX: Safely use the context hook directly now that the Provider is guaranteed
    const { theme } = useAppContext(); 

    const isDark = theme === 'dark';

    // ===== THEME COLORS (Remains the same) =====
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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [localStudent, setLocalStudent] = useState(student);

    useEffect(() => {
        setLocalStudent(student);
    }, [student]);

    if (router.isFallback) {
        return (
            <div style={{ padding: '24px' }}>
                <Skeleton active />
            </div>
        );
    }
    
    if (!student || student.message === 'User not found') {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Text type="danger">Student not found. ID: {router.query.id}</Text>
                <div style={{ marginTop: '16px' }}>
                    <Button onClick={() => router.push('/students')}>Back to List</Button>
                </div>
            </div>
        );
    }

    const showModal = () => {
        const s = localStudent || student || {};
        form.setFieldsValue({
            firstName: s.firstName || '',
            lastName: s.lastName || '',
            email: s.email || '',
            phone: s.phone || '',
            age: s.age || '',
            address: s.address?.address || '', 
            city: s.address?.city || '',
            postalCode: s.address?.postalCode || '',
            company: s.company?.name || '',
            university: s.university || '',
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditSimulation = (values) => {
        console.log('Simulated form submission data:', values);
        setIsModalVisible(false);
        message.success('Student details updated (simulated). The display data remains unchanged.', 3);
    };


    const handleDelete = () => {
        if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this student?')) {
            message.success('Student deleted (simulated). Returning to list...', 2);
            setTimeout(() => router.push('/students'), 700);
        }
    };

    return (
        <>
            <Head>
                <title>{localStudent.firstName} {localStudent.lastName} | Student Detail</title>
            </Head>
            <div style={{
                padding: 24,
                minHeight: '100vh',
                backgroundColor: colors.bgPrimary,
                color: colors.textPrimary,
                transition: 'all 0.3s ease'
            }}>
                <Card
                    style={{ 
                        maxWidth: 600, 
                        margin: '24px auto',
                        backgroundColor: colors.bgSecondary,
                        borderColor: colors.borderColor,
                        color: colors.textPrimary
                    }}
                    title="Student Detail"
                    extra={
                        <Space>
                            <Button 
                                onClick={() => router.push('/students')}
                                style={{
                                    borderColor: colors.borderColor,
                                    color: colors.textPrimary,
                                    backgroundColor: colors.bgSecondary
                                }}
                            >
                                <ArrowLeftOutlined /> Back
                            </Button>
                            <Button type="primary" onClick={showModal}>
                                <EditOutlined /> Edit
                            </Button>
                            <Button 
                                danger 
                                onClick={handleDelete}
                                style={{
                                    borderColor: '#ff4d4f',
                                    color: '#ffffff',
                                    backgroundColor: '#ff4d4f'
                                }}
                            >
                                <DeleteOutlined /> Delete
                            </Button>
                        </Space>
                    }
                >
                    <Skeleton loading={router.isFallback} active>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Title level={3} style={{ color: colors.textPrimary }}>🧑‍🎓 {localStudent.firstName} {localStudent.lastName}</Title>
                                <Text style={{ color: colors.textPrimary }}><MailOutlined /> <b>Email:</b> {localStudent.email}</Text><br />
                                <Text style={{ color: colors.textPrimary }}><PhoneOutlined /> <b>Phone:</b> {localStudent.phone}</Text><br />
                                <Text style={{ color: colors.textPrimary }}><b>Age:</b> {localStudent.age}</Text><br />
                                <Text style={{ color: colors.textPrimary }}><HomeOutlined /> <b>Address:</b> {localStudent.address?.address}, {localStudent.address?.city}, {localStudent.address?.postalCode}</Text><br />
                                <Text style={{ color: colors.textPrimary }}><b>Company:</b> {localStudent.company?.name}</Text><br />
                                <Text style={{ color: colors.textPrimary }}><GlobalOutlined /> <b>University:</b> {localStudent.university}</Text><br />
                            </Col>
                        </Row>
                    </Skeleton>
                </Card>

                {/* --- MODAL FORM --- (Remains the same) */}
                <Modal
                    title="Edit Student Details (Simulation)"
                    open={isModalVisible}
                    onCancel={handleCancel}
                    style={{ 
                        backgroundColor: colors.bgSecondary 
                    }}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={() => form.submit()}>
                            Save Changes (Simulate)
                        </Button>,
                    ]}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="edit_student"
                        onFinish={handleEditSimulation}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        
                        <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone">
                            <Input />
                        </Form.Item>
                        <Form.Item name="age" label="Age">
                            <Input type="number" />
                        </Form.Item>
                        
                        <Divider orientation="left" style={{ margin: '16px 0 8px' }}>Location & Work</Divider>

                        <Form.Item name="university" label="University">
                            <Input />
                        </Form.Item>
                        <Form.Item name="company" label="Company Name">
                            <Input />
                        </Form.Item>
                        
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="address" label="Street Address">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="city" label="City">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="postalCode" label="Postal Code">
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default StudentDetail;