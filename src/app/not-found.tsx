import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-lg mx-auto">
                {/* Glowing number */}
                <div className="relative mb-8">
                    <span
                        className="text-[10rem] font-extrabold leading-none select-none"
                        style={{
                            background: "linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            filter: "drop-shadow(0 0 40px rgba(168,85,247,0.4))",
                        }}
                    >
                        404
                    </span>
                    {/* Subtle pulse ring */}
                    <div
                        className="absolute inset-0 rounded-full opacity-20 animate-ping"
                        style={{
                            background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
                            animationDuration: "3s",
                        }}
                    />
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                        style={{
                            background: "rgba(168,85,247,0.15)",
                            border: "1px solid rgba(168,85,247,0.3)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        🔭
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Looks like this lesson doesn&apos;t exist yet — or maybe it moved.
                    <br />
                    Head back and keep learning!
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105"
                        style={{
                            background: "linear-gradient(135deg, #a855f7, #6366f1)",
                            boxShadow: "0 4px 20px rgba(168,85,247,0.35)",
                        }}
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        href="/courses"
                        className="px-6 py-3 rounded-xl text-gray-300 font-semibold transition-all duration-200 hover:scale-105 hover:text-white"
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        Browse Courses
                    </Link>
                </div>
            </div>
        </div>
    );
}
