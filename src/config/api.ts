// API 配置設定
export interface ApiConfig {
  baseURL: string;
}

// 預設配置
export const defaultConfig: ApiConfig = {
  baseURL: 'http://localhost:8080'
};

// 從環境變量或localStorage讀取配置
export function loadApiConfig(): ApiConfig {
  // 優先從環境變量讀取
  if (import.meta.env.VITE_API_BASE_URL) {
    return {
      baseURL: import.meta.env.VITE_API_BASE_URL
    };
  }

  // 從localStorage讀取用戶自定義配置
  const savedConfig = localStorage.getItem('api_config');
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig);
      if (parsed.baseURL) {
        return parsed;
      }
    } catch (error) {
      console.warn('無法解析保存的API配置，使用預設配置');
    }
  }

  return defaultConfig;
}

// 保存配置到localStorage
export function saveApiConfig(config: ApiConfig): void {
  localStorage.setItem('api_config', JSON.stringify(config));
}

// 重置配置為預設值
export function resetApiConfig(): void {
  localStorage.removeItem('api_config');
}