import List "mo:core/List";
import AdminLib "../lib/admin";
import ProjectsLib "../lib/projects";
import AdminTypes "../types/admin";
import ProjectTypes "../types/projects";

mixin (
  ownerRef : AdminTypes.OwnerRef,
  projects : List.List<ProjectTypes.Project>,
  nextProjectId : AdminTypes.Counter,
) {
  public query func getProjects() : async [ProjectTypes.Project] {
    ProjectsLib.listProjects(projects);
  };

  public query func getProject(id : ProjectTypes.ProjectId) : async ?ProjectTypes.Project {
    ProjectsLib.getProject(projects, id);
  };

  public shared ({ caller }) func addProject(input : ProjectTypes.ProjectInput) : async ProjectTypes.Project {
    AdminLib.requireOwner(ownerRef, caller);
    let project = ProjectsLib.addProject(projects, nextProjectId.value, input);
    nextProjectId.value += 1;
    project;
  };

  public shared ({ caller }) func updateProject(id : ProjectTypes.ProjectId, input : ProjectTypes.ProjectInput) : async Bool {
    AdminLib.requireOwner(ownerRef, caller);
    ProjectsLib.updateProject(projects, id, input);
  };

  public shared ({ caller }) func deleteProject(id : ProjectTypes.ProjectId) : async Bool {
    AdminLib.requireOwner(ownerRef, caller);
    ProjectsLib.deleteProject(projects, id);
  };
};
