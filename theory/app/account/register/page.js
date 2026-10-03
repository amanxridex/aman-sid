"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("cozy_user", JSON.stringify({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      }));
      router.push("/account");
    }, 1000);
  };

  return (
    <div className="bg-[#fffdf8] min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white border border-[#e5e3dc] p-8 md:p-10 shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#f7f5ef] flex items-center justify-center mx-auto border border-[#e5e3dc]">
            <UserPlus className="w-5 h-5 text-neutral-600" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase block">
            Collector Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
            Create Account
          </h1>
          <p className="text-xs font-mono text-neutral-500">
            Gain early access to one-off drops and manage your collection.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-[#f7f5ef] border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-[#f7f5ef] border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-600 block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full bg-[#f7f5ef] border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-600 block mb-1">
              Create Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-[#f7f5ef] border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#121212] text-[#fffdf8] text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {loading ? <span>Creating Account...</span> : <span>Register Now →</span>}
          </button>
        </form>

        {/* Existing Account Link */}
        <div className="text-center pt-4 border-t border-[#e5e3dc] space-y-2">
          <p className="text-xs font-mono text-neutral-500">
            Already have an account?
          </p>
          <Link
            href="/account/login"
            className="inline-block text-xs font-mono font-bold uppercase underline hover:text-neutral-500"
          >
            Sign In Instead
          </Link>
        </div>

      </div>
    </div>
  );
}
