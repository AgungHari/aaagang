export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth layout - no auth check, just render login page as is
  return <>{children}</>;
}
