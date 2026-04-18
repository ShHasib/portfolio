import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/types/index";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  FolderOpen,
  Github,
} from "lucide-react";
import { motion } from "motion/react";

function useProject(id: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Project | null>({
    queryKey: ["project", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProject(id) as Promise<Project | null>;
    },
    enabled: !!actor && !isFetching,
  });
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-8" data-ocid="project_detail.loading_state">
      <Skeleton className="w-full aspect-video rounded-2xl" />
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center py-32 text-center"
      data-ocid="project_detail.error_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="font-display font-bold text-2xl text-foreground mb-2">
        Project not found
      </h2>
      <p className="text-muted-foreground mb-8 max-w-xs text-sm">
        This project may have been removed or the link may be incorrect.
      </p>
      <Button asChild variant="outline" data-ocid="project_detail.back_button">
        <Link to="/projects">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </Button>
    </div>
  );
}

function DescriptionRenderer({ content }: { content: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className="prose prose-invert prose-neutral max-w-none text-muted-foreground leading-relaxed
          prose-headings:text-foreground prose-headings:font-display
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-code:text-accent prose-code:bg-muted prose-code:px-1 prose-code:rounded
          prose-strong:text-foreground"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled backend content
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const paragraphs = content.split(/\n\n+/);
  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p
          // biome-ignore lint/suspicious/noArrayIndexKey: static split paragraphs, no reorder
          key={i}
          className="text-muted-foreground leading-relaxed whitespace-pre-line"
        >
          {para}
        </p>
      ))}
    </div>
  );
}

export function ProjectDetailPage() {
  const { id: idStr } = useParams({ from: "/projects/$id" });
  const projectId = BigInt(idStr);
  const { data: project, isLoading, isError } = useProject(projectId);

  return (
    <div className="bg-background min-h-screen" data-ocid="project_detail.page">
      {/* Back navigation bar */}
      <div className="bg-card border-b border-border py-4 px-6">
        <div className="container max-w-5xl mx-auto">
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground hover:text-foreground -ml-2 group"
            data-ocid="project_detail.back_button"
          >
            <Link to="/projects">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" />
              All Projects
            </Link>
          </Button>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="container max-w-5xl mx-auto">
          {isLoading && <ProjectDetailSkeleton />}
          {(isError || (!isLoading && project === null)) && <NotFound />}

          {!isLoading && project && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              data-ocid="project_detail.card"
            >
              {/* Hero image */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted border border-border shadow-elevated mb-10">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Meta + content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main content column */}
                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <p className="text-xs font-mono tracking-widest text-accent uppercase mb-3">
                      Case Study
                    </p>
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
                      {project.title}
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="border-t border-border/50 pt-6"
                    data-ocid="project_detail.description"
                  >
                    <DescriptionRenderer content={project.description} />
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex flex-wrap gap-3 pt-2"
                    data-ocid="project_detail.actions"
                  >
                    {project.liveUrl && (
                      <Button
                        asChild
                        className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                        data-ocid="project_detail.live_link_button"
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Live
                        </a>
                      </Button>
                    )}
                    {project.sourceUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="gap-2 border-border hover:border-foreground/30 font-medium"
                        data-ocid="project_detail.source_link_button"
                      >
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4" />
                          Source Code
                        </a>
                      </Button>
                    )}
                    {!project.liveUrl && !project.sourceUrl && (
                      <p className="text-sm text-muted-foreground italic">
                        No links available.
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Sidebar: tech tags */}
                <motion.aside
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-6"
                >
                  <div
                    className="bg-card border border-border rounded-xl p-5 space-y-4"
                    data-ocid="project_detail.tags"
                  >
                    <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                      Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs px-2.5 py-1 font-mono tracking-wide"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Links card */}
                  {(project.liveUrl || project.sourceUrl) && (
                    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                        Links
                      </p>
                      <div className="flex flex-col gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors duration-200 group/link"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate min-w-0 group-hover/link:underline">
                              Live site
                            </span>
                          </a>
                        )}
                        {project.sourceUrl && (
                          <a
                            href={project.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors duration-200 group/link"
                          >
                            <Github className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate min-w-0 group-hover/link:underline">
                              GitHub repository
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </motion.aside>
              </div>
            </motion.article>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      {!isLoading && project && (
        <section className="py-12 px-6 bg-muted/20 border-t border-border/50 mt-8">
          <div className="container max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-1">
                Explore more
              </p>
              <p className="text-sm text-foreground font-medium">
                See all projects
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              data-ocid="project_detail.all_projects_button"
            >
              <Link to="/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
