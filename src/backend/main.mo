import List "mo:core/List";
import AboutMixin "mixins/about-api";
import AdminMixin "mixins/admin-api";
import ContactMixin "mixins/contact-api";
import ProjectsMixin "mixins/projects-api";
import AboutTypes "types/about";
import AdminTypes "types/admin";
import ContactTypes "types/contact";
import ProjectTypes "types/projects";

actor {
  let ownerRef : AdminTypes.OwnerRef = { var value = null };
  let aboutRef : { var value : ?AboutTypes.AboutInfo } = { var value = null };
  let projects = List.empty<ProjectTypes.Project>();
  let nextProjectId : AdminTypes.Counter = { var value = 1 };
  let submissions = List.empty<ContactTypes.ContactSubmission>();
  let nextContactId : AdminTypes.Counter = { var value = 1 };

  include AdminMixin(ownerRef);
  include AboutMixin(ownerRef, aboutRef);
  include ProjectsMixin(ownerRef, projects, nextProjectId);
  include ContactMixin(ownerRef, submissions, nextContactId);
};
