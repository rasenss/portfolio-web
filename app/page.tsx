"use client"

import { useEffect, useState, useRef } from "react"
import { Mail, MapPin, Phone } from "lucide-react"
import { ResumeTimeline } from "@/components/resume-timeline"
import { ContactForm } from "@/components/contact-form"
import { SocialIcons } from "@/components/social-icons"
import { MainNav } from "@/components/main-nav"
import { AnimatedHeroSection } from "@/components/animated-hero-section"
import { PuzzleLauncher } from "@/components/puzzles/puzzle-launcher"
import { motion, useScroll, useSpring } from "framer-motion"
import { EnhancedPortfolioGallery } from "@/components/enhanced-portfolio-gallery"
import { SkillCategory } from "@/components/skill-category"
import { SkillComparison } from "@/components/skill-comparison"
import { SkillStatistics } from "@/components/skill-statistics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

// Interactive Skill Bar Component
const InteractiveSkillBar = ({
  skill,
  percentage,
  color,
  description,
  projects,
}: {
  skill: string
  percentage: number
  color: string
  description: string
  projects: { name: string; url?: string }[]
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full py-3 px-4 bg-muted rounded-md text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${color}`}></span>
          <span className="font-medium theme-text-transition">{skill}</span>
        </div>
        <span className="theme-text-transition">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div className="py-2 px-4 bg-muted/50 rounded-md mt-2">
          <p className="text-sm text-muted-foreground theme-text-transition">{description}</p>
          {projects && projects.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-bold theme-text-transition">Projects:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground theme-text-transition">
                {projects.map((project, index) => (
                  <li key={index}>
                    {project.url ? (
                      <a href={project.url} className="underline">
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("home")
  // Track if navigation was triggered by a click to prioritize it over scroll detection
  const clickNavigationRef = useRef<{ active: boolean; section: string | null }>({
    active: false,
    section: null,
  })

  // Refs for each section to ensure proper scrolling
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({
    home: null,
    about: null,
    skills: null,
    resume: null,
    portfolio: null,
    contact: null,
  })

  // Scroll progress indicator
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Handle smooth scrolling for anchor links with improved navigation feedback
  useEffect(() => {
    // Set scroll-padding-top to account for fixed header
    document.documentElement.style.scrollPaddingTop = "80px"

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')

      if (anchor) {
        e.preventDefault()
        const targetId = anchor.getAttribute("href")

        if (targetId === "#") {
          // If href is just "#", scroll to the top of the page
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
          // Update URL without page reload
          window.history.pushState(null, "", "/")

          // Immediately update active section
          setActiveSection("home")
          clickNavigationRef.current = { active: true, section: "home" }

          // Reset click navigation priority after animation completes
          setTimeout(() => {
            clickNavigationRef.current = { active: false, section: null }
          }, 1000)
        } else if (targetId) {
          const sectionId = targetId.substring(1)
          const targetElement = document.getElementById(sectionId)

          if (targetElement) {
            // Immediately update active section before scrolling
            setActiveSection(sectionId)
            clickNavigationRef.current = { active: true, section: sectionId }

            // Get the element's position relative to the viewport
            const rect = targetElement.getBoundingClientRect()

            // Calculate the scroll position accounting for the fixed header
            const scrollPosition = window.pageYOffset + rect.top - 80

            // Scroll to the exact position
            window.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            })

            // Update URL without page reload
            window.history.pushState(null, "", targetId)

            // Reset click navigation priority after animation completes
            setTimeout(() => {
              clickNavigationRef.current = { active: false, section: null }
            }, 1000)
          }
        }
      }
    }

    document.addEventListener("click", handleAnchorClick, { capture: true })

    // Create a more reliable section detection system
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Skip intersection detection if navigation was triggered by a click
        if (clickNavigationRef.current.active) return

        // Find the most visible section
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries.length > 0) {
          const topSection = visibleEntries[0]
          const sectionId = topSection.target.id

          if (sectionId) {
            setActiveSection(sectionId)
          }
        }
      },
      {
        rootMargin: "-80px 0px -20% 0px", // Adjusted for header height
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for better detection
      },
    )

    // Observe all sections including the portfolio section
    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => {
      const id = section.id
      sectionRefs.current[id] = section as HTMLElement
      sectionObserver.observe(section)
    })

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true })
      sectionObserver.disconnect()
    }
  }, [])

  // Define skill categories and data
  const technicalSkills = [
    {
      name: "HTML",
      percentage: 75,
      color: "bg-orange-500",
      description: "Proficient in semantic HTML5 markup, accessibility best practices, and modern web standards.",
      projects: [{ name: "Portfolio Website", url: "#portfolio" }, { name: "Responsive Landing Pages" }],
    },
    {
      name: "CSS",
      percentage: 60,
      color: "bg-blue-500",
      description:
        "Skilled in CSS3, responsive design, animations, and modern layout techniques like Flexbox and Grid.",
      projects: [{ name: "UI Component Library" }, { name: "Interactive Animations" }],
    },
    {
      name: "Javascript",
      percentage: 50,
      color: "bg-yellow-500",
      description: "I'm currently learning JavaScript and building my skills in creating interactive web elements. I enjoy experimenting with code to solve problems and make websites more dynamic.",
    },
    {
      name: "Git",
      percentage: 65,
      color: "bg-red-500",
      description: "Proficient in version control, branching strategies, and collaborative workflows.",
      projects: [{ name: "Open Source Contributions" }, { name: "Team Projects" }],
    },
    {
      name: "Microsoft Office",
      percentage: 70,
      color: "bg-green-500",
      description: "Proficient in Word, Excel, PowerPoint, and other Microsoft Office applications.",
      projects: [{ name: "Data Analysis Reports" }, { name: "Professional Presentations" }],
    },
  ]

  const designSkills = [
    {
      name: "Figma",
      percentage: 80,
      color: "bg-purple-500",
      description: "Experienced in UI/UX design, prototyping, and collaborative design workflows.",
      projects: [{ name: "Mobile App Designs" }, { name: "Web Interface Mockups" }],
    },
    {
      name: "UI/UX Design",
      percentage: 70,
      color: "bg-pink-500",
      description: "Knowledge of user-centered design principles, wireframing, and usability testing.",
      projects: [{ name: "Mobile Apps Design" }, { name: "Web Design" }],
    },
    {
      name: "Visual Design",
      percentage: 70,
      color: "bg-indigo-500",
      description: "Skilled in UI/UX design with Figma for wireframing, prototyping, and user research. Focused on creating clean, intuitive interfaces for apps and websites.",
      projects: [{ name: "Brand Identity Projects" }, { name: "Bootcamp Mini Course Projects" }],
    },
  ]

  const skillStats = [
    { label: "Years Experience", value: 2, color: "#10B981" },
    { label: "Certifications", value: 15, color: "#F59E0B", url: "https://www.linkedin.com/in/rasendriya-khansa/details/certifications/" },
  ]

  return (
    <div className="flex min-h-screen flex-col theme-transition">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100]"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      {/* Main Navigation - Fixed at the top */}
      <MainNav activeSection={activeSection} />

      <main className="flex-1 theme-transition pt-16">
        {/* Hero Section */}
        <section
          id="home"
          className="container px-4 sm:px-6 md:px-8 py-16 md:py-24 lg:py-32 theme-transition hero-section min-h-[calc(100vh-4rem)]"
        >
          <AnimatedHeroSection />
        </section>

        {/* About Section */}
        <motion.section
          id="about"
          className="container px-4 sm:px-6 md:px-8 py-20 md:py-28 lg:py-32 bg-muted/50 theme-bg-transition"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter theme-text-transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              About me
            </motion.h2>
          </div>
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 mt-14 max-w-6xl mx-auto">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-base sm:text-lg leading-relaxed theme-text-transition">
              A tech enthusiast focused on front-end development and UI/UX design using Figma. Designed functional interfaces for health apps and login pages, prioritizing user-friendly experiences. 
              At BTPN Syariah, facilitated workshops to empower entrepreneurs, while at GAOTEK.Inc, streamlined market research through SEO and data tools. Enhanced data accuracy and client outreach during my remote internship at Vriddhi Agency. 
              Continuously refining skills in SQL, Python, and project management to merge technical precision with creativity for meaningful digital solutions.</p>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold theme-text-transition">Birthday:</h3>
                  <p className="text-muted-foreground theme-text-transition">19 March 2003</p>
                </div>
                <div>
                  <h3 className="font-bold theme-text-transition">Phone:</h3>
                  <p className="text-muted-foreground theme-text-transition">+62-881-0261-38014</p>
                </div>
                <div>
                  <h3 className="font-bold theme-text-transition">City:</h3>
                  <p className="text-muted-foreground theme-text-transition">East Java, Indonesia</p>
                </div>
                <div>
                  <h3 className="font-bold theme-text-transition">Age:</h3>
                  <p className="text-muted-foreground theme-text-transition">22</p>
                </div>
                <div>
                  <h3 className="font-bold theme-text-transition">Email:</h3>
                  <p className="text-muted-foreground theme-text-transition">rasuen27@gmail.com</p>
                </div>
                <div>
                  <h3 className="font-bold theme-text-transition">Freelance:</h3>
                  <p className="text-muted-foreground theme-text-transition">Available</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Skills Section */}
        <motion.section
          id="skills"
          className="container px-4 sm:px-6 md:px-8 py-20 md:py-28 lg:py-32 theme-transition"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter theme-text-transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Skills
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-base sm:text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore my technical abilities and expertise
            </motion.p>
          </div>

          <div className="mt-14 max-w-4xl mx-auto">
            {/* Skill Statistics */}
            <motion.div
              className="mb-12 flex justify-center items-center w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SkillStatistics stats={skillStats} />
            </motion.div>

            {/* Skill Categories */}
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
                <TabsTrigger value="all">All Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="space-y-6">
                <SkillCategory title="Technical Skills" skills={technicalSkills} defaultOpen={true} />
                <SkillCategory title="Design Skills" skills={designSkills} />
              </TabsContent>

              <TabsContent value="compare">
                <SkillComparison skills={[...technicalSkills, ...designSkills]} />
              </TabsContent>

              <TabsContent value="all" className="space-y-6">
                {[...technicalSkills, ...designSkills].map((skill) => (
                  <InteractiveSkillBar
                    key={skill.name}
                    skill={skill.name}
                    percentage={skill.percentage}
                    color={skill.color}
                    description={skill.description}
                    projects={skill.projects || []}
                  />
                ))}
              </TabsContent>
            </Tabs>
        </div>
        </motion.section>

        {/* Resume Section */}
        <motion.section
          id="resume"
          className="container px-4 sm:px-6 md:px-8 py-20 md:py-28 lg:py-32 bg-muted/50 theme-bg-transition"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter theme-text-transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Resume
            </motion.h2>
            <motion.p
              className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 theme-text-transition"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              SUMMARY OF MY RESUME
            </motion.p>
          </div>
          <div className="mt-14 max-w-6xl mx-auto">
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-8 theme-text-transition">Summary</h3>
                <ResumeTimeline
                  items={[
                    {
                      title: "Rasendriya Khansa Jolankarfyan",
                      description: "DO WHATEVER YOU WANT TO DO",
                      details: ["Pacitan, East Java, Indonesia", "+62-881-0261-38014", "rasuen27@gmail.com"],
                    },
                  ]}
                />

                <h3 className="text-2xl font-bold mb-8 mt-14 theme-text-transition">Education</h3>
                <ResumeTimeline
                  items={[
                    {
                      title: "Senior High School",
                      period: "2018 - 2021",
                      description: "Madrasah Aliyah Negeri, Pacitan, East Java, Indonesia",
                      details: ["Graduated high school with a major in Social Sciences"],
                    },
                    {
                      title: "College Students",
                      period: "2022 - Now",
                      description: "Muhammadiyah Siber University, Special Region of Yogyakarta, Indonesia",
                      details: [
                        "Studied in Computer Science Major",
                        "GPA: 3.46/4.00 (5th Semester)",
                        "Coursework:",
                        "2024 Red Hat Academy - Program Learner",
                        "Blue Team Junior Analyst Training",
                      ],
                    },
                  ]}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-8 theme-text-transition">Intern Experience</h3>
                <ResumeTimeline
                  items={[
                    {
                      title: "Digital Marketing Intern - Market Report Team",
                      period: "April 2024 - August 2024",
                      description: "GAOTek inc, New York, USA - Remote",
                      details: [
                        "• Consistently provided concise and insightful document summaries in DOCX format.",
                        "• Authored concise summaries and comprehensive market reports.",
                        "• Received positive feedback from supervisors for clarity and accuracy in written summaries and reports.",
                      ],
                    },
                    {
                      title: "Co - Facilitator Intern",
                      period: "October 2024 - January 2025",
                      description: "BTPN Syariah, Pacitan, East Java, Indonesia - On-Site",
                      details: [
                        "• Provide direct assistance to women UMKM entrepreneurs.",
                        "• Support the measurable improvement of knowledge and skills for UMKM participants.",
                        "• Ensure program sustainability through training and evaluation.",
                        "• Build strong relationships with participants to ensure program success.",
                      ],
                    },
                    {
                      title: "Administrator Intern",
                      period: "February 2025 - April 2025",
                      description: "Vriddhi Agency, Malang, East Java, Indonesia - Remote",
                      details: [
                        "• Accurately entered and updated company data, keeping everything reliable and on point.",
                        "• Checked and validated data to ensure top-notch accuracy every time.",
                        "• Managed and sorted digital files like a pro, making them easy to find and use.",
                        "• Reached out to potential clients with confidence, helping drive business growth.",
                      ],
                    },
                  ]}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Portfolio Section */}
        <motion.section
          id="portfolio"
          className="container px-4 sm:px-6 md:px-8 py-20 md:py-28 lg:py-32 theme-transition"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter theme-text-transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Portfolio
            </motion.h2>
            <motion.p
              className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 theme-text-transition"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              RSpace Design
            </motion.p>
          </div>
          <div className="mt-14">
            <EnhancedPortfolioGallery />
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="container px-4 sm:px-6 md:px-8 py-20 md:py-28 lg:py-32 bg-muted/50 theme-bg-transition"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter theme-text-transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Contact
            </motion.h2>
          </div>
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 mt-14 max-w-6xl mx-auto">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground theme-transition">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold theme-text-transition">Location:</h3>
                  <p className="text-muted-foreground theme-text-transition">Pacitan, East Java, Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground theme-transition">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold theme-text-transition">Email:</h3>
                  <p className="text-muted-foreground theme-text-transition">rasuen27@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground theme-transition">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold theme-text-transition">Call:</h3>
                  <p className="text-muted-foreground theme-text-transition">+62 881 XXXX XXXXX</p>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-lg font-bold mb-6 theme-text-transition">Connect with me:</h3>
                <SocialIcons showLabels iconSize={22} className="flex-col items-start gap-4" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer with Puzzle Launcher instead of Social Icons */}
      <motion.footer
        className="border-t py-6 md:py-0 theme-border-transition"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container px-4 sm:px-6 md:px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left theme-text-transition">
            © God With Us
          </p>
          <PuzzleLauncher />
        </div>
      </motion.footer>
    </div>
  )
}
