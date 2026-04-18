import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/contact";

module {
  public func submitContact(
    submissions : List.List<Types.ContactSubmission>,
    nextId : Nat,
    input : Types.ContactInput,
  ) : Types.ContactSubmission {
    let submission : Types.ContactSubmission = {
      id = nextId;
      name = input.name;
      email = input.email;
      message = input.message;
      timestamp = Time.now();
      read = false;
    };
    submissions.add(submission);
    submission;
  };

  public func getSubmissions(submissions : List.List<Types.ContactSubmission>) : [Types.ContactSubmission] {
    submissions.toArray();
  };

  public func markRead(submissions : List.List<Types.ContactSubmission>, id : Types.ContactId) : Bool {
    var found = false;
    submissions.mapInPlace(
      func(s) {
        if (s.id == id) {
          found := true;
          { s with read = true };
        } else { s };
      }
    );
    found;
  };
};
