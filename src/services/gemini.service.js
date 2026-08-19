// Gemini AI Service — direct API call from frontend
// API Key is stored in .env as VITE_GEMINI_API_KEY

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent'

export const geminiService = {
  async generate(prompt) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('សូមបន្ថែម VITE_GEMINI_API_KEY ទៅក្នុងឯកសារ .env របស់អ្នក។')
    }

    let response
    try {
      response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      })
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        throw new Error('បញ្ហាបណ្តាញ (Failed to fetch): មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ។ សូមពិនិត្យអ៊ីនធឺណិតរបស់អ្នក ឬសាកល្បងម្ដងទៀត។')
      }
      throw new Error(`មានបញ្ហាទូទៅ: ${err.message}`)
    }

    if (!response.ok) {
      const err = await response.json()
      const errMsg = err?.error?.message || 'Gemini API error'
      
      if (errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('exceeded') || response.status === 429) {
        throw new Error('អ្នកបានប្រើប្រាស់អស់ចំនួនកំណត់ហើយ (Quota Exceeded)។ សូមរង់ចាំមួយសន្ទុះសិនមុននឹងសាកល្បងម្ដងទៀត។')
      }
      
      throw new Error(`មានបញ្ហាពីម៉ាស៊ីនមេ: ${errMsg}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }
}
