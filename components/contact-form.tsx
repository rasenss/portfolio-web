"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Loader2, Paperclip, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ContactForm() {
  const { toast } = useToast()
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)

    // Validate file size and type
    const invalidFiles = newFiles.filter((file) => file.size > MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(file.type))

    if (invalidFiles.length > 0) {
      setError(`Some files were rejected. Files must be under 5MB and in a supported format (images, PDF, Word).`)
      // Filter out invalid files
      const validFiles = newFiles.filter((file) => file.size <= MAX_FILE_SIZE && ALLOWED_FILE_TYPES.includes(file.type))
      setFiles((prev) => [...prev, ...validFiles])
    } else {
      setFiles((prev) => [...prev, ...newFiles])
      setError(null)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("name", formState.name)
      formData.append("email", formState.email)
      formData.append("subject", formState.subject)
      formData.append("message", formState.message)

      // Add files to form data
      if (files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file)
        })
      }

      // Send to our API route
      const response = await fetch("/api/send-email", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your message has been sent successfully!",
        })

        // Reset form
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
        setFiles([])
      } else {
        throw new Error(data.error || "Failed to send message")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "There was an error sending your message. Please try again later.",
        variant: "destructive",
      })
      setError("Network or server error. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Input
            id="name"
            name="name"
            placeholder="Your Name"
            value={formState.name}
            onChange={handleChange}
            required
            className="py-4 sm:py-6 text-base"
          />
        </div>
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your Email"
            value={formState.email}
            onChange={handleChange}
            required
            className="py-4 sm:py-6 text-base"
          />
        </div>
      </div>
      <div>
        <Input
          id="subject"
          name="subject"
          placeholder="Subject"
          value={formState.subject}
          onChange={handleChange}
          required
          className="py-4 sm:py-6 text-base"
        />
      </div>
      <div>
        <Textarea
          id="message"
          name="message"
          placeholder="Message"
          className="min-h-[120px] sm:min-h-[150px] resize-none text-base"
          value={formState.message}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="files" className="flex items-center gap-2 cursor-pointer">
          <Paperclip className="h-4 w-4" />
          <span>Add attachments (optional)</span>
        </Label>
        <Input
          ref={fileInputRef}
          id="files"
          name="files"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2 text-sm">
                <div className="truncate max-w-[120px] sm:max-w-[200px]">{file.name}</div>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Supported formats: images, PDF, and Word documents. Max size: 5MB.
        </p>
      </div>

      <Button type="submit" className="w-full py-4 sm:py-6 text-base" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}