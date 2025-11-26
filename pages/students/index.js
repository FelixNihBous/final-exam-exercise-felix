import React, { useState, useMemo } from 'react';
import { Table, Button, Input, Select, Space, Typography, Tag } from 'antd';
// Removed 'next/link' as it causes resolution errors in this environment.
// import Link from 'next/link'; 

// Correcting the import path to ensure the AppContext is resolved correctly.
import { useAppContext } from '../context/AppContext';

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

        const usableMajors = majorSlugs.slice(0, 5);

        const students = studentsData.users.map(user => ({
            key: user.id,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            university: user.university,
            major: usableMajors[user.id % usableMajors.length],
        }));

        return {
            props: {
                initialStudents: students,
                majorNames: usableMajors,
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
    // Get global state including theme
    const { selectedMajor, setSelectedMajor, theme } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    // Define theme-dependent styles for the container
    const containerStyle = {
        padding: 24,
        minHeight: '100vh',
        backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff', // Dark background for dark mode
        color: theme === 'dark' ? '#ffffff' : '#000000',           // White text for dark mode
        transition: 'background-color 0.3s',
    };

    // Text color helper
    const textColor = theme === 'dark' ? '#ffffff' : '#000000';
    const secondaryColor = theme === 'dark' ? '#a6a6a6' : '#666666';


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
                if (majorString.includes('smartphones')) color = 'blue';
                else if (majorString.includes('groceries')) color = 'green';
                else if (majorString.includes('fragrances')) color = 'gold';
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
                    // Placeholder action since 'next/link' is not available
                    onClick={() => console.log(`Viewing details for student ID: ${record.id}`)}
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
                        // Added dark mode styling to the search input
                        backgroundColor: theme === 'dark' ? '#303030' : '#fff',
                        color: textColor
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
            </Space>

            <Table
                dataSource={filteredStudents}
                columns={columns}
                pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                bordered

                className={theme === 'dark' ? 'ant-table-dark' : ''}
            />
        </div>
    );
};

export default StudentsIndex;