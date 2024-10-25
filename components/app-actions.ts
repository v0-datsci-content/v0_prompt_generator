'use server'

import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateAIPrompt(prevState: any, formData: FormData) {
  const category = formData.get('category') as string
  const style = formData.get('style') as string
  const mood = formData.get('mood') as string
  const palette = formData.get('palette') as string
  const fonts = formData.get('fonts') as string
  const customRequirement = formData.get('customRequirement') as string

  let prompt = `Generate a detailed prompt for v0.dev to create a ${category.toLowerCase()} `
  if (style) prompt += `with a ${style.toLowerCase()} style `
  if (mood) prompt += `that conveys a ${mood.toLowerCase()} mood `
  if (palette) prompt += `using the ${palette} color palette `
  if (fonts) prompt += `and ${fonts.toLowerCase()} fonts `
  if (customRequirement) prompt += `. Additional requirements: ${customRequirement}`
  prompt += `. The prompt should be specific, creative, and push the capabilities of v0.dev to its fullest.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating prompts for v0.dev, an AI-powered design tool."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
    })

    const generatedPrompt = completion.choices[0].message.content

    revalidatePath('/')
    return { message: generatedPrompt }
  } catch (error) {
    console.error('Error generating prompt:', error)
    return { error: 'Failed to generate prompt. Please try again.' }
  }
}