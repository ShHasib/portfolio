import List "mo:core/List";
import Types "../types/projects";

module {
  public func listProjects(projects : List.List<Types.Project>) : [Types.Project] {
    projects.toArray();
  };

  public func getProject(projects : List.List<Types.Project>, id : Types.ProjectId) : ?Types.Project {
    projects.find(func(p) { p.id == id });
  };

  public func addProject(
    projects : List.List<Types.Project>,
    nextId : Nat,
    input : Types.ProjectInput,
  ) : Types.Project {
    let project : Types.Project = {
      id = nextId;
      title = input.title;
      description = input.description;
      techTags = input.techTags;
      imageUrl = input.imageUrl;
      liveUrl = input.liveUrl;
      sourceUrl = input.sourceUrl;
      order = input.order;
      visible = input.visible;
    };
    projects.add(project);
    project;
  };

  public func updateProject(projects : List.List<Types.Project>, id : Types.ProjectId, input : Types.ProjectInput) : Bool {
    var found = false;
    projects.mapInPlace(
      func(p) {
        if (p.id == id) {
          found := true;
          {
            p with
            title = input.title;
            description = input.description;
            techTags = input.techTags;
            imageUrl = input.imageUrl;
            liveUrl = input.liveUrl;
            sourceUrl = input.sourceUrl;
            order = input.order;
            visible = input.visible;
          };
        } else { p };
      }
    );
    found;
  };

  public func deleteProject(projects : List.List<Types.Project>, id : Types.ProjectId) : Bool {
    let sizeBefore = projects.size();
    let filtered = projects.filter(func(p) { p.id != id });
    let sizeAfter = filtered.size();
    if (sizeAfter < sizeBefore) {
      projects.clear();
      projects.append(filtered);
      true;
    } else {
      false;
    };
  };
};
