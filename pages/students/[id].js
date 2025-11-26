import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Skeleton, Typography, Row, Col, Button, Modal, Form, Input, message, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, GlobalOutlined, DeleteOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Head from 'next/head';

const { Title, Text } = Typography;

// --- Data Fetching (Unchanged) ---
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
    const ids = await fetchUserIds();

    const paths = ids.map((id) => ({
        params: { id },
    }));

    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps(context) {
    const { id } = context.params;

    try {
        const res = await fetch(`https://dummyjson.com/users/${id}`);
        if (!res.ok) {
            return { notFound: true };
        }
        const student = await res.json();

        return {
            props: {
                student,
            },
            revalidate: 10,
        };
    } catch (error) {
        console.error('Error Fetching Student Data:', error);
        return { notFound: true };
    }
}


const StudentDetail = ({ student }) => {
    const router = useRouter();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [localStudent, setLocalStudent] = useState(student);

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
        form.setFieldsValue({
            firstName: localStudent.firstName,
            lastName: localStudent.lastName,
            email: localStudent.email,
            phone: localStudent.phone,
            age: localStudent.age,
            address: localStudent.address?.address, 
            city: localStudent.address?.city,
            postalCode: localStudent.address?.postalCode,
            company: localStudent.company?.name,
            university: localStudent.university,
        });
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // --- NEW/FIXED: Simple Edit Simulation Handler ---
    const handleEditSimulation = (values) => {
        // This is where a real API call (PUT/PATCH) would go.
        // For simulation, we just show a success message and close the modal.
        console.log('Simulated form submission data:', values);
        
        setIsModalVisible(false);
        message.success('Student details updated (simulated). The display data remains unchanged.');
    };
    // --- END NEW/FIXED ---


    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            message.warning('Student deleted (simulated). Going back to list.');
            router.push('/students');
        }
    };

    return (
        <>
            <Card
                style={{ maxWidth: 600, margin: '24px auto' }}
                title="Student Detail"
                extra={
                    <Space>
                        <Button onClick={() => router.push('/students')}>
                            Back
                        </Button>
                        <Button type="primary" onClick={showModal}>
                            Edit (Simulate)
                        </Button>
                        <Button danger onClick={handleDelete}>
                            Delete
                        </Button>
                    </Space>
                }
            >
                <Skeleton loading={router.isFallback} active>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Title level={3}>🧑‍🎓 {localStudent.firstName} {localStudent.lastName}</Title>
                            <Text><b>Email:</b> {localStudent.email}</Text><br />
                            <Text><b>Phone:</b> {localStudent.phone}</Text><br />
                            <Text><b>Age:</b> {localStudent.age}</Text><br />
                            <Text><b>Address:</b> {localStudent.address?.address}, {localStudent.address?.city}, {localStudent.address?.postalCode}</Text><br />
                            <Text><b>Company:</b> {localStudent.company?.name}</Text><br />
                            <Text><b>University:</b> {localStudent.university}</Text><br />
                        </Col>
                    </Row>
                </Skeleton>
            </Card>

            {/* --- MODAL FORM --- */}
            <Modal
                title="Edit Student Details (Simulation)"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    // Button to trigger the form submission
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Save Changes (Simulate)
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="edit_student"
                    // Link to the simulation handler
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
        </>
    );
};

export default StudentDetail;