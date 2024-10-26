'use server'

import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

    // Store the input data and generated prompt in Supabase
    const { data, error } = await supabase
      .from('prompt_generations')
      .insert({
        category,
        style,
        mood,
        palette,
        fonts,
        custom_requirement: customRequirement,
        generated_prompt: generatedPrompt
      })

    if (error) {
      console.error('Error inserting data into Supabase:', error)
      // Note: We're not returning here because we still want to return the generated prompt to the user
    }

    revalidatePath('/')
    return { message: generatedPrompt }
  } catch (error) {
    console.error('Error generating prompt:', error)
    return { error: 'Failed to generate prompt. Please try again.' }
  }
}