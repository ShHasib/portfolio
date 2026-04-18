import AdminLib "../lib/admin";
import AboutLib "../lib/about";
import AdminTypes "../types/admin";
import AboutTypes "../types/about";

mixin (
  ownerRef : AdminTypes.OwnerRef,
  aboutRef : { var value : ?AboutTypes.AboutInfo },
) {
  public query func getAbout() : async ?AboutTypes.AboutInfo {
    AboutLib.getAbout(aboutRef.value);
  };

  public shared ({ caller }) func updateAbout(bio : Text, socialLinks : [AboutTypes.SocialLink]) : async () {
    AdminLib.requireOwner(ownerRef, caller);
    let current = switch (aboutRef.value) {
      case (?info) { info };
      case null { { bio = ""; profilePhotoUrl = ""; socialLinks = [] } };
    };
    aboutRef.value := ?AboutLib.updateAbout({ current with bio; socialLinks });
  };

  public shared ({ caller }) func updateProfilePhoto(photoUrl : Text) : async () {
    AdminLib.requireOwner(ownerRef, caller);
    let current = switch (aboutRef.value) {
      case (?info) { info };
      case null { { bio = ""; profilePhotoUrl = ""; socialLinks = [] } };
    };
    aboutRef.value := ?AboutLib.updateAbout({ current with profilePhotoUrl = photoUrl });
  };
};
