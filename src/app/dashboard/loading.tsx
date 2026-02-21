// Dashboard overview loading skeleton
function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-white/5 ${className}`}
            style={{ backdropFilter: "blur(4px)" }}
        />
    );
}

export default function DashboardLoading() {
    return (
        <div className="space-y-8">
            {/* Welcome banner skeleton */}
            <div
                className="rounded-2xl p-8 md:p-10"
                style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.15)" }}
            >
                <Skeleton className="h-8 w-48 mb-3" />
                <Skeleton className="h-5 w-72" />
                <div className="mt-6 flex gap-3">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl p-5"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <Skeleton className="h-8 w-8 rounded-lg mb-3" />
                        <Skeleton className="h-7 w-16 mb-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>

            {/* Active session skeleton */}
            <div>
                <Skeleton className="h-7 w-56 mb-4" />
                <div
                    className="rounded-2xl p-6"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <Skeleton className="w-full aspect-video rounded-xl mb-5" />
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        </div>
    );
}
