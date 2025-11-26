import React, { useState, useMemo } from 'react';
import { Table, Button, Input, Select, Space, Typography, Tag } from 'antd';
import { useRouter } from 'next/router';

import { useAppContext } from '../../context/AppContext';

const { Title } = Typography;
const { Option } = Select;

export async function getServerSideProps() {
    try {
        const studentsRes = await fetch('https://dummyjson.com/users?limit=30');
        if (!studentsRes.ok) throw new Error('Failed to fetch students');
        const studentsData = await studentsRes.json();

        const majorsRes = await fetch('https://dummyjson.com/products/categories');
        if (!majorsRes.ok) throw new Error('Failed to fetch categories');

        const categoryObjects = await majorsRes.json();
        const majorSlugs = categoryObjects.map(category => category.slug || category);

        const students = studentsData.users.map(user => ({
            key: user.id,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            university: user.university,
            major: majorSlugs[user.id % majorSlugs.length],
        }));

        return {
            props: {
                initialStudents: students,
                majorNames: majorSlugs,
            },
        };
    } catch (error) {
        console.error('SSR Data Fetching Error:', error);
        return {
            props: {
                initialStudents: [],
                majorNames: [],
            },
        };
    }
}

const StudentsIndex = ({ initialStudents, majorNames }) => {
    const { selectedMajor, setSelectedMajor, theme } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const textColor = 'var(--text-primary)';
    const secondaryColor = 'var(--text-secondary)';

    const containerStyle = {
        padding: 24,
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
    };

    const filteredStudents = useMemo(() => {
        return initialStudents.filter(student => {
            const nameMatches = searchTerm ? student.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            const majorMatches = selectedMajor ? student.major === selectedMajor : true;
            return nameMatches && majorMatches;
        });
    }, [initialStudents, searchTerm, selectedMajor]);

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'University', dataIndex: 'university', key: 'university' },
        {
            title: 'Major',
            dataIndex: 'major',
            key: 'major',
            render: major => {
                const majorString = String(major || '');
                let color = 'purple';
                return <Tag color={color}>{major}</Tag>;
            },
            filters: majorNames.map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.major.includes(value),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => router.push(`/students/${record.id}`)}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <div style={containerStyle}>
            <Title level={2} style={{ color: textColor }}>🎓 Student Directory</Title>
            <p style={{ color: secondaryColor }}>Data loaded once via <strong>getServerSideProps</strong>. Use filters below to find students.</p>

            <Space style={{ marginBottom: 20 }}>
                <Input.Search
                    placeholder="Search name"
                    allowClear
                    onChange={e => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    style={{
                        width: 300,
                    }}
                />
                <Select
                    placeholder="Filter by Major"
                    allowClear
                    value={selectedMajor}
                    onChange={setSelectedMajor}
                    style={{ width: 200 }}
                >
                    {majorNames.map(name => (
                        <Option key={name} value={name}>{name}</Option>
                    ))}
                </Select>

                <button className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-blue-500 rounded-lg h-[60px] "
                    onClick={() => router.push('/')}
                >
                    Back To Home
                </button>
            </Space>

            <Table
                dataSource={filteredStudents}
                columns={columns}
                pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                bordered
            />
        </div>
    );
};

export default StudentsIndex;