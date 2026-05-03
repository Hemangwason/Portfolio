import { ThemeShell } from "../components/ThemeShell";

export default function GroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeShell wordmark="/ground" accent="brand">
      {children}
    </ThemeShell>
  );
}
