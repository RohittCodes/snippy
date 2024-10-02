import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Highlight, themes } from "prism-react-renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useSnippetStore from "@/lib/hooks/snippet"
import Link from 'next/link'
import { CopyIcon, EyeOpenIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function RecentSnippets() {
  const snippets = useSnippetStore((state) => state.snippets)
  const updateSnippet = useSnippetStore((state) => state.updateSnippet)
  const removeSnippet = useSnippetStore((state) => state.removeSnippet)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editLanguage, setEditLanguage] = useState('')

  const handleEdit = (snippet: typeof snippets[0]) => {
    setEditingId(snippet.id)
    setEditTitle(snippet.title)
    setEditCode(snippet.code)
    setEditLanguage(snippet.language)
  }

  const handleUpdate = (id: number) => {
    updateSnippet(id, { title: editTitle, code: editCode, language: editLanguage })
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editCode)
    alert('Code copied to clipboard')
  }

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto mt-8 h-[calc(100vh-10rem)]"
    >
      <ScrollArea>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {snippets.map((snippet) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{snippet.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingId === snippet.id ? (
                      <div className="space-y-2">
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
                        <Textarea
                          value={editCode}
                          onChange={(e) => setEditCode(e.target.value)}
                          placeholder="Code"
                          rows={5}
                        />
                        <div className="space-x-2">
                          <Button onClick={() => handleUpdate(snippet.id)}>Save</Button>
                          <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-muted-foreground mb-2">Language: {snippet.language}</div>
                        <Highlight theme={themes.nightOwl} code={snippet.code} language={snippet.language as any}>
                          {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre className={`${className} p-4 rounded overflow-x-auto relative`} style={style}>
                            <Button className="absolute top-1 right-1" size="icon" onClick={handleCopy}>
                              <CopyIcon />
                            </Button>
                              {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line, key: i })}>
                                  {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                  ))}
                                </div>
                              ))}
                            </pre>
                          )}
                        </Highlight>
                        <div className="mt-2 space-x-2">
                          <Button onClick={() => handleEdit(snippet)} size="sm">
                            <Pencil1Icon className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="destructive" onClick={() => removeSnippet(snippet.id)}>
                            <TrashIcon className="mr-2 h-4 w-4" /> Delete
                          </Button>
                          <Link href={`/${snippet.id}`}>
                            <Button variant="outline" size="sm">
                              <EyeOpenIcon className="mr-2 h-4 w-4" /> View
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </motion.div>
  )
}