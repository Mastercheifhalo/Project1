import { auth } from "@/auth";

export default async function TestPage() {
    const session = await auth();

    return (
        <div className="p-10 space-y-4">
            <h1 className="text-2xl font-bold">Routing Diagnostic Page</h1>
            <p>If you can see this, routing is working.</p>
            <div className="bg-slate-100 p-4 rounded-lg">
                <h2 className="font-bold">Session Data (Server Side):</h2>
                <pre>{JSON.stringify(session?.user, null, 2)}</pre>
            </div>
        </div>
    );
}
