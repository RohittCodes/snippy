"use client";

import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SnippetForm from './snippy-form'

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 shadow-md">
            <Link href="/">
                <span>
                    <span className="text-2xl font-bold">Snippy</span>
                    <span className="text-xs text-gray-500"> - code snippets manager</span>
                </span>
            </Link>
            <Dialog>
                <DialogTrigger className="bg-background px-4 py-2 text-primary rounded-md border">
                    Create Snippet
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            New Snippet
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Create a new snippet, and save it for later.
                    </DialogDescription>
                    <SnippetForm />
                </DialogContent>
            </Dialog>
        </nav>
    )
}