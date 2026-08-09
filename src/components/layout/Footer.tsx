const creditFields = [
  { label: "Design & Development", value: "Paolo Jansen Enrera" },
  { label: "Based In", value: "Cebu City, Philippines" },
  { label: "Available For Work", value: "Salesforce, Agentforce, Full-time" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-em-invert-text/10 px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="grid gap-6 font-mono text-xs uppercase tracking-[0.1em] text-em-invert-muted sm:grid-cols-3">
          {creditFields.map((field) => (
            <div key={field.label}>
              <p className="flex items-center gap-2 text-em-invert-muted/60">
                {field.label === "Available For Work" && (
                  <span
                    aria-hidden="true"
                    className="inline-block size-2 shrink-0 animate-pulse rounded-full bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]"
                  />
                )}
                {field.label}
              </p>
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
