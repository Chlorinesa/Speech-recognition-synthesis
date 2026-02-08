import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Button, ConfigProvider, Layout, Menu, theme, Spin, Popconfirm } from 'antd';
import { 
  SoundOutlined, 
  AudioOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  SunOutlined, 
  MoonOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined 
} from '@ant-design/icons';

import ru_RU from 'antd/locale/ru_RU';
import logoFull from '/img/logoFull.svg';
import logoShort from '/img/logoShort.svg';

import { useAuth } from './hooks/useAuth';
import { AuthModal } from './User/AuthModal';
import { Profile } from './User/Profile';

const { Header, Sider, Content } = Layout;

const TextToSpeech = lazy(() => import('./TextTS/TextToSpeech.jsx'));
const SpeechToText = lazy(() => import('./SpeechTT/SpeechToText.jsx'));

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('tts');
  const [themeMode, setThemeMode] = useState('light');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();

  const themeConfig = useMemo(() => ({
    algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: { colorPrimary: '#1a5089' }
  }), [themeMode]);


  const menuItems = useMemo(()=>{
    const baseItems = [
      { 
        key: 'tts', 
        icon: <SoundOutlined />, 
        label: 'TTS - Синтез речи' 
      },
      { 
        key: 'stt', 
        icon: <AudioOutlined />, 
        label: 'STT - Распознавание речи',
      }
    ];
    return  isAuthenticated
    ?[
      ...baseItems,
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'История',
      }
    ]
    :baseItems;
  }, [isAuthenticated]);
    


  return (
    <ConfigProvider theme={themeConfig} locale={ru_RU}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          collapsible 
          collapsed={collapsed} 
          trigger={null}
          style={{ 
            boxShadow: '0px 0px 10px 0px #001529',
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0
          }}
        >
          <div className='sideLogo'>
            <img
              src={collapsed ? logoShort : logoFull}
              alt="logo"
              style={{ maxHeight: '100%', maxWidth: '100%', userSelect: 'none' }}
            />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['tts']}
            selectedKeys={[selectedTab]}
            onClick={({ key }) => setSelectedTab(key)}
            style={{ userSelect: 'none' }}
            items={menuItems}
          />
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
          <Header
            style={{
              padding: '0 24px',
              background: themeMode === 'dark' ? '#141414' : '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 64,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ width: 48, height: 48 }}
              />
              <h2 style={{ 
                margin: 0, 
                color: themeMode === 'dark' ? '#fff' : '#141414',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {selectedTab === 'tts' && 'Синтез речи (Text-to-Speech)'}
                {selectedTab === 'stt' && 'Распознавание речи (Speech-to-Text)'}
                {selectedTab === 'profile' && 'История'}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 16 }}>
            <h4 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginTop: '8px' 
            }} >{isAuthenticated ? user.email: ''}</h4>
              
              <Popconfirm
              title="Вы уверены, что хотите выйти из аккаунта?"
              onConfirm={logout}
              okText="Выйти"
              cancelText="Отмена"
              visible={isAuthenticated && showConfirm}
              onCancel={() => setShowConfirm(false)}
            >
              <Button 
                type="primary" 
                icon={isAuthenticated ? <LogoutOutlined /> : <LoginOutlined />}
                onClick={() => isAuthenticated ? setShowConfirm(true) : setShowAuthModal(true)}
              >
                {isAuthenticated ? 'Выйти' : 'Войти'}
              </Button>
              
              
            </Popconfirm>
            <Button
                type="text"
                icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />}
                onClick={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
                style={{ width: 48, height: 48 }}
              />
            </div>
          </Header>

          <Content
            style={{
              padding: '24px',
              minHeight: 'calc(100vh - 64px)',
              background: themeMode === 'dark' ? '#141414' : '#fff',
              transition: 'background 0.3s'
            }}
          >
            <Suspense fallback={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
              }}>
                <Spin size="large" />
              </div>
            }>
              {selectedTab === 'tts' && <TextToSpeech themeMode={themeMode } />}
              {selectedTab === 'stt' && <SpeechToText themeMode={themeMode} />}
              {selectedTab === 'profile' && isAuthenticated && (
                <Profile themeMode={themeMode} />
              )}
            </Suspense>
          </Content>
        </Layout>
      </Layout>

      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          setShowAuthModal(false);
          setSelectedTab('profile');
          
        }}
        themeMode={themeMode}
      />
    </ConfigProvider>
  );
}