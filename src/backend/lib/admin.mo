import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

module {
  public func initOwner(ownerRef : { var value : ?Principal }, caller : Principal) : Bool {
    switch (ownerRef.value) {
      case (?_) { false };
      case null {
        ownerRef.value := ?caller;
        true;
      };
    };
  };

  public func isOwner(ownerRef : { var value : ?Principal }, caller : Principal) : Bool {
    switch (ownerRef.value) {
      case (?owner) { Principal.equal(owner, caller) };
      case null { false };
    };
  };

  public func requireOwner(ownerRef : { var value : ?Principal }, caller : Principal) {
    if (not isOwner(ownerRef, caller)) {
      Runtime.trap("Unauthorized: caller is not the owner");
    };
  };
};
