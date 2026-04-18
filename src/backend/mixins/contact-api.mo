import List "mo:core/List";
import AdminLib "../lib/admin";
import ContactLib "../lib/contact";
import AdminTypes "../types/admin";
import ContactTypes "../types/contact";

mixin (
  ownerRef : AdminTypes.OwnerRef,
  submissions : List.List<ContactTypes.ContactSubmission>,
  nextContactId : AdminTypes.Counter,
) {
  public shared func submitContact(input : ContactTypes.ContactInput) : async ContactTypes.ContactSubmission {
    let submission = ContactLib.submitContact(submissions, nextContactId.value, input);
    nextContactId.value += 1;
    submission;
  };

  public shared ({ caller }) func getContactSubmissions() : async [ContactTypes.ContactSubmission] {
    AdminLib.requireOwner(ownerRef, caller);
    ContactLib.getSubmissions(submissions);
  };

  public shared ({ caller }) func markContactRead(id : ContactTypes.ContactId) : async Bool {
    AdminLib.requireOwner(ownerRef, caller);
    ContactLib.markRead(submissions, id);
  };
};
