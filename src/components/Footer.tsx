export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 mt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-12 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-deep text-ink-950 font-mono font-bold text-sm">
              JE
            </span>
            <span className="font-medium text-white/90">Julius Eggert</span>
          </div>
          <p className="mt-3 text-mute max-w-xs">
            Software, KI-Automation, Websites und CMS-Lösungen für Unternehmen, die digital
            schneller werden wollen.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono uppercase text-xs tracking-widest text-mute-soft">
            Navigation
          </span>
          <a href="#leistungen" className="text-white/70 hover:text-white transition">
            Leistungen
          </a>
          <a href="#prozess" className="text-white/70 hover:text-white transition">
            Prozess
          </a>
          <a href="#loesungen" className="text-white/70 hover:text-white transition">
            Lösungen
          </a>
          <a href="#kontakt" className="text-white/70 hover:text-white transition">
            Kontakt
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono uppercase text-xs tracking-widest text-mute-soft">
            Kontakt
          </span>
          <a href="mailto:hello@example.com" className="text-white/70 hover:text-white transition">
            hello@example.com
          </a>
          <span className="text-mute-soft text-xs mt-3">
            © {new Date().getFullYear()} Julius Eggert. Alle Rechte vorbehalten.
          </span>
        </div>
      </div>
    </footer>
  );
}
