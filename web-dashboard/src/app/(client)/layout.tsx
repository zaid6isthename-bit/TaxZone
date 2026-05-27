import { BottomNav } from "@/components/ui/bottom-nav";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="w-full min-h-screen bg-gray-50">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
