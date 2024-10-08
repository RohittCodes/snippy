"use client"

import { motion } from 'framer-motion'
import useSnippetStore from '@/lib/hooks/snippet'
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core'
import RecentSnippets from '@/components/saved-snippy'
import { CopilotSidebar } from '@copilotkit/react-ui'

export default function CodeSnippetManager() {
  const snippets = useSnippetStore((state) => state.snippets)
  const addSnippet = useSnippetStore((state) => state.addSnippet)
  const updateSnippet = useSnippetStore((state) => state.updateSnippet)
  const removeSnippet = useSnippetStore((state) => state.removeSnippet)

  useCopilotReadable({
    description: 'A code snippet manager',
    value: snippets,
  })

  const addSnippetWithCheck = (args: { title: string, code: string, language: string, tags: string[] }) => {
    const existingSnippet = snippets.find(snippet => snippet.title === args.title && snippet.code === args.code && snippet.language === args.language)
    if (!existingSnippet) {
      addSnippet(args)
    }
  };

  useCopilotAction({
    name: "create-snippet",
    description: "Create a new code snippet",
    parameters: [
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
      title: string,
      code: string,
      language: string
      tags: string[]
    }) => {
      addSnippetWithCheck(args)
    },
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
      tags: string[]
    }) => {
      updateSnippet(args.id, { title: args.title, code: args.code, language: args.language, tags: args.tags })
    }
  })

  useCopilotAction({
    name: "delete-snippet",
    description: "Delete a code snippet",
    parameters: [
      {
        name: "id",
        description: "The id of the code snippet",
        type: "number",
      }
    ],
    handler: (args: {
      id: number
    }) => {
      removeSnippet(args.id)
    }
  })

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-8 my-2"
    >
      <RecentSnippets />
      <CopilotSidebar
        instructions={"You are assisting the user with managing and generating code snippets/complete pseudocodes. You can create, update, and delete these code snippets too. Add relevant tags to make it easier to search for snippets. Provide the snippet in different lines for better readability. Don't use escape characters like \\n, \\t, etc."}
        labels={{
          title: "Snippy - Code Snippet Manager",
          initial: "Hey there! 👋 How can I assist you?"
        }}
      />
    </motion.div>
  )
}