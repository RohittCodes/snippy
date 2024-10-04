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
import { ModeToggle } from './ui/mode-toggle';
import { Button } from './ui/button';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 shadow-md">
            <Link href="/">
                <span>
                    <span className="text-2xl font-bold">Snippy</span>
                    <span className="text-xs text-gray-500"> - code snippets manager</span>
                </span>
            </Link>
            <div className="flex items-center space-x-2">
                <a href="https://codemonkey-js.vercel.app/app/problems">
                    <Button>
                        Try some code
                    </Button>
                </a>
                <Dialog>
                    <DialogTrigger className="bg-background px-4 py-1 text-primary rounded-md border">
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
                <ModeToggle />
            </div>
        </nav>
    )
}