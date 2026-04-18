import Common "common";

module {
  public type ContactId = Nat;

  public type ContactSubmission = {
    id : ContactId;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Common.Timestamp;
    read : Bool;
  };

  public type ContactInput = {
    name : Text;
    email : Text;
    message : Text;
  };
};
