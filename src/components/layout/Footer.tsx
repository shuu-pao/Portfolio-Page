import { Code2, Link2, Mail } from "lucide-react";

const socialLinks = [
  { href: "https://github.com", icon: Code2, label: "GitHub" },
  { href: "https://linkedin.com", icon: Link2, label: "LinkedIn" },
  { href: "mailto:hello@paolo.dev", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-zinc-950 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-zinc-500">
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
              className="cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
