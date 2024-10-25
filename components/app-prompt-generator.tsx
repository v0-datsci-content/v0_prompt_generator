'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { generateAIPrompt } from './app-actions'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Copy, Loader2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate AI-Powered Prompt'
      )}
    </Button>
  )
}

export function PromptGenerator() {
  const [category, setCategory] = useState('')
  const [style, setStyle] = useState('')
  const [mood, setMood] = useState('')
  const [palette, setPalette] = useState('')
  const [fonts, setFonts] = useState('')
  const [customRequirement, setCustomRequirement] = useState('')

  const [state, formAction] = useFormState(generateAIPrompt, { message: '' })

  const categories = ['Chart', 'Landing Page', 'Dashboard', 'Form', 'E-commerce', 'Blog', 'Portfolio', 'Marketing']
  const styles = ['Minimalist', 'Modern', 'Retro', 'Futuristic', 'Elegant', 'Playful', 'Corporate', 'Artistic']
  const moods = ['Professional', 'Cheerful', 'Serious', 'Relaxed', 'Energetic', 'Mysterious', 'Luxurious', 'Friendly']
  const palettes = [
    { name: 'Classic Blue', colors: ['#0a192f', '#172a45', '#303C55', '#8892b0', '#ccd6f6'] },
    { name: 'Earthy Tones', colors: ['#d4a373', '#fefae0', '#faedcd', '#e9edc9', '#ccd5ae'] },
    { name: 'Pastel Dream', colors: ['#f9e2af', '#fdf6e3', '#f8e2cf', '#f5cac3', '#f28482'] },
    { name: 'Vibrant Pop', colors: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'] },
    { name: 'Monochrome Gray', colors: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'] },
    { name: 'Ocean Breeze', colors: ['#05668d', '#028090', '#00a896', '#02c39a', '#f0f3bd'] },
  ]
  const fontOptions = ['Sans-serif', 'Serif', 'Monospace', 'Display', 'Handwriting']

  const copyToClipboard = () => {
    if (state.message) {
      navigator.clipboard.writeText(state.message)
      toast.success('Prompt copied to clipboard!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">v0.dev AI-Powered Prompt Generator</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" onValueChange={setCategory} value={category}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="style">Style</Label>
          <Select name="style" onValueChange={setStyle} value={style}>
            <SelectTrigger id="style">
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="mood">Mood</Label>
          <Select name="mood" onValueChange={setMood} value={mood}>
            <SelectTrigger id="mood">
              <SelectValue placeholder="Select a mood" />
            </SelectTrigger>
            <SelectContent>
              {moods.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="palette">Color Palette</Label>
          <Select name="palette" onValueChange={setPalette} value={palette}>
            <SelectTrigger id="palette">
              <SelectValue placeholder="Select a color palette" />
            </SelectTrigger>
            <SelectContent>
              {palettes.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  <div className="flex items-center">
                    <span>{p.name}</span>
                    <div className="ml-2 flex">
                      {p.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full mr-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fonts">Fonts</Label>
          <Select name="fonts" onValueChange={setFonts} value={fonts}>
            <SelectTrigger id="fonts">
              <SelectValue placeholder="Select a font style" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font} value={font}>{font}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="customRequirement">Custom Requirements</Label>
          <Textarea
            id="customRequirement"
            name="customRequirement"
            placeholder="Any additional requirements or details"
            value={customRequirement}
            onChange={(e) => setCustomRequirement(e.target.value)}
          />
        </div>
        <SubmitButton />
      </form>
      {state.message && (
        <div className="mt-6 p-4 bg-muted rounded-md relative">
          <h2 className="text-lg font-semibold mb-2">Generated AI Prompt:</h2>
          <p className="text-sm whitespace-pre-wrap">{state.message}</p>
          <Button
            onClick={copyToClipboard}
            className="absolute top-2 right-2"
            size="icon"
            variant="ghost"
            aria-label="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
      {state.error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
          {state.error}
        </div>
      )}
      <ToastContainer />
    </div>
  )
}