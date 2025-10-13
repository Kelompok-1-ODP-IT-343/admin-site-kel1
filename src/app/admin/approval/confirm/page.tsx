export default function ConfirmApproval(){
    return (
        <div className="max-w-xl mx-auto p-8 rounded-2xl border">
            <h1 className="text-2xl font-bold text-teal-800 mb-6 text-center">Konfirmasi Approval</h1>
            <form className="space-y-4">
            <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="w-full rounded-xl border px-4 py-2" />
            </div>
            <div>
                <label className="block text-sm mb-1">Password</label>
                <input type="password" className="w-full rounded-xl border px-4 py-2" />
            </div>
            <div className="text-center">
                <button className="rounded-xl bg-teal-800 text-white px-6 py-2">Login</button>
            </div>
        </form>
    </div>
    );
}