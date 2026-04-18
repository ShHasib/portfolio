import { createActor } from "@/backend";
import type {
  AboutInfo,
  ContactInput,
  ContactSubmission,
  Project,
} from "@/types/index";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAbout() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AboutInfo | null>({
    queryKey: ["about"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAbout();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContact() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<ContactSubmission, Error, ContactInput>({
    mutationFn: async (input: ContactInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitContact(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useProject(id: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Project | null>({
    queryKey: ["project", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProject(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsOwner() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["isOwner"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isOwner();
    },
    enabled: !!actor && !isFetching,
  });
}
