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
import axios from 'axios'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerClose, DrawerTrigger, DrawerDescription } from '@/components/ui/drawer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type PerformanceAnalysis = {
  execution_time: number
  memory_usage: number
  cpu_usage: number
  time_complexity: string
}

export default function SnippetDetails({ params }: { params: { id: string } }) {
  const snippets = useSnippetStore((state) => state.snippets)
  const updateSnippet = useSnippetStore((state) => state.updateSnippet)

  const snippet = snippets.find(s => s.id === parseInt(params.id))

  const [title, setTitle] = useState(snippet?.title || '')
  const [code, setCode] = useState(snippet?.code || '')
  const [language, setLanguage] = useState(snippet?.language || 'javascript')
  const [tags, setTags] = useState<string[]>(snippet?.tags || [])

  const [isPerformanceLoading, setIsPerformanceLoading] = useState(false)
  const [performanceAnalysis, setPerformanceAnalysis] = useState<PerformanceAnalysis | null>(null)

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
      },
      {
        name: "tags",
        description: "The tags of the code snippet",
        type: "string[]",
      }
    ],
    handler: (args: {
      id: number,
      title: string,
      code: string,
      language: string,
      tags: string[],
    }) => {
      updateSnippet(args.id, { title: args.title, code: args.code, tags: args.tags, language: args.language })
    }
  })

  if (!snippet) {
    return <div>Snippet not found</div>
  }

  const handleUpdate = () => {
    updateSnippet(snippet.id, { title, code, language, tags })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    alert("Code copied to clipboard")
  }

  const handlePerformanceAnalysis = async () => {
    try {
      setIsPerformanceLoading(true);

      const response = await axios.post('/api/performance', {
        code: snippet.code,
        language: snippet.language,
      });

      console.log('Raw Response:', response.data);

      const cleanedResponse = response.data.trim().replace(/```/g, '');
      const parsedPerformanceAnalysis = JSON.parse(cleanedResponse);

      setPerformanceAnalysis(parsedPerformanceAnalysis);
      console.log('Execution Time:', parsedPerformanceAnalysis.execution_time);

      setIsPerformanceLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsPerformanceLoading(false);
    }
  };

  const chartData = performanceAnalysis ? [
    { name: 'Execution Time', value: performanceAnalysis.execution_time },
    { name: 'Memory Usage', value: performanceAnalysis.memory_usage },
    { name: 'CPU Usage', value: performanceAnalysis.cpu_usage },
  ] : [];

  return (
    <div className="flex flex-col justify-between h-full mx-4 my-4">
      <ScrollArea className="flex-1 py-4 px-2 rounded-lg bg-background">
        <div className="flex justify-between items-center m-1">
          <div>
            <h3 className="text-xl font-semibold mb-2">{snippet.title}</h3>
            <p className="text-sm text-gray-500 mb-4">Language: {snippet.language}</p>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
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
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={tags.join(',')}
                      onChange={(e) => setTags(e.target.value.split(','))}
                      placeholder="Enter tags separated by commas"
                    />
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
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" onClick={handlePerformanceAnalysis}>Performance Analysis</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-4xl">
                  <DrawerHeader>
                    <DrawerTitle>Performance Analysis</DrawerTitle>
                    <DrawerDescription>
                      This is a detailed analysis of the performance of the code snippet for the worst-case scenario.
                    </DrawerDescription>
                  </DrawerHeader>
                  {
                    isPerformanceLoading ? (
                      <div className="text-center">Analyzing performance...</div>
                    ) : performanceAnalysis ? (
                      <div className="w-full space-y-4">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col justify-center items-center space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>Execution Time: {performanceAnalysis.execution_time}ms</div>
                            <div>Memory Usage: {performanceAnalysis.memory_usage}MB</div>
                            <div>CPU Usage: {performanceAnalysis.cpu_usage}%</div>
                            <div>Time Complexity: {performanceAnalysis.time_complexity}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>Failed to analyze performance. Try again later.</div>
                    )
                  }
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
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
      </ScrollArea>
      <div className="">
        <div className="bg-primary px-4 py-2 h-16 flex items-center justify-between text-background font-semibold text-lg">
          Snippy - Code Snippet Manager
        </div>
        <CopilotChat
          className="h-72 border"
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