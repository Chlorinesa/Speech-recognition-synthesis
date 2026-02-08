import React, { useState } from 'react';
import { Modal, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

export const AuthModal = ({ visible, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { login, register } = useAuth();

  const [api, contextHolder] = notification.useNotification();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      api.error({
        message: 'Ошибка валидации',
        description: 'Введите корректный email',
        placement: 'topRight',
        duration: 3,
      });
      return false;
    }

    if (!formData.password) {
      api.error({
        message: 'Ошибка валидации',
        description: 'Введите пароль',
        placement: 'topRight',
        duration: 3,
      });
      return false;
    }

    if (formData.password.length < 6) {
      api.error({
        message: 'Ошибка валидации',
        description: 'Пароль должен содержать не менее 6 символов',
        placement: 'topRight',
        duration: 3,
      });
      return false;
    }

    if (activeTab === 'register' && formData.password !== formData.confirmPassword) {
      api.error({
        message: 'Ошибка валидации',
        description: 'Пароли не совпадают',
        placement: 'topRight',
        duration: 3,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let result;
      if (activeTab === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password);
      }
      
      if (result.success) {
        api.success({
          message: activeTab === 'login' ? 'Вход выполнен!' : 'Регистрация успешна!',
          placement: 'topRight',
          duration: 2,
        });
        
        onAuthSuccess();
        onClose();
        
        setFormData({
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 50);
      } else {
        api.error({
          message: 'Ошибка авторизации',
          description: result.error || 'Неизвестная ошибка',
          placement: 'topRight',
          duration: 4,
        });
      }
    } catch (error) {
      api.error({
        message: 'Ошибка подключения',
        description: 'Не удалось подключиться к серверу',
        placement: 'topRight',
        duration: 4,
      });
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={activeTab === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
        open={visible}
        onCancel={handleClose}
        footer={null}
        width={400}
        destroyOnClose={true}
      >
        <div style={{ marginTop: 20 }}>
          <Input
            name="email"
            placeholder="Email"
            prefix={<UserOutlined />}
            value={formData.email}
            onChange={handleInputChange}
            style={{ marginBottom: 16 }}
            size="large"
            disabled={loading}
          />
          
          <Input.Password
            name="password"
            placeholder="Пароль"
            prefix={<LockOutlined />}
            value={formData.password}
            onChange={handleInputChange}
            style={{ marginBottom: 16 }}
            size="large"
            disabled={loading}
          />
          
          {activeTab === 'register' && (
            <Input.Password
              name="confirmPassword"
              placeholder="Подтвердите пароль"
              prefix={<LockOutlined />}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={{ marginBottom: 24 }}
              size="large"
              disabled={loading}
            />
          )}
          
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            block
            size="large"
            disabled={loading}
          >
            {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </div>
        
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button
            type="link"
            onClick={() => {
              const newTab = activeTab === 'login' ? 'register' : 'login';
              handleTabChange(newTab);
            }}
            style={{ padding: 0 }}
            disabled={loading}
          >
            {activeTab === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войти'}
          </Button>
        </div>
      </Modal>
    </>
  );
};