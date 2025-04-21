import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_DFLnmoB5_KF3B1L8iuqxoPoDXCEg7shA9"
const RECIPIENT_EMAIL = "rasuen27@gmail.com"

const resend = new Resend(RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Handle file attachments
    const files = formData.getAll("files") as File[]
    const attachments = []

    if (files && files.length > 0) {
      for (const file of files) {
        const buffer = await file.arrayBuffer()
        attachments.push({
          filename: file.name,
          content: Buffer.from(buffer),
        })
      }
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Use your verified domain in production
      to: [RECIPIENT_EMAIL],
      subject: `Portfolio Contact: ${subject}`,
      replyTo: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      attachments: attachments,
    })

    if (error) {
      console.error("Email sending error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
