"use server"

import { z } from "zod"

// Using Resend (modern email API designed for developers)
import { Resend } from "resend"

// Configure environment variables in your project settings
const RESEND_API_KEY = process.env.RESEND_API_KEY || "your-resend-api-key"
const RECIPIENT_EMAIL = "rasuen27@gmail.com"
const FROM_EMAIL = "contact@yourdomain.com" // Use a domain you've verified with Resend

const resend = new Resend(RESEND_API_KEY)

const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export async function sendContactEmail(formData: FormData) {
  try {
    // Extract form data
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    // Validate form data
    const validatedData = ContactFormSchema.parse(data)

    // Handle file attachments
    const files = formData.getAll("files") as File[]
    const attachments: { filename: string; content: Buffer }[] = []

    if (files && files.length > 0) {
      for (const file of files) {
        // Validate file size and type
        if (file.size > MAX_FILE_SIZE) {
          return {
            success: false,
            message: `File ${file.name} exceeds the maximum size of 5MB`,
          }
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          return {
            success: false,
            message: `File ${file.name} has an unsupported format`,
          }
        }

        // Convert file to buffer for email attachment
        const buffer = await file.arrayBuffer()
        attachments.push({
          filename: file.name,
          content: Buffer.from(buffer),
        })
      }
    }

    // Prepare email HTML content
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      <p><strong>Subject:</strong> ${validatedData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
    `

    // Send email using Resend
    try {
      const { data, error } = await resend.emails.send({
        from: `Contact Form <${FROM_EMAIL}>`,
        to: [RECIPIENT_EMAIL],
        reply_to: validatedData.email,
        subject: `Portfolio Contact: ${validatedData.subject}`,
        html: htmlContent,
        attachments: attachments,
      })

      if (error) {
        console.error("Email sending error:", error)
        return {
          success: false,
          message: "Failed to send message. Please try again later.",
        }
      }

      return { success: true, message: "Message sent successfully!" }
    } catch (error) {
      console.error("Email sending error:", error)
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      }
    }
  } catch (error) {
    console.error("Form processing error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      }
    }

    return { success: false, message: "Failed to process your request. Please try again." }
  }
}

// Original contact form submission action (kept for backward compatibility)
export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    // Validate form data
    const validatedData = ContactFormSchema.parse(data)

    // In a real application, you would send this data to an email service or database
    // For demonstration purposes, we'll just log it and return success
    console.log("Form submission:", validatedData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true, message: "Message sent successfully!" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      }
    }

    return { success: false, message: "Failed to send message. Please try again." }
  }
}
