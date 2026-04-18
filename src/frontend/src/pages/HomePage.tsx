import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAbout, useProjects, useSubmitContact } from "@/hooks/useQueries";
import type { AboutInfo, Project, SocialLink } from "@/types/index";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Send,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiDribbble } from "react-icons/si";

// ─── Icon resolver ────────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<{ className?: string }>;

const ICON_MAP: Record<string, IconComponent> = {
  linkedin: FaLinkedin,
  github: FaGithub,
  twitter: FaTwitter,
  instagram: FaInstagram,
  dribbble: SiDribbble,
  x: FaTwitter,
};

function resolveSocialIcon(iconKey: string): IconComponent {
  const key = iconKey.toLowerCase();
  for (const [k, Icon] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return FaGithub;
}

// ─── Static fallback data ─────────────────────────────────────────────────────

const FALLBACK_PROJECTS: Project[] = [
  {
    id: BigInt(1),
    title: "Aether Design System",
    description:
      "A comprehensive design system for modern web apps. 120+ components, dark mode, full Figma integration.",
    techTags: ["React", "Figma", "Web2"],
    imageUrl: "/assets/generated/project-aether.dim_800x500.jpg",
    liveUrl: "https://example.com",
    sourceUrl: "https://github.com",
    order: BigInt(1),
    visible: true,
  },
  {
    id: BigInt(2),
    title: "Velocity Analytics Platform",
    description:
      "Real-time analytics dashboard processing 10M+ events daily, with live charts and cohort analysis.",
    techTags: ["React", "Node.js", "Web3"],
    imageUrl: "/assets/generated/project-velocity.dim_800x500.jpg",
    liveUrl: "https://example.com",
    sourceUrl: "https://github.com",
    order: BigInt(2),
    visible: true,
  },
  {
    id: BigInt(3),
    title: "The PHE Development Platform",
    description:
      "Full-stack platform for digital roadmapping and collaborative coding, adopted by 500+ engineering teams.",
    techTags: ["React", "Figma", "Node.js", "Web3"],
    imageUrl: "/assets/generated/project-phe.dim_800x500.jpg",
    liveUrl: "https://example.com",
    sourceUrl: "https://github.com",
    order: BigInt(3),
    visible: true,
  },
];

const FALLBACK_SOCIAL: SocialLink[] = [
  { title: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
  { title: "GitHub", url: "https://github.com", icon: "github" },
  { title: "Dribbble", url: "https://dribbble.com", icon: "dribbble" },
];

const STATS = [
  { value: "8+", label: "Years Experience" },
  { value: "60+", label: "Projects Shipped" },
  { value: "12", label: "Design Awards" },
  { value: "100%", label: "Client Satisfaction" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ projects }: { projects: Project[] }) {
  const previewProjects = projects.slice(0, 2);

  return (
    <section
      className="relative bg-card border-b border-border overflow-hidden"
      data-ocid="home.hero.section"
    >
      {/* Geometric gradient background */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-[55%] h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-transparent" />
          <div className="absolute top-10 right-0 w-full h-[70%] bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-[80px]" />
        </div>
        <div className="absolute bottom-0 left-[30%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Gradient accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 gradient-accent" />

      <div className="container max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left — main copy */}
          <div className="lg:col-span-3">
            <Badge
              variant="secondary"
              className="mb-6 text-xs font-mono px-3 py-1 tracking-wide"
            >
              Available for new projects
            </Badge>
            <h1 className="font-display font-bold text-5xl md:text-6xl xl:text-7xl text-foreground leading-[1.05] tracking-tight mb-6">
              CRAFTING DIGITAL EXPERIENCES THROUGH DESIGN & CODE.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mb-10">
              Senior Product Designer & Frontend Developer. I bridge the gap
              between pixel-perfect design and production-grade engineering —
              building products that users love and teams trust.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/projects">
                <Button
                  size="lg"
                  className="font-medium"
                  data-ocid="home.hero.view_projects.button"
                >
                  View Projects
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href="#contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-medium"
                  data-ocid="home.hero.contact.button"
                >
                  Contact Me
                </Button>
              </a>
            </div>
          </div>

          {/* Right — project links preview */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Project links
            </p>
            {previewProjects.map((project) => (
              <Link
                key={project.id.toString()}
                to="/projects/$id"
                params={{ id: project.id.toString() }}
                className="block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-smooth group shadow-subtle hover:shadow-elevated"
                data-ocid={`home.hero.project_preview.${project.id}`}
              >
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-xs tracking-widest uppercase text-foreground mb-1">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex gap-1.5 mt-2">
                    {project.techTags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 font-mono"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatsSection() {
  return (
    <section className="bg-background border-b border-border py-10 px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center md:text-left"
              data-ocid={`home.stats.item.${index + 1}`}
            >
              <p className="font-display font-bold text-3xl md:text-4xl text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Projects ────────────────────────────────────────────────────────

function ProjectCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

function FeaturedProjectsSection({
  projects,
  isLoading,
}: {
  projects: Project[];
  isLoading: boolean;
}) {
  const visible = projects.filter((p) => p.visible).slice(0, 3);

  return (
    <section
      className="bg-muted/20 border-b border-border py-20 px-6"
      id="projects"
      data-ocid="home.featured_projects.section"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              Work
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight">
              Featured Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-smooth group"
            data-ocid="home.featured_projects.see_all.link"
          >
            See all
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-smooth" />
          </Link>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="home.featured_projects.list"
        >
          {isLoading
            ? ["sk1", "sk2", "sk3"].map((sk) => (
                <ProjectCardSkeleton key={sk} />
              ))
            : visible.map((project, index) => (
                <Link
                  key={project.id.toString()}
                  to="/projects/$id"
                  params={{ id: project.id.toString() }}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-smooth shadow-subtle hover:shadow-elevated block"
                  data-ocid={`home.featured_projects.item.${index + 1}`}
                >
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/images/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-foreground group-hover:text-primary transition-smooth">
                        {project.title}
                      </h3>
                      <div className="flex gap-1.5 shrink-0">
                        {project.liveUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                project.liveUrl,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }}
                            className="text-muted-foreground hover:text-primary transition-smooth"
                            aria-label="Live site"
                          >
                            <ExternalLink className="size-3.5" />
                          </button>
                        )}
                        {project.sourceUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                project.sourceUrl,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }}
                            className="text-muted-foreground hover:text-primary transition-smooth"
                            aria-label="Source code"
                          >
                            <Github className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs px-2 py-0.5 font-mono"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/projects">
            <Button
              variant="outline"
              className="font-medium"
              data-ocid="home.featured_projects.view_all.button"
            >
              View all projects <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <Skeleton className="aspect-[4/5] rounded-2xl max-w-md mx-auto lg:mx-0 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function AboutSection({
  about,
  isLoading,
}: {
  about: AboutInfo | null | undefined;
  isLoading: boolean;
}) {
  const bioText =
    about?.bio ??
    `I'm Eliza Reed — a Senior Product Designer and Frontend Developer based in San Francisco. I specialise in building products where thoughtful design meets clean, performant code.\n\nWith 8+ years spanning startups to Fortune 500s, I've shipped design systems, analytics platforms, and consumer apps used by millions. My process is collaborative, iterative, and always user-centric.\n\nWhen I'm not designing or coding, I mentor early-career designers and contribute to open-source design tooling.`;
  const photoUrl =
    about?.profilePhotoUrl || "/assets/generated/profile-photo.dim_600x750.jpg";

  return (
    <section
      className="bg-background border-b border-border py-20 px-6"
      id="about"
      data-ocid="home.about.section"
    >
      <div className="container max-w-7xl mx-auto">
        {isLoading ? (
          <AboutSectionSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted max-w-md mx-auto lg:mx-0 shadow-elevated">
                <img
                  src={photoUrl}
                  alt="Eliza Reed"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 right-4 md:right-8 lg:-right-4 bg-card border border-border rounded-xl px-5 py-3 shadow-elevated">
                <p className="font-display font-bold text-2xl text-foreground">
                  8+
                </p>
                <p className="text-xs text-muted-foreground">
                  Years in design & dev
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="order-1 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                About
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-6 leading-tight">
                Design thinking meets engineering precision.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {bioText.split("\n\n").map((para, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static paragraphs from bio text
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Skills */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  "Product Design",
                  "Design Systems",
                  "React & TypeScript",
                  "Figma & Prototyping",
                  "User Research",
                  "Frontend Architecture",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div className="flex flex-col gap-4">
      {links.map(({ title, url, icon }) => {
        const Icon = resolveSocialIcon(icon);
        return (
          <a
            key={title}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-smooth group"
            data-ocid={`home.contact.social.${title.toLowerCase()}.link`}
          >
            <Icon className="size-5 group-hover:text-primary transition-smooth" />
            {title}
          </a>
        );
      })}
    </div>
  );
}

function ContactSection({ socialLinks }: { socialLinks: SocialLink[] }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { mutate, isPending, isSuccess, isError, reset } = useSubmitContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => setForm({ name: "", email: "", message: "" }),
    });
  };

  return (
    <section
      className="bg-muted/20 py-20 px-6"
      id="contact"
      data-ocid="home.contact.section"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: heading + social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              Contact
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-6 leading-tight">
              Say Hello.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-md">
              Whether you have a project in mind, want to collaborate, or just
              want to connect — my inbox is always open. I'll get back within 24
              hours.
            </p>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
                Social
              </p>
              <SocialLinks links={socialLinks} />
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-subtle">
            {isSuccess ? (
              <div
                className="flex flex-col items-center justify-center text-center h-full py-12 gap-4"
                data-ocid="home.contact.success_state"
              >
                <CheckCircle2 className="size-12 text-primary" />
                <h3 className="font-display font-bold text-xl text-foreground">
                  Message sent!
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reset}
                  data-ocid="home.contact.send_another.button"
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                data-ocid="home.contact.form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contact-name"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
                    >
                      Name
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                      data-ocid="home.contact.name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contact-email"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
                    >
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      required
                      data-ocid="home.contact.email.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-message"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell me about your project…"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    required
                    className="resize-none"
                    data-ocid="home.contact.message.textarea"
                  />
                </div>

                {isError && (
                  <div
                    className="flex items-center gap-2 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                    data-ocid="home.contact.error_state"
                  >
                    <XCircle className="size-4 shrink-0" />
                    <span>Failed to send. Please try again.</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full font-medium"
                  size="lg"
                  disabled={isPending}
                  data-ocid="home.contact.submit_button"
                >
                  {isPending ? (
                    <>
                      <span
                        className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: aboutData, isLoading: aboutLoading } = useAbout();

  const projects = projectsData ?? FALLBACK_PROJECTS;
  const socialLinks = aboutData?.socialLinks ?? FALLBACK_SOCIAL;

  return (
    <div data-ocid="home.page">
      <HeroSection projects={projects} />
      <StatsSection />
      <FeaturedProjectsSection
        projects={projects}
        isLoading={projectsLoading}
      />
      <AboutSection about={aboutData} isLoading={aboutLoading} />
      <ContactSection socialLinks={socialLinks} />
    </div>
  );
}
