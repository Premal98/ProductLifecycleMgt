import { ContentContainer } from '@/components/ContentContainer';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { ProtectedPage } from '@/components/ProtectedPage';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="py-8">
            <ContentContainer>{children}</ContentContainer>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}
