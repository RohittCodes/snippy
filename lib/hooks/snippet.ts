import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Snippet {
  id: number
  title: string
  code: string
  language: string
  tags: string[]
}

interface SnippetStore {
  snippets: Snippet[]
  addSnippet: (snippet: Omit<Snippet, 'id'>) => void
  updateSnippet: (id: number, updatedSnippet: Partial<Omit<Snippet, 'id'>>) => void
  removeSnippet: (id: number) => void
}

const useSnippetStore = create<SnippetStore>()(
  persist(
    (set) => ({
      snippets: [],
      addSnippet: (newSnippet) =>
        set((state) => ({
          snippets: [...state.snippets, { ...newSnippet, id: Date.now() }],
        })),
      updateSnippet: (id, updatedSnippet) =>
        set((state) => ({
          snippets: state.snippets.map((snippet) =>
            snippet.id === id ? { ...snippet, ...updatedSnippet } : snippet
          ),
        })),
      removeSnippet: (id) =>
        set((state) => ({
          snippets: state.snippets.filter((snippet) => snippet.id !== id),
        })),
    }),
    {
      name: 'snippet-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useSnippetStore