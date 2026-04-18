import { FaLinkedin } from "react-icons/fa";
import { SiDribbble, SiGithub } from "react-icons/si";

const SOCIAL_LINKS = [
  { icon: SiGithub, label: "GitHub", href: "https://github.com" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: SiDribbble, label: "Dribbble", href: "https://dribbble.com" },
];

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      className="bg-card border-t border-border mt-auto"
      data-ocid="footer.section"
    >
      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="font-display font-bold text-base tracking-tight text-foreground mb-2">
              ELIZA REED
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Senior Product Designer & Frontend Developer crafting premium
              digital experiences.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Navigation
            </p>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Find me online
            </p>
            <div className="flex flex-col gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-smooth group"
                  data-ocid={`footer.social.${label.toLowerCase()}.link`}
                >
                  <Icon className="size-4 group-hover:text-primary transition-smooth" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
          <p>Designed & developed with care.</p>
        </div>
      </div>
    </footer>
  );
}
