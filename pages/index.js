import { useState } from 'react'

export default function Home() {
  const [imagePrompt, setImagePrompt] = useState('')
  const [codePrompt, setCodePrompt] = useState('')
  const [musicPrompt, setMusicPrompt] = useState('')
  const [soundPrompt, setSoundPrompt] = useState('')
  const [storyPrompt, setStoryPrompt] = useState('')
  
  const [loading, setLoading] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [generatedMusic, setGeneratedMusic] = useState('')
  const [generatedSound, setGeneratedSound] = useState('')
  const [generatedStory, setGeneratedStory] = useState('')

  // Görsel Üretme (Test Modu)
  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('image')
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedImage(data.testImage)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  // Kod Yazma
  const generateCode = async () => {
    if (!codePrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('code')
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: codePrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedCode(data.code)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  // Müzik Oluşturma
  const generateMusic = async () => {
    if (!musicPrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('music')
    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedMusic(data.audioUrl)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  // Ses Efekti
  const generateSound = async () => {
    if (!soundPrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('sound')
    try {
      const response = await fetch('/api/generate-sound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: soundPrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedSound(data.audioUrl)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  // Hikaye/Diyalog
  const generateStory = async () => {
    if (!storyPrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('story')
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: storyPrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedStory(data.text)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
