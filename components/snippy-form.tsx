import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "@copilotkit/react-textarea/styles.css";
import { CopilotTextarea } from "@copilotkit/react-textarea";
import useSnippetStore from "@/lib/hooks/snippet"

export default function SnippetForm() {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const addSnippet = useSnippetStore((state) => state.addSnippet)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && code) {
      addSnippet({ title, code, language })
      setTitle('')
      setCode('')
      setLanguage('javascript')
    }
  }

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter snippet title"
            required
          />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <div>
          <Label htmlFor="code">Code</Label>
            <CopilotTextarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 border rounded h-40"
                placeholder="Enter code snippet"
                required
                autosuggestionsConfig={{
                    textareaPurpose: `code snippet for ${language}`,
                    chatApiConfigs: {},
                }}
            />
        </div>
        <Button type="submit">Add Snippet</Button>
      </form>
    </motion.div>
  )
}