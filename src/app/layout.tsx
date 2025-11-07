// Root layout - middleware handles locale routing
// This file is required by Next.js but the actual layout is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
