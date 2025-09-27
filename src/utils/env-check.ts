/**
 * 環境變數驗證工具
 * 用於檢查必要的環境變數是否已正確設定
 */

export interface EnvValidationResult {
  isValid: boolean
  missingVars: string[]
  errorMessage?: string
  setupInstructions?: string
}

/**
 * 驗證必要的環境變數
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const requiredVars = ['VITE_API_BASE_URL']
  const missingVars: string[] = []
  
  for (const varName of requiredVars) {
    const value = import.meta.env[varName]
    if (!value || value === 'undefined') {
      missingVars.push(varName)
    }
  }
  
  if (missingVars.length > 0) {
    const errorMessage = `❌ 缺少必要的環境變數: ${missingVars.join(', ')}`
    const setupInstructions = `
請按照以下步驟修復：

1. 在前端專案根目錄創建 .env 檔案
2. 添加以下內容：
   VITE_API_BASE_URL=http://localhost:8080

3. 重新啟動開發服務器：
   npm run dev

注意：.env 檔案應該放在 package.json 同一目錄下
    `.trim()
    
    return {
      isValid: false,
      missingVars,
      errorMessage,
      setupInstructions
    }
  }
  
  return {
    isValid: true,
    missingVars: []
  }
}

/**
 * 獲取API基礎URL，如果未設定則拋出錯誤
 */
export function getApiBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  
  if (!apiUrl || apiUrl === 'undefined') {
    throw new Error(`
❌ API基礎URL未設定！

請確保在 .env 檔案中設定：
VITE_API_BASE_URL=http://localhost:8080

當前值: ${apiUrl}
    `.trim())
  }
  
  return apiUrl
}

/**
 * 顯示環境變數錯誤對話框
 */
export function showEnvironmentError(result: EnvValidationResult): void {
  if (!result.isValid) {
    const fullMessage = `${result.errorMessage}\n\n${result.setupInstructions}`
    
    // 在控制台顯示詳細錯誤
    console.error('🚨 環境設定錯誤:', result.errorMessage)
    console.error('📋 設定指引:', result.setupInstructions)
    
    // 顯示用戶友好的錯誤對話框
    alert(fullMessage)
    
    // 在頁面上顯示錯誤信息
    const errorDiv = document.createElement('div')
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: monospace;
      ">
        <div style="
          background: #1a1a1a;
          color: #ff6b6b;
          padding: 2rem;
          border-radius: 8px;
          max-width: 600px;
          white-space: pre-line;
          border: 2px solid #ff6b6b;
        ">
          <h2 style="color: #ff6b6b; margin-top: 0;">🚨 環境設定錯誤</h2>
          <pre style="color: #fff; white-space: pre-wrap;">${fullMessage}</pre>
          <button onclick="location.reload()" style="
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
          ">重新載入頁面</button>
        </div>
      </div>
    `
    document.body.appendChild(errorDiv)
  }
}