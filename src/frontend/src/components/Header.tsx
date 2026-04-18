import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";

type NavLink = { label: string; to: string; hash?: string };

const NAV_LINKS: NavLink[] = [
  { label: "About", to: "/", hash: "about" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/", hash: "contact" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  function handleNavClick(link: NavLink) {
    if (link.hash) {
      navigate({ to: link.to, hash: link.hash }).then(() => {
        const el = document.getElementById(link.hash as string);
        el?.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      navigate({ to: link.to });
    }
  }

  function handleContactClick(closeMobile?: boolean) {
    if (closeMobile) setMobileOpen(false);
    navigate({ to: "/", hash: "contact" }).then(() => {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-bold text-lg tracking-tight text-foreground hover:text-primary transition-smooth"
          data-ocid="header.logo.link"
        >
          ELIZA REED
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={`${link.to}${link.hash ?? ""}`}
              onClick={() => handleNavClick(link)}
              className={cn(
                "text-sm font-medium transition-smooth",
                currentPath === link.to && !link.hash
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`header.nav.${link.label.toLowerCase()}.link`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="header.theme_toggle"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          {/* CTA */}
          <Button
            size="sm"
            className="hidden md:flex font-medium"
            onClick={() => handleContactClick()}
            data-ocid="header.cta.button"
          >
            Get in Touch
          </Button>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle mobile menu"
            className="md:hidden text-muted-foreground hover:text-foreground"
            data-ocid="header.mobile_menu_toggle"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-4"
          data-ocid="header.mobile_menu"
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={`${link.to}${link.hash ?? ""}`}
              onClick={() => {
                setMobileOpen(false);
                handleNavClick(link);
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth py-1 text-left"
              data-ocid={`header.mobile_nav.${link.label.toLowerCase()}.link`}
            >
              {link.label}
            </button>
          ))}
          <Button
            size="sm"
            className="w-full font-medium"
            data-ocid="header.mobile_cta.button"
            onClick={() => handleContactClick(true)}
          >
            Get in Touch
          </Button>
        </div>
      )}
    </header>
  );
}
