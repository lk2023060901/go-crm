import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User, Tenant, LoginRequest, LoginResponse } from '@/types/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tenant: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });

        try {
          // TODO: 调用真实的登录 API
          // const response = await authApi.login(credentials);

          // Mock 数据用于开发，根据 tenantCode 动态生成
          const tenantName = credentials.tenantCode === 'demo' ? 'Demo 公司' : `${credentials.tenantCode?.toUpperCase()} 企业`;

          const mockResponse: LoginResponse = {
            user: {
              id: '1',
              username: credentials.username,
              email: `${credentials.username}@${credentials.tenantCode}.com`,
              firstName: '管理',
              lastName: '员',
              fullName: '管理员',
              status: 'active',
              roles: [
                {
                  id: '1',
                  name: '系统管理员',
                  code: 'admin',
                  permissions: []
                }
              ],
              orgId: `org-${credentials.tenantCode}`,
              tenantId: `tenant-${credentials.tenantCode}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            tenant: {
              id: `tenant-${credentials.tenantCode}`,
              name: tenantName,
              code: credentials.tenantCode || 'demo',
              domain: `${credentials.tenantCode}.erp.com`,
              plan: 'professional',
              status: 'active',
              settings: {
                theme: 'light',
                language: 'zh-CN',
                timezone: 'Asia/Shanghai',
                features: ['crm', 'system']
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            token: `mock-jwt-token-${credentials.tenantCode}`,
            refreshToken: `mock-refresh-token-${credentials.tenantCode}`,
            expiresIn: 86400
          };

          set({
            user: mockResponse.user,
            tenant: mockResponse.tenant,
            token: mockResponse.token,
            refreshToken: mockResponse.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          tenant: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      refreshToken: async () => {
        const { refreshToken: currentRefreshToken } = get();

        if (!currentRefreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          // TODO: 调用真实的刷新 token API
          // const response = await authApi.refreshToken(currentRefreshToken);

          // Mock 刷新
          set({
            token: 'new-mock-jwt-token',
            refreshToken: 'new-mock-refresh-token'
          });
        } catch (error) {
          // 刷新失败，退出登录
          get().logout();
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData }
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);