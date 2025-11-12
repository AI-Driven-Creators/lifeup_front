// JWT Token 管理工具

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

/**
 * 儲存 JWT token 到 localStorage
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 從 localStorage 獲取 JWT token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 移除 JWT token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 檢查是否有 token
 */
export function hasToken(): boolean {
  return !!getToken();
}

/**
 * 儲存當前用戶信息
 */
export function setCurrentUser(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * 獲取當前用戶信息
 */
export function getCurrentUser(): any | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('解析用戶數據失敗:', e);
    return null;
  }
}

/**
 * 移除當前用戶信息
 */
export function removeCurrentUser(): void {
  localStorage.removeItem(USER_KEY);
}

/**
 * 登出：清除所有認證信息
 */
export function logout(): void {
  removeToken();
  removeCurrentUser();
  // 可以在這裡添加其他清理邏輯
  console.log('用戶已登出');
}

/**
 * 解析 JWT token（不驗證簽名，僅提取 payload）
 */
export function parseJWT(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('解析 JWT 失敗:', e);
    return null;
  }
}

/**
 * 檢查 token 是否過期
 */
export function isTokenExpired(token?: string | null): boolean {
  const tokenToCheck = token || getToken();
  if (!tokenToCheck) return true;

  const payload = parseJWT(tokenToCheck);
  if (!payload || !payload.exp) return true;

  // exp 是秒為單位的時間戳
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
}

/**
 * 獲取 token 剩餘有效時間（毫秒）
 */
export function getTokenRemainingTime(token?: string | null): number {
  const tokenToCheck = token || getToken();
  if (!tokenToCheck) return 0;

  const payload = parseJWT(tokenToCheck);
  if (!payload || !payload.exp) return 0;

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const remaining = expirationTime - currentTime;

  return remaining > 0 ? remaining : 0;
}

/**
 * 檢查並處理 token 過期
 * @returns true 如果 token 有效，false 如果已過期
 */
export function checkAndHandleTokenExpiration(): boolean {
  if (isTokenExpired()) {
    console.warn('Token 已過期，正在登出...');
    logout();
    // 可以觸發導航到登入頁面
    // window.location.href = '/login';
    return false;
  }
  return true;
}

/**
 * 帶有 JWT 認證的 fetch 封裝
 * 自動添加 Authorization header
 */
export async function fetchWithAuth(url: string | URL, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  // 準備請求頭
  const headers: HeadersInit = {
    ...options.headers,
  };

  // 添加 JWT token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 執行請求
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 處理 401 錯誤
  if (response.status === 401) {
    console.warn('收到 401 錯誤，token 可能無效');
    logout();
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('清除儲存失敗:', e);
      }
      window.location.href = '/auth/login';
    }
  }

  return response;
}
