import { developerCredit } from "@/shared/brand";

// Global site footer: a minimal developer/studio credit shown on every view.
export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
      Desarrollado por{" "}
      <a
        href={developerCredit.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        {developerCredit.companyName}
      </a>{" "}
      · © {new Date().getFullYear()}
    </footer>
  );
}
