const creditFields = [
  { label: "Design & Development", value: "Paolo Jansen Enrera" },
  { label: "Based In", value: "Cebu City, Philippines" },
  { label: "Available For Work", value: "Salesforce, Agentforce, Full-time" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-em-invert-text/10 px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="grid gap-6 border-t border-em-invert-text/10 pt-8 font-mono text-xs uppercase tracking-[0.1em] text-em-invert-muted sm:grid-cols-3">
          {creditFields.map((field) => (
            <div key={field.label}>
              <p className="text-em-invert-muted/60">{field.label}</p>
              <p className="mt-1 text-em-invert-text">{field.value}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-em-invert-muted/60">
          © {new Date().getFullYear()} Paolo Jansen Enrera. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
