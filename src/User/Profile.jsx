import React, { useState, useEffect } from 'react';
import { Card, Button, List, Typography, Spin, message } from 'antd';
import { UserOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Text } = Typography;

export function Profile({ themeMode }) {
    const { user, logout } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (user) {
        loadHistory();
        }
    }, [user]);

    const loadHistory = async () => {
        try {
            if (!user) return;

            setLoading(true);
            const response = await fetch('/php/get_history.php', {
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error('Ошибка загрузки истории');
            
            const data = await response.json();
            
            if (data.success) {
                const filterHistory = data.history.filter(item =>
                    item.action === 'tts' || item.action === 'stt');
                setHistory(filterHistory);
            } else {
                message.error(data.message || 'Ошибка загрузки истории');
            }
        } catch (error) {
        console.error('Ошибка загрузки истории:', error);
        message.error('Ошибка загрузки истории');
        } finally {
        setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    };

    const translateAction = (action) => {
        switch(action) {
        case 'tts': return 'Озвучка текста';
        case 'stt': return 'Распознавание аудио';
        case 'settings': return 'Изменение настроек';
        default: return action;
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* <Card
            title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserOutlined />
                <span>Мой профиль</span>
            </div>
            }
            style={{
            background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
            borderColor: themeMode === 'dark' ? '#434343' : '#d9d9d9',
            marginBottom: '24px'
            }}
        >
            <div style={{ marginBottom: '20px' }}>
            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                {user?.email}
            </Text>
            </div>

            {/* <Button
            type="primary"
            onClick={logout}
            icon={<LogoutOutlined />}
            danger
            >
            Выйти из аккаунта
            </Button> */}
        {/* </Card> */} 

        <Card
            title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HistoryOutlined />
                <span>История действий</span>
            </div>
            }
            style={{
            background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
            borderColor: themeMode === 'dark' ? '#434343' : '#d9d9d9'
            }}
        >
            {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
            </div>
            ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                История действий пуста
            </div>
            ) : (
            <List
                dataSource={history}
                renderItem={(item, index) => (
                <List.Item>
                    <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>{translateAction(item.action)}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDate(item.created_at)}
                        </Text>
                    </div>
                    {item.details && (
                        <div style={{ marginTop: '4px', color: '#666', fontSize: '12px' }}>
                        {item.details}
                        </div>
                    )}
                    </div>
                </List.Item>
                )}
            />
            )}
        </Card>
        </div>
    );
}