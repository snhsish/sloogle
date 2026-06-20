"use client"

import { useEffect, useState } from "react"
import { CheckIcon, CopyIcon, Plus } from "lucide-react"
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
import { Field, FieldGroup } from "./ui/field"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Spinner } from "./ui/spinner"
import { Skeleton } from "./ui/skeleton"

type ApiKey = {
  id: string
  name: string
  keyPrefix: string
  isActive: boolean
  expiresAt: string | null
  lastUsedAt: string | null
  createdAt: string
  isNewKey?: boolean
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateStr))
}

export default function ApiKeysTable() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [keysLoaded, setKeysLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>("")
  const [newKeyExpires, setNewKeyExpires] = useState<string>("")
  const [newRawKey, setNewRawKey] = useState<string>("")

  useEffect(() => {
    fetch("/api/keys")
      .then((res) => res.json())
      .then(setKeys)
      .catch(() => { })
      .finally(() => setKeysLoaded(true))
  }, [])


  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const createAPIKey = async () => {
    setLoading(true)

    try {
      const data = await fetch("/api/keys/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName,
          expriesAt: newKeyExpires
        })
      })
        .then((r) => r.json())

      if (data && data.id) {
        if (data.key) setNewRawKey(data.key)

        const newKey: ApiKey = {
          id: data.id,
          name: data.name,
          keyPrefix: data.key,
          isActive: data.isActive,
          expiresAt: data.expiresAt,
          lastUsedAt: data.lastUsedAt,
          createdAt: data.createdAt,
          isNewKey: true
        }

        setKeys((prev) => [
          newKey,
          ...prev,
        ]);

        setLoading(false);
        setModalIsOpen(false);
      }
    }
    catch (e) {
      setErrorMessage("Could not create a key. Please retry.")
      setLoading(false)
      console.log(e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">API Keys</h2>
          <p className="text-sm text-muted-foreground">
            Manage your API keys. API keys are used by the Sloogle bot to create and manage posts.
          </p>
        </div>

        <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new API Key</DialogTitle>
              <DialogDescription>
                The key will be visible only once. Copy and store it. All keys are encrypted upon creation before saving them in our database.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="My Key"
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="expiry">Expiry (optional)</Label>
                <Input
                  type="date"
                  id="expiry"
                  name="expiry"
                  placeholder="Date"
                  onChange={(e) => setNewKeyExpires(e.target.value)}
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={createAPIKey}
                disabled={loading}
              >
                {loading ? <Spinner /> : <CheckIcon />}
                {loading ? "Creating Key" : "Create Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length === 0 ?
              <>
                {
                  keysLoaded ?
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No API keys yet.
                      </TableCell>
                    </TableRow>
                    :
                    <>
                      {[1, 2].map((_) => (
                        <TableRow key={_}>
                          <TableCell colSpan={6} className="h-10 w-full text-center text-muted-foreground">
                            <Skeleton className="h-full w-full rounded-full" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                }
              </> : (
                keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      {key.isNewKey ?
                        <div className="flex items-center gap-4">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                            {key.keyPrefix}
                          </code>

                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => handleCopy(key.keyPrefix)}
                          >
                            <CopyIcon />
                          </Button>
                        </div>
                        :
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                          {key.keyPrefix}...
                        </code>
                      }
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${key.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                      >
                        {key.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(key.lastUsedAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(key.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(key.expiresAt)}
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
