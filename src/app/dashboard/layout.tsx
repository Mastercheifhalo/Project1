import Sidebar from '@/components/dashboard/Sidebar';
import AuraBackground from '@/components/dashboard/AuraBackground';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // In a real app, this would come from a user context
    const progress = 45;

    return (
        <div className="min-h-screen relative flex">
            <AuraBackground progress={progress} />
            <Sidebar />
            <main className="flex-1 min-h-screen p-8 transition-all duration-500 pl-72">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
