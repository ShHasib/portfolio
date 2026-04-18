module {
  public type SocialLink = {
    title : Text;
    url : Text;
    icon : Text;
  };

  public type AboutInfo = {
    bio : Text;
    profilePhotoUrl : Text;
    socialLinks : [SocialLink];
  };
};
