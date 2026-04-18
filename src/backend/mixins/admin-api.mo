import AdminLib "../lib/admin";
import AdminTypes "../types/admin";

mixin (ownerRef : AdminTypes.OwnerRef) {
  public shared ({ caller }) func initOwner() : async Bool {
    AdminLib.initOwner(ownerRef, caller);
  };

  public query ({ caller }) func isOwner() : async Bool {
    AdminLib.isOwner(ownerRef, caller);
  };
};
