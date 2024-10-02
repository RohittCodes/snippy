"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { CopilotChat } from '@copilotkit/react-ui'
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core'

import { Highlight, themes } from "prism-react-renderer"
import useSnippetStore from '@/lib/hooks/snippet'
import { CopyIcon } from '@radix-ui/react-icons'

export default function SnippetDetails({ params }: { params: { id: string } }) {
  const snippets = useSnippetStore((state) => state.snippets)
  const updateSnippet = useSnippetStore((state) => state.updateSnippet)

  const snippet = snippets.find(s => s.id === parseInt(params.id))

  const [title, setTitle] = useState(snippet?.title || '')
  const [code, setCode] = useState(snippet?.code || '')
  const [language, setLanguage] = useState(snippet?.language || 'javascript')

  useCopilotReadable({
    description: 'A code snippet',
    value: snippet || {},
  })

  useCopilotAction({
    name: "update-snippet",
    description: "Update a code snippet",
    parameters: [
      {
        name: "id",
        description: "The id of the code snippet",
        type: "number",
      },
      {
        name: "title",
        description: "The title of the code snippet",
        type: "string",
      },
      {
        name: "code",
        description: "The code snippet",
        type: "string",
      },
      {
        name: "language",
        description: "The language of the code snippet",
        type: "string",
      }
    ],
    handler: (args: {
      id: number,
      title: string,
      code: string,
    }) => {
      updateSnippet(args.id, { title: args.title, code: args.code })
    }
  })

  if (!snippet) {
    return <div>Snippet not found</div>
  }

  const handleUpdate = () => {
    updateSnippet(snippet.id, { title, code, language })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    alert("Code copied to clipboard")
  }

  return (
    <div className="flex flex-col justify-between h-full mx-4 my-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-xl font-semibold mb-2">{snippet.title}</h3>
            <p className="text-sm text-gray-500 mb-4">Language: {snippet.language}</p>
          </div>
          <Dialog>
            <DialogTrigger className="bg-background px-4 py-2 text-primary rounded-md border mt-4 text-sm">
              Edit
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <h2 className="text-xl font-semibold">Edit Snippet</h2>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 max-w-2xl">
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
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Textarea
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your code here"
                    rows={10}
                    required
                  />
                </div>
                <div className="space-x-2">
                  <Button onClick={handleUpdate}>Save Changes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Highlight theme={themes.nightOwl} code={snippet.code} language={snippet.language || 'javascript'}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} p-4 rounded overflow-x-auto relative`} style={style}>
              <Button className="absolute top-1 right-1" size="icon" onClick={handleCopy}>
                <CopyIcon />
              </Button>
              {tokens.map((line, i) => {
                const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
                return (
                  <div key={lineKey as React.Key} {...lineProps}>
                    {line.map((token, key) => {
                      const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key })
                      return <span key={tokenKey as React.Key} {...tokenProps} />;
                    })}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
      <div className="">
        <div className="bg-indigo-500 px-4 py-2 h-16 flex items-center justify-between text-background font-semibold text-lg">
          Snippy - Code Snippet Manager
        </div>
        <CopilotChat
          className="h-96 border"
          instructions={"You are assisting the user with a code snippet. You can help them update the snippet by providing the new title and code."}
          labels={{
            title: "Snippy - Code Snippet Manager",
            initial: "Hi there! 👋 How can I assist you?"
          }}
        />
      </div>
    </div>
  )
}
