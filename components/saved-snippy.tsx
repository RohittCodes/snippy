"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CopilotTextarea } from "@copilotkit/react-textarea"
import { Highlight, themes } from "prism-react-renderer"
import useSnippetStore from '@/lib/hooks/snippet'
import { CopyIcon, Pencil1Icon, TrashIcon, EyeOpenIcon, TextIcon } from '@radix-ui/react-icons'
import { Badge } from "@/components/ui/badge"

interface Snippet {
  id: number
  title: string
  code: string
  language: string
  tags: string[]
}

export default function RecentSnippets() {
  const snippets = useSnippetStore((state) => state.snippets as Snippet[])
  const updateSnippet = useSnippetStore((state) => state.updateSnippet)
  const removeSnippet = useSnippetStore((state) => state.removeSnippet)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editLanguage, setEditLanguage] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const handleEdit = (snippet: Snippet) => {
    setEditingId(snippet.id)
    setEditTitle(snippet.title)
    setEditCode(snippet.code)
    setEditLanguage(snippet.language || '')
    setEditTags(snippet.tags || [])
  }

  const handleUpdate = (id: number) => {
    updateSnippet(id, { title: editTitle, code: editCode, language: editLanguage, tags: editTags })
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard')
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTags(e.target.value.split(',').map(tag => tag.trim()))
  }

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch = snippet.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.code?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage ? snippet.language === selectedLanguage : true
    const matchesTag = selectedTag ? snippet.tags?.includes(selectedTag) : true
    return matchesSearch && matchesLanguage && matchesTag
  })

  const uniqueLanguages = Array.from(new Set((snippets || []).map(snippet => snippet.language || '')));
  const uniqueTags = Array.from(new Set((snippets || []).flatMap(snippet => snippet.tags || [])));

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto h-full flex flex-col space-y-4"
    >
      <Input
        type="text"
        placeholder="Search snippets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-12"
      />
      <ScrollArea className="w-full whitespace-nowrap h-12">
        <div className="flex w-max space-x-4">
          <Button
            onClick={() => {
              setSelectedLanguage(null)
              setSelectedTag(null)
            }}
            variant={!selectedLanguage && !selectedTag ? "default" : "outline"}
          >
            All
          </Button>
          {uniqueLanguages.map((language) => (
            <Button
              key={language}
              onClick={() => {
                setSelectedLanguage(language)
                setSelectedTag(null)
              }}
              variant={selectedLanguage === language ? "default" : "outline"}
            >
              {language}
            </Button>
          ))}
          {uniqueTags.map((tag) => (
            <Button
              key={tag}
              onClick={() => {
                setSelectedTag(tag)
                setSelectedLanguage(null)
              }}
              variant={selectedTag === tag ? "default" : "outline"}
            >
              <TextIcon className="mr-1 h-3 w-3" />
              {tag}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {filteredSnippets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]"
        >
          <p className="text-lg text-muted-foreground">No snippets found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
        >
          <AnimatePresence>
            {filteredSnippets.map((snippet) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{snippet.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">Language: {snippet.language || 'N/A'}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(snippet.tags || []).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <TextIcon className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {editingId === snippet.id ? (
                      <div className="space-y-2 h-full flex flex-col">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                        <select
                          value={editLanguage}
                          onChange={(e) => setEditLanguage(e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="css">CSS</option>
                          <option value="html">HTML</option>
                        </select>
                        <Input
                          value={editTags.join(', ')}
                          onChange={handleTagChange}
                          placeholder="Tags (comma-separated)"
                        />
                        <CopilotTextarea
                          autosuggestionsConfig={{
                            textareaPurpose: `code snippet for ${editLanguage}`,
                            chatApiConfigs: {},
                          }}
                          className="flex-grow w-full p-2 border rounded"
                          value={editCode}
                          onChange={(e) => setEditCode(e.target.value)}
                          placeholder="Code"
                        />
                      </div>
                    ) : (
                      <ScrollArea className="h-[150px] w-full rounded-md border" dir="ltr">
                        <Highlight theme={themes.nightOwl} code={snippet.code} language={snippet.language || 'javascript'}>
                          {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre className={`${className} p-4 h-full rounded`} style={style}>
                              {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line, key: i })} className="text-sm">
                                  {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                  ))}
                                </div>
                              ))}
                            </pre>
                          )}
                        </Highlight>
                        <ScrollBar orientation="horizontal" />
                        <ScrollBar orientation="vertical" />
                      </ScrollArea>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-4">
                    {editingId === snippet.id ? (
                      <>
                        <Button onClick={() => handleUpdate(snippet.id)} size="sm" variant="default">Save</Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <div className="space-x-2">
                          <Button onClick={() => handleEdit(snippet)} size="sm">
                            <Pencil1Icon className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="destructive" onClick={() => removeSnippet(snippet.id)} size="sm">
                            <TrashIcon className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleCopy(snippet.code)}>
                            <CopyIcon className="mr-2 h-4 w-4" /> Copy
                          </Button>
                          <Link href={`/${snippet.id}`}>
                            <Button variant="outline" size="sm">
                              <EyeOpenIcon className="mr-2 h-4 w-4" /> View
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                    <Button size="sm" onClick={() => handleCopy(snippet.code)}><CopyIcon className="mr-1" /> Copy</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}
