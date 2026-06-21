"use client"

import { useEffect, useState } from "react"
import { CheckIcon, Plus } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { PostDetail } from "@/lib/api-helper"
import Link from "next/link"


function formatDate(dateStr: string | null) {
    if (!dateStr) return "—"
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(dateStr))
}

export default function PostsTable() {
    const [posts, setPosts] = useState<PostDetail[]>([])
    const [postsLoaded, setPostsLoaded] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    useEffect(() => {
        fetch("/api/posts")
            .then((res) => res.json())
            .then(setPosts)
            .catch(() => { })
            .finally(() => setPostsLoaded(true))
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Published Posts</h2>
                    <p className="text-sm text-muted-foreground">
                        All posts published from your Slack Workspace using the Sloogle Bot. All posts are publicly accessible and indexed on search engines.
                    </p>
                </div>

                <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Post</DialogTitle>
                            <DialogDescription>
                                The message must be within your Slack workspace and in a channel Sloogle has access to.
                            </DialogDescription>
                        </DialogHeader>

                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Message URL or ID</Label>
                                <Input
                                    type="text"
                                    id="message-reference"
                                    name="message-reference"
                                    placeholder="https://yourworkspace.slack.com/archives/channel-id/p-ts"
                                />
                            </Field>
                        </FieldGroup>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : <CheckIcon />}
                                {loading ? "Creating Post" : "Create Post"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Channel</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Message URL</TableHead>
                            <TableHead>Workspace</TableHead>
                            <TableHead>Delete After</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ?
                            <>
                                {
                                    postsLoaded ?
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                No Posts yet.
                                            </TableCell>
                                        </TableRow>
                                        :
                                        <>
                                            {[1, 2, 3, 4, 5].map((_) => (
                                                <TableRow key={_}>
                                                    <TableCell colSpan={6} className="h-10 w-full text-center text-muted-foreground">
                                                        <Skeleton className="h-full w-full rounded-full" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                }
                            </> : (
                                posts.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{formatDate(p.createdAt)}</TableCell>

                                        <TableCell>
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                                                #{p.channel?.name ?? p.channel?.id}
                                            </code>
                                        </TableCell>

                                        <TableCell>
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                                                {p.message?.text_preview}...
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Link target="_blank" href={`https://${p.workspace?.domain}.slack.com/archives/${p.channel_id}/p${p.message_id.replace(".", "")}`}>
                                                {`${p.channel_id}/p${p.message_id.replace(".", "")}`}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {p.workspace?.name ?? p.workspace?.domain}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(p.deleteAfter)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
