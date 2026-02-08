
import { useCallback, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`/php/login.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { 
          success: false, 
          error: data.message || 'Неверный email или пароль' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Ошибка подключения к серверу. Проверьте соединение.' 
      };
    }
  }, []);

  const register = useCallback(async (email, password) => {
    try {
      const response = await fetch(`/php/register.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { 
          success: false, 
          error: data.message || 'Ошибка регистрации' 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: 'Ошибка подключения к серверу. Проверьте соединение.' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    fetch('/php/logout.php', {
      method: 'POST',
    }).catch(console.error);
    
    localStorage.removeItem('auth_user');
    setUser(null);
  }, []);

  return { 
    user, 
    login, 
    register, 
    logout, 
    isAuthenticated: !!user 
  };
}