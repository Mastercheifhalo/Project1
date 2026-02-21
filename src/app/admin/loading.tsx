// Admin overview loading skeleton
function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-white/5 ${className}`}
        />
    );
}

export default function AdminLoading() {
    return (
        <div className="space-y-8">
            {/* Page title skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-44" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl p-5"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <Skeleton className="h-8 w-8 rounded-lg mb-3" />
                        <Skeleton className="h-7 w-20 mb-2" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
                {/* Table header */}
                <div className="p-5 border-b border-white/8 flex justify-between items-center">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-9 w-40 rounded-xl" />
                </div>
                {/* Table rows */}
                <div className="divide-y divide-white/5">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="px-5 py-4 flex items-center gap-4">
                            <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
