import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/types/index";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ExternalLink,
  FolderOpen,
  Github,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

function useProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.getProjects();
      return (all as Project[])
        .filter((p) => p.visible)
        .sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
  });
}

function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <Skeleton className="w-full aspect-video" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      data-ocid={`projects.item.${index + 1}`}
    >
      <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-smooth shadow-subtle hover:shadow-elevated flex flex-col h-full">
        {/* Image container */}
        <div className="relative overflow-hidden aspect-video bg-muted">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <FolderOpen className="w-12 h-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View live project"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 transition-smooth"
                data-ocid={`projects.live_link.${index + 1}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live
              </a>
            )}
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-smooth"
                data-ocid={`projects.source_link.${index + 1}`}
              >
                <Github className="w-3.5 h-3.5" />
                Source
              </a>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="p-5 flex flex-col flex-1 space-y-3">
          <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-foreground group-hover:text-accent transition-colors duration-200 leading-snug">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techTags.slice(0, 5).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 font-mono tracking-wide"
              >
                {tag}
              </Badge>
            ))}
            {project.techTags.length > 5 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 text-muted-foreground"
              >
                +{project.techTags.length - 5}
              </Badge>
            )}
          </div>
          <Link
            to="/projects/$id"
            params={{ id: project.id.toString() }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-smooth mt-auto group/link pt-1"
            data-ocid={`projects.detail_link.${index + 1}`}
          >
            View case study
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-smooth" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
      data-ocid="projects.empty_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <FolderOpen className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">
        {hasFilter ? "No matching projects" : "No projects yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {hasFilter
          ? "Try clearing your filter to see all projects."
          : "Projects will appear here once they're added."}
      </p>
    </div>
  );
}

export function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const p of projects) {
      for (const t of p.techTags) tags.add(t);
    }
    return Array.from(tags).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.techTags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesTag = !activeTag || p.techTags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [projects, search, activeTag]);

  const hasFilter = !!search || !!activeTag;

  return (
    <div className="bg-background min-h-screen" data-ocid="projects.page">
      {/* Page header */}
      <section className="bg-card border-b border-border py-16 px-6">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-mono tracking-widest text-accent uppercase mb-3">
              Work
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
              Selected Projects
            </h1>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              A curated collection of design and engineering work — spanning
              product design systems, full-stack applications, and brand
              identities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + filter bar */}
      <section className="py-8 px-6 bg-muted/20 border-b border-border/50">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <div className="relative flex-shrink-0 w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search projects…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
                data-ocid="projects.search_input"
              />
            </div>

            {!isLoading && allTags.length > 0 && (
              <div
                className="flex flex-wrap gap-2"
                data-ocid="projects.tag_filters"
              >
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className={`text-xs px-3 py-1 rounded-full border transition-smooth font-mono ${
                    !activeTag
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-transparent text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
                  }`}
                  data-ocid="projects.filter.all"
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`text-xs px-3 py-1 rounded-full border transition-smooth font-mono ${
                      activeTag === tag
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-transparent text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
                    }`}
                    data-ocid={`projects.filter.${tag.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-16 px-6" data-ocid="projects.grid.section">
        <div className="container max-w-7xl mx-auto">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="projects.list"
          >
            {isLoading ? (
              ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
                <div key={sk} data-ocid={`projects.loading_state.${sk}`}>
                  <ProjectCardSkeleton />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <EmptyState hasFilter={hasFilter} />
            ) : (
              filtered.map((project, i) => (
                <ProjectCard
                  key={project.id.toString()}
                  project={project}
                  index={i}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
