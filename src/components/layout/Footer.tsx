import { Code2, Link2, Mail } from "lucide-react";

const socialLinks = [
  { href: "https://github.com", icon: Code2, label: "GitHub" },
  { href: "https://linkedin.com", icon: Link2, label: "LinkedIn" },
  { href: "mailto:hello@paolo.dev", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-em-text/10 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-em-text-muted">
          © {new Date().getFullYear()} Paolo Rossi. Crafted with intent.
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="cursor-pointer rounded-lg p-2 text-em-text-muted transition-colors hover:bg-em-accent/10 hover:text-em-accent"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
