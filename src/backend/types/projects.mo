module {
  public type ProjectId = Nat;

  public type Project = {
    id : ProjectId;
    title : Text;
    description : Text;
    techTags : [Text];
    imageUrl : Text;
    liveUrl : Text;
    sourceUrl : Text;
    order : Nat;
    visible : Bool;
  };

  public type ProjectInput = {
    title : Text;
    description : Text;
    techTags : [Text];
    imageUrl : Text;
    liveUrl : Text;
    sourceUrl : Text;
    order : Nat;
    visible : Bool;
  };
};
