import { defineStore } from 'pinia'
import { ref } from 'vue'
import { geminiService } from '../services/gemini.service'

export const useMarketingStore = defineStore('marketing', () => {
  const loading = ref(false)
  const error = ref(null)

  const selectedProduct = ref('')
  const platform = ref('Facebook')
  const language = ref('Khmer')
  const tone = ref('Friendly')
  const generatedContent = ref('')

  async function generateContent() {
    if (!selectedProduct.value) return
    loading.value = true
    error.value = null
    generatedContent.value = ''

    try {
      const prompt = `
You are a marketing copywriter for a retail business.

Create a social media post for:
- Product: ${selectedProduct.value}
- Platform: ${platform.value}
- Language: ${language.value}
- Tone: ${tone.value}

Rules:
- If language is Khmer, write primarily in Khmer script with minimal English
- If language is English, write in English
- Platform ${platform.value}: ${platform.value === 'Facebook' ? 'longer post, use emojis, include hashtags' : 'shorter concise message, use emojis'}
- Tone ${tone.value}: ${tone.value === 'Professional' ? 'formal, business-like' : tone.value === 'Friendly' ? 'warm, casual, approachable' : 'exciting, urgent, promotional with discounts'}
- Include a call to action
- Make it engaging and persuasive

Return only the post content, no explanations.`

      generatedContent.value = await geminiService.generate(prompt)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    loading, error,
    selectedProduct, platform, language, tone, generatedContent,
    generateContent
  }
})
