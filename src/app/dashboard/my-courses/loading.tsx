// My Courses page loading skeleton
function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-white/5 ${className}`}
        />
    );
}

export default function MyCoursesLoading() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <Skeleton className="h-9 w-44 mb-2" />
                <Skeleton className="h-5 w-56" />
            </div>

            {/* Search + Filter row */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="h-11 w-36 rounded-xl" />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
            </div>

            {/* Course cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        {/* Thumbnail */}
                        <Skeleton className="w-full h-44 rounded-none" />
                        <div className="p-5 space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            {/* Progress bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-8" />
                                </div>
                                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                                    <Skeleton className="h-full w-2/3 rounded-full" />
                                </div>
                            </div>
                            <Skeleton className="h-9 w-full rounded-xl mt-2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
