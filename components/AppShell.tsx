import { ContentContainer } from '@/components/ContentContainer';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { ProtectedPage } from '@/components/ProtectedPage';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="flex min-h-0 flex-1 flex-col transition-[margin] duration-300 lg:ml-[var(--sidebar-width)]">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <Topbar />
            <main className="py-8">
              <ContentContainer>{children}</ContentContainer>
            </main>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
