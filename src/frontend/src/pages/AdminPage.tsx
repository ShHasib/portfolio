import { createActor } from "@/backend";
import type { backendInterface } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import type {
  AboutInfo,
  Project,
  ProjectInput,
  SocialLink,
} from "@/types/index";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Eye,
  EyeOff,
  FolderOpen,
  LogOut,
  Mail,
  MailOpen,
  Pencil,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TypedActor = backendInterface | null;
type AdminTab = "projects" | "about" | "messages";

/* ─── Auth Gate ─────────────────────────────────────────── */
function LoginPrompt() {
  const { login, isLoading } = useAuth();
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center"
      data-ocid="admin.login.page"
    >
      <div className="bg-card border border-border rounded-xl p-10 max-w-sm w-full text-center shadow-elevated">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <User className="size-6 text-primary" />
        </div>
        <h1 className="font-display font-bold text-xl text-foreground mb-2">
          Admin Access
        </h1>
        <p className="text-sm text-muted-foreground mb-7">
          Sign in with Internet Identity to manage your portfolio.
        </p>
        <Button
          className="w-full"
          onClick={login}
          disabled={isLoading}
          data-ocid="admin.login.button"
        >
          {isLoading ? "Connecting…" : "Sign in with Internet Identity"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Project Form ──────────────────────────────────────── */
const EMPTY_PROJECT_INPUT: ProjectInput = {
  title: "",
  description: "",
  techTags: [],
  imageUrl: "",
  liveUrl: "",
  sourceUrl: "",
  order: BigInt(0),
  visible: true,
};

interface ProjectFormProps {
  initial?: Project;
  onSave: (input: ProjectInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
  isLoading,
}: ProjectFormProps) {
  const [form, setForm] = useState<ProjectInput>(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          techTags: initial.techTags,
          imageUrl: initial.imageUrl,
          liveUrl: initial.liveUrl,
          sourceUrl: initial.sourceUrl,
          order: initial.order,
          visible: initial.visible,
        }
      : EMPTY_PROJECT_INPUT,
  );
  const [tagsInput, setTagsInput] = useState(
    initial?.techTags.join(", ") ?? "",
  );

  const handleSubmit = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ ...form, techTags: tags });
  };

  return (
    <div
      className="bg-card border border-border rounded-xl p-6 space-y-5"
      data-ocid="admin.project_form.dialog"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-base text-foreground">
          {initial ? "Edit Project" : "New Project"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Close form"
          data-ocid="admin.project_form.close_button"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="proj-title">Title</Label>
          <Input
            id="proj-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Project name"
            data-ocid="admin.project_form.title.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="proj-desc">Description</Label>
          <Textarea
            id="proj-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short project description"
            rows={3}
            data-ocid="admin.project_form.description.textarea"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="proj-tags">Tech Tags (comma-separated)</Label>
          <Input
            id="proj-tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="React, TypeScript, Node.js"
            data-ocid="admin.project_form.tags.input"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="proj-image">Image URL</Label>
            <Input
              id="proj-image"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://…"
              data-ocid="admin.project_form.image_url.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proj-order">Order</Label>
            <Input
              id="proj-order"
              type="number"
              value={Number(form.order)}
              onChange={(e) =>
                setForm({ ...form, order: BigInt(e.target.value || 0) })
              }
              data-ocid="admin.project_form.order.input"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="proj-live">Live URL</Label>
            <Input
              id="proj-live"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              placeholder="https://…"
              data-ocid="admin.project_form.live_url.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proj-source">Source URL</Label>
            <Input
              id="proj-source"
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              placeholder="https://github.com/…"
              data-ocid="admin.project_form.source_url.input"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="proj-visible"
            checked={form.visible}
            onCheckedChange={(v) => setForm({ ...form, visible: !!v })}
            data-ocid="admin.project_form.visible.checkbox"
          />
          <Label htmlFor="proj-visible" className="cursor-pointer">
            Visible on portfolio
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !form.title.trim()}
          data-ocid="admin.project_form.save_button"
        >
          {isLoading ? (
            "Saving…"
          ) : (
            <>
              <Save className="size-4 mr-1.5" />
              Save Project
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
          data-ocid="admin.project_form.cancel_button"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

/* ─── Projects Tab ──────────────────────────────────────── */
function ProjectsTab({ actor }: { actor: TypedActor }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<bigint | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjects();
    },
    enabled: !!actor,
  });

  const addMutation = useMutation({
    mutationFn: async (input: ProjectInput) => {
      if (!actor) throw new Error("No actor");
      return actor.addProject(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setShowForm(false);
      toast.success("Project added successfully");
    },
    onError: () => toast.error("Failed to add project"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ProjectInput }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProject(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setEditProject(null);
      toast.success("Project updated");
    },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setConfirmDelete(null);
      toast.success("Project deleted");
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const visibleCount = projects.filter((p) => p.visible).length;

  return (
    <div data-ocid="admin.projects.section">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display font-bold text-2xl text-foreground">
            Projects
          </h2>
          {!isLoading && (
            <p className="text-muted-foreground text-sm mt-1">
              {projects.length} projects · {visibleCount} visible
            </p>
          )}
        </div>
        <Button
          className="font-medium"
          onClick={() => {
            setShowForm(true);
            setEditProject(null);
          }}
          data-ocid="admin.new_project.button"
        >
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      {showForm && !editProject && (
        <div className="mb-6">
          <ProjectForm
            onSave={(input) => addMutation.mutate(input)}
            onCancel={() => setShowForm(false)}
            isLoading={addMutation.isPending}
          />
        </div>
      )}

      <div className="space-y-3" data-ocid="admin.projects.list">
        {isLoading &&
          ["sk1", "sk2", "sk3"].map((sk) => (
            <div
              key={sk}
              className="bg-card border border-border rounded-lg p-5 flex items-center gap-5"
              data-ocid="admin.projects.loading_state"
            >
              <Skeleton className="w-16 h-12 rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
          ))}

        {!isLoading && projects.length === 0 && !showForm && (
          <div
            className="text-center py-16 text-muted-foreground bg-card border border-dashed border-border rounded-xl"
            data-ocid="admin.projects.empty_state"
          >
            <FolderOpen className="size-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No projects yet</p>
            <p className="text-xs mt-1">
              Click "New Project" to add your first one.
            </p>
          </div>
        )}

        {projects.map((project, index) => (
          <div key={project.id.toString()}>
            {editProject?.id === project.id ? (
              <ProjectForm
                initial={editProject}
                onSave={(input) =>
                  updateMutation.mutate({ id: project.id, input })
                }
                onCancel={() => setEditProject(null)}
                isLoading={updateMutation.isPending}
              />
            ) : (
              <div
                className="bg-card border border-border rounded-lg p-5 flex items-center gap-5 hover:border-border/60 transition-smooth"
                data-ocid={`admin.projects.item.${index + 1}`}
              >
                <div className="w-16 h-12 rounded-md overflow-hidden bg-muted shrink-0">
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
                      <FolderOpen className="size-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-foreground truncate">
                      {project.title}
                    </p>
                    <Badge
                      variant={project.visible ? "default" : "secondary"}
                      className="text-[10px] shrink-0"
                    >
                      {project.visible ? "Published" : "Hidden"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5 line-clamp-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.techTags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.techTags.length > 4 && (
                      <span className="text-[11px] text-muted-foreground">
                        +{project.techTags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {confirmDelete === project.id ? (
                    <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-md px-3 py-1.5">
                      <span className="text-xs text-destructive font-medium">
                        Delete?
                      </span>
                      <button
                        type="button"
                        className="text-xs text-destructive hover:text-destructive/80 font-semibold"
                        onClick={() => deleteMutation.mutate(project.id)}
                        data-ocid={`admin.projects.confirm_button.${index + 1}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setConfirmDelete(null)}
                        data-ocid={`admin.projects.cancel_button.${index + 1}`}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={
                          project.visible ? "Hide project" : "Show project"
                        }
                        onClick={() =>
                          updateMutation.mutate({
                            id: project.id,
                            input: {
                              title: project.title,
                              description: project.description,
                              techTags: [...project.techTags],
                              imageUrl: project.imageUrl,
                              liveUrl: project.liveUrl,
                              sourceUrl: project.sourceUrl,
                              order: project.order,
                              visible: !project.visible,
                            },
                          })
                        }
                        data-ocid={`admin.projects.toggle_visibility.${index + 1}`}
                      >
                        {project.visible ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Edit project"
                        onClick={() => {
                          setEditProject(project);
                          setShowForm(false);
                        }}
                        data-ocid={`admin.projects.edit_button.${index + 1}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete project"
                        onClick={() => setConfirmDelete(project.id)}
                        data-ocid={`admin.projects.delete_button.${index + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── About Tab ─────────────────────────────────────────── */
type SocialLinkKeyed = SocialLink & { _id: number };
let linkKeyCounter = 0;
function makeKeyedLink(l: SocialLink): SocialLinkKeyed {
  return { ...l, _id: linkKeyCounter++ };
}

function AboutTab({ actor }: { actor: TypedActor }) {
  const qc = useQueryClient();
  const [bio, setBio] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [links, setLinks] = useState<SocialLinkKeyed[]>([]);
  const [dirty, setDirty] = useState(false);

  const { data: about, isLoading } = useQuery<AboutInfo | null>({
    queryKey: ["about"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAbout();
    },
    enabled: !!actor,
  });

  useEffect(() => {
    if (about) {
      setBio(about.bio);
      setProfilePhotoUrl(about.profilePhotoUrl);
      setLinks(about.socialLinks.map(makeKeyedLink));
      setDirty(false);
    }
  }, [about]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      // Strip _id before sending to backend
      await actor.updateAbout(
        bio,
        links.map(({ _id: _ignored, ...l }) => l),
      );
      if (profilePhotoUrl !== about?.profilePhotoUrl) {
        await actor.updateProfilePhoto(profilePhotoUrl);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["about"] });
      setDirty(false);
      toast.success("About section updated");
    },
    onError: () => toast.error("Failed to update about section"),
  });

  const addLink = () => {
    setLinks([...links, makeKeyedLink({ title: "", url: "", icon: "" })]);
    setDirty(true);
  };
  const updateLink = (id: number, field: keyof SocialLink, value: string) => {
    setLinks(links.map((l) => (l._id === id ? { ...l, [field]: value } : l)));
    setDirty(true);
  };
  const removeLink = (id: number) => {
    setLinks(links.filter((l) => l._id !== id));
    setDirty(true);
  };

  return (
    <div data-ocid="admin.about.section">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display font-bold text-2xl text-foreground">
            About
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Edit your bio and social links.
          </p>
        </div>
        {dirty && (
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            data-ocid="admin.about.save_button"
          >
            {updateMutation.isPending ? (
              "Saving…"
            ) : (
              <>
                <Save className="size-4 mr-1.5" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4" data-ocid="admin.about.loading_state">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-5 w-48 mt-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="space-y-8 max-w-2xl">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Profile
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="profile-photo">Profile Photo URL</Label>
              <Input
                id="profile-photo"
                value={profilePhotoUrl}
                onChange={(e) => {
                  setProfilePhotoUrl(e.target.value);
                  setDirty(true);
                }}
                placeholder="https://…"
                data-ocid="admin.about.photo_url.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setDirty(true);
                }}
                placeholder="Tell visitors about yourself…"
                rows={5}
                data-ocid="admin.about.bio.textarea"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Social Links
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={addLink}
                data-ocid="admin.about.add_link.button"
              >
                <Plus className="size-3.5" />
                Add Link
              </Button>
            </div>
            {links.length === 0 && (
              <p
                className="text-sm text-muted-foreground text-center py-4"
                data-ocid="admin.about.links.empty_state"
              >
                No social links yet. Add one above.
              </p>
            )}
            <div className="space-y-3" data-ocid="admin.about.links.list">
              {links.map((link, i) => (
                <div
                  key={link._id}
                  className="flex items-center gap-3"
                  data-ocid={`admin.about.links.item.${i + 1}`}
                >
                  <Input
                    value={link.title}
                    onChange={(e) =>
                      updateLink(link._id, "title", e.target.value)
                    }
                    placeholder="Title (e.g. GitHub)"
                    className="flex-1"
                    data-ocid={`admin.about.link_title.input.${i + 1}`}
                  />
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      updateLink(link._id, "url", e.target.value)
                    }
                    placeholder="URL"
                    className="flex-1"
                    data-ocid={`admin.about.link_url.input.${i + 1}`}
                  />
                  <Input
                    value={link.icon}
                    onChange={(e) =>
                      updateLink(link._id, "icon", e.target.value)
                    }
                    placeholder="Icon (e.g. github)"
                    className="w-36"
                    data-ocid={`admin.about.link_icon.input.${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(link._id)}
                    className="text-muted-foreground hover:text-destructive transition-smooth"
                    aria-label="Remove link"
                    data-ocid={`admin.about.links.delete_button.${i + 1}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {dirty && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                data-ocid="admin.about.save_button_bottom"
              >
                {updateMutation.isPending ? (
                  "Saving…"
                ) : (
                  <>
                    <Save className="size-4 mr-1.5" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (about) {
                    setBio(about.bio);
                    setProfilePhotoUrl(about.profilePhotoUrl);
                    setLinks(about.socialLinks.map(makeKeyedLink));
                  }
                  setDirty(false);
                }}
                data-ocid="admin.about.discard_button"
              >
                Discard
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Messages Tab ──────────────────────────────────────── */
function MessagesTab({ actor }: { actor: TypedActor }) {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<bigint | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactSubmissions();
    },
    enabled: !!actor,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.markContactRead(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Marked as read");
    },
    onError: () => toast.error("Failed to mark as read"),
  });

  const unread = messages.filter((m) => !m.read).length;
  const sortedMessages = [...messages].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <div data-ocid="admin.messages.section">
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-foreground">
          Messages
        </h2>
        {!isLoading && (
          <p className="text-muted-foreground text-sm mt-1">
            {messages.length} messages · {unread} unread
          </p>
        )}
      </div>

      <div className="space-y-3" data-ocid="admin.messages.list">
        {isLoading &&
          ["sk1", "sk2", "sk3"].map((sk) => (
            <div
              key={sk}
              className="bg-card border border-border rounded-lg p-5"
              data-ocid="admin.messages.loading_state"
            >
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-48 mb-3" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}

        {!isLoading && messages.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground bg-card border border-dashed border-border rounded-xl"
            data-ocid="admin.messages.empty_state"
          >
            <Mail className="size-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-1">
              Contact submissions will appear here.
            </p>
          </div>
        )}

        {sortedMessages.map((msg, index) => {
          const isExpanded = expanded === msg.id;
          return (
            <div
              key={msg.id.toString()}
              className={`bg-card border rounded-xl overflow-hidden transition-smooth ${!msg.read ? "border-primary/30" : "border-border"}`}
              data-ocid={`admin.messages.item.${index + 1}`}
            >
              <button
                type="button"
                className="w-full text-left p-5 flex items-start gap-4"
                onClick={() => setExpanded(isExpanded ? null : msg.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                    <p className="font-medium text-sm text-foreground">
                      {msg.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {msg.email}
                    </span>
                  </div>
                  <p
                    className={`text-sm text-muted-foreground leading-relaxed ${isExpanded ? "" : "line-clamp-1"}`}
                  >
                    {msg.message}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(Number(msg.timestamp)).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" },
                    )}
                  </span>
                  {msg.read ? (
                    <MailOpen className="size-4 text-muted-foreground" />
                  ) : (
                    <Mail className="size-4 text-primary" />
                  )}
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-smooth ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mb-4">
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-3">
                    {!msg.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markReadMutation.mutate(msg.id)}
                        disabled={markReadMutation.isPending}
                        data-ocid={`admin.messages.mark_read.button.${index + 1}`}
                      >
                        <MailOpen className="size-3.5 mr-1.5" />
                        Mark as Read
                      </Button>
                    )}
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm text-primary hover:underline"
                      data-ocid={`admin.messages.reply_link.${index + 1}`}
                    >
                      Reply via email
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main AdminPage ────────────────────────────────────── */
export function AdminPage() {
  const {
    principal,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuth();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");

  useEffect(() => {
    if (isAuthenticated && actor && !actorFetching) {
      (actor as backendInterface).initOwner().catch(() => {
        // silently ignore — already claimed or not authorized
      });
    }
  }, [isAuthenticated, actor, actorFetching]);

  if (authLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center space-y-3">
          <Skeleton className="w-12 h-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPrompt />;

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "projects",
      label: "Projects",
      icon: <FolderOpen className="size-3.5" />,
    },
    { id: "about", label: "About", icon: <User className="size-3.5" /> },
    { id: "messages", label: "Messages", icon: <Mail className="size-3.5" /> },
  ];

  const typedActor = actor as TypedActor;

  return (
    <div className="min-h-screen bg-background" data-ocid="admin.page">
      <div className="bg-card border-b border-border px-6 py-3 sticky top-16 z-40 shadow-subtle">
        <div className="container max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <p className="font-display font-semibold text-sm text-foreground whitespace-nowrap">
              Admin
            </p>
            <Separator orientation="vertical" className="h-5" />
            <nav className="flex items-center gap-0.5" aria-label="Admin tabs">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-smooth flex items-center gap-1.5 ${activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  data-ocid={`admin.tab.${tab.id}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {principal && (
              <p className="font-mono text-xs text-muted-foreground hidden sm:block truncate max-w-[160px]">
                {principal.toString().slice(0, 12)}…
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground gap-1.5"
              data-ocid="admin.logout.button"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 py-10">
        {activeTab === "projects" && <ProjectsTab actor={typedActor} />}
        {activeTab === "about" && <AboutTab actor={typedActor} />}
        {activeTab === "messages" && <MessagesTab actor={typedActor} />}
      </div>
    </div>
  );
}
