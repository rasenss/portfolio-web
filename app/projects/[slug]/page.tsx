import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// This would typically come from a database or CMS
const projects = {
  ecommerce: {
    title: "E-commerce Platform",
    description: "A full-featured online store with product management, cart functionality, and payment processing.",
    longDescription:
      "This e-commerce platform was built to provide small businesses with an affordable and easy-to-use solution for selling products online. The platform includes features such as product management, inventory tracking, shopping cart functionality, secure checkout with Stripe integration, order management, and customer accounts. The admin dashboard provides insights into sales, popular products, and customer behavior.",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Next.js", "Stripe", "Tailwind CSS", "PostgreSQL", "Prisma"],
    liveUrl: "https://example-ecommerce.vercel.app",
    githubUrl: "https://github.com/alexchen/ecommerce",
    features: [
      "Responsive product catalog with filtering and search",
      "User authentication and account management",
      "Shopping cart with persistent storage",
      "Secure checkout with Stripe integration",
      "Admin dashboard for product and order management",
      "Inventory tracking and notifications",
      "Order history and tracking for customers",
    ],
    challenges:
      "One of the main challenges was implementing a real-time inventory system that could handle concurrent purchases without overselling products. This was solved by implementing a queue-based system for processing orders and updating inventory.",
    technologies:
      "The frontend was built with Next.js and Tailwind CSS, providing a fast and responsive user experience. The backend uses Next.js API routes with Prisma as the ORM connecting to a PostgreSQL database. Stripe was integrated for payment processing, and authentication was handled with NextAuth.js.",
  },
  "task-manager": {
    title: "Task Management App",
    description: "A collaborative task manager with real-time updates, drag-and-drop interface, and team features.",
    longDescription:
      "This task management application was designed to help teams collaborate more effectively by providing a real-time platform for organizing and tracking tasks. The app features a drag-and-drop interface for easy task management, real-time updates so team members can see changes as they happen, and comprehensive team management features.",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["React", "Firebase", "Material UI", "Redux", "Socket.io"],
    liveUrl: "https://example-taskmanager.vercel.app",
    githubUrl: "https://github.com/alexchen/taskmanager",
    features: [
      "Drag-and-drop task management across different status columns",
      "Real-time updates using WebSockets",
      "Team creation and management",
      "Task assignment and due date tracking",
      "Comment system for task discussions",
      "File attachments for tasks",
      "Notification system for task updates",
    ],
    challenges:
      "The biggest challenge was implementing the real-time functionality while maintaining performance. We used a combination of Socket.io for immediate updates and Firebase for data persistence, which required careful state management to avoid conflicts.",
    technologies:
      "The application was built with React for the frontend, using Material UI for the component library and Redux for state management. Firebase was used for authentication and data storage, while Socket.io enabled real-time communication between clients.",
  },
  portfolio: {
    title: "Portfolio Website",
    description: "A responsive portfolio website with dark mode, animations, and contact form functionality.",
    longDescription:
      "This portfolio website was created to showcase my projects and skills in an interactive and visually appealing way. The site features a clean, modern design with smooth animations and transitions to enhance the user experience. The dark mode toggle allows users to choose their preferred viewing experience, and the contact form makes it easy for potential clients or employers to get in touch.",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Nodemailer"],
    liveUrl: "https://alexchen-portfolio.vercel.app",
    githubUrl: "https://github.com/alexchen/portfolio",
    features: [
      "Responsive design that works on all device sizes",
      "Dark mode toggle with persistent user preference",
      "Smooth page transitions and scroll animations",
      "Project showcase with detailed project pages",
      "Skills section with visual representation of proficiency",
      "Functional contact form with email notifications",
      "SEO optimization for better discoverability",
    ],
    challenges:
      "Creating smooth animations that work well on both desktop and mobile devices was challenging. Framer Motion helped solve this by providing a flexible animation system that could be adjusted based on the device size.",
    technologies:
      "The website was built with Next.js for server-side rendering and optimal performance. Tailwind CSS was used for styling, with Framer Motion handling animations. The contact form uses Nodemailer to send emails directly from the server.",
  },
  weather: {
    title: "Weather Dashboard",
    description: "A weather application with location detection, 7-day forecasts, and interactive maps.",
    longDescription:
      "This weather dashboard provides users with comprehensive weather information for any location around the world. The app features current conditions, hourly forecasts, and 7-day predictions, all presented in an intuitive and visually appealing interface. Users can search for locations, save favorites, and view weather data on an interactive map.",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["React", "OpenWeather API", "Leaflet", "Chart.js", "Geolocation API"],
    liveUrl: "https://example-weather.vercel.app",
    githubUrl: "https://github.com/alexchen/weather",
    features: [
      "Current weather conditions with detailed metrics",
      "Hourly forecast for the next 48 hours",
      "7-day forecast with high/low temperatures",
      "Interactive map showing weather patterns",
      "Location search with autocomplete",
      "Favorite locations for quick access",
      "Automatic location detection using browser geolocation",
    ],
    challenges:
      "Integrating multiple data sources (OpenWeather API for forecasts and Leaflet for maps) while maintaining a cohesive user experience was challenging. We created a unified data model that could transform the API responses into a consistent format for our application.",
    technologies:
      "The application was built with React for the frontend, using the OpenWeather API for weather data and Leaflet for interactive maps. Chart.js was used to visualize temperature and precipitation trends, and the browser's Geolocation API enabled automatic location detection.",
  },
  "social-media": {
    title: "Social Media Platform",
    description: "A social network with user profiles, posts, comments, and real-time notifications.",
    longDescription:
      "This social media platform was created to provide users with a space to connect, share content, and engage with each other in real-time. The platform includes features such as user profiles, post creation with rich media support, commenting and reaction systems, and real-time notifications. The design focuses on simplicity and ease of use while providing powerful social features.",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Next.js", "Socket.io", "MongoDB", "AWS S3", "Redis"],
    liveUrl: "https://example-social.vercel.app",
    githubUrl: "https://github.com/alexchen/social",
    features: [
      "User profiles with customizable information and avatars",
      "Post creation with support for text, images, and videos",
      "Comment and reaction system for engaging with content",
      "Real-time notifications for interactions",
      "Direct messaging between users",
      "Content discovery through hashtags and trending topics",
      "User following system to curate personal feeds",
    ],
    challenges:
      "Scaling the real-time notification system was a significant challenge. We implemented a Redis-based pub/sub system that could handle thousands of concurrent users while maintaining low latency for notifications.",
    technologies:
      "The platform was built with Next.js for the frontend and backend, using MongoDB for data storage and Socket.io for real-time communication. AWS S3 was used for media storage, and Redis powered the notification system and caching layer.",
  },
  fitness: {
    title: "Fitness Tracker",
    description: "A workout tracking application with progress visualization, goal setting, and exercise library.",
    longDescription:
      "This fitness tracking application helps users monitor their workout routines, track progress over time, and set achievable fitness goals. The app includes a comprehensive exercise library with proper form instructions, workout planning tools, and detailed progress analytics. The mobile-first design ensures users can easily log workouts at the gym or on the go.",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["React Native", "GraphQL", "Chart.js", "Firebase", "Apple HealthKit"],
    liveUrl: "https://example-fitness.vercel.app",
    githubUrl: "https://github.com/alexchen/fitness",
    features: [
      "Comprehensive exercise library with form instructions",
      "Workout planning and scheduling",
      "Progress tracking with visual charts and graphs",
      "Goal setting and achievement tracking",
      "Integration with Apple HealthKit and Google Fit",
      "Social features for sharing workouts and achievements",
      "Personalized workout recommendations",
    ],
    challenges:
      "Integrating with health platforms like Apple HealthKit and Google Fit required navigating complex APIs and ensuring data consistency across platforms. We created an abstraction layer that normalized the data from different sources into a consistent format for our application.",
    technologies:
      "The application was built with React Native for cross-platform mobile support, using GraphQL for efficient data fetching and Firebase for authentication and data storage. Chart.js was used for visualizing progress, and native integrations were developed for Apple HealthKit and Google Fit.",
  },
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects[params.slug as keyof typeof projects]

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container py-12">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/#projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-lg mb-8">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" priority />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{project.longDescription}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              {project.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Challenges & Solutions</h2>
            <p className="text-muted-foreground">{project.challenges}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
            <p className="text-muted-foreground">{project.technologies}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="text-xl font-bold mb-4">Project Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-muted-foreground">Technologies</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Links</h4>
                <div className="flex flex-col gap-2 mt-2">
                  <Button asChild variant="outline" className="justify-start">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Source
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
