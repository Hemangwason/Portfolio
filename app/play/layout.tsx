import { ThemeShell } from "../components/ThemeShell";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeShell wordmark="/play" accent="accent">
      {children}
    </ThemeShell>
  );
}
