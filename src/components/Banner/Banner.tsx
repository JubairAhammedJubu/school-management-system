import Link from "next/link";

const Banner = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Background Decorations */}
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-100 dark:bg-blue-950/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-100 dark:bg-indigo-950/40 blur-3xl" />

        <div className="relative mx-auto flex min-h-162.5 max-w-7xl items-center px-6 py-30 lg:px-8">
          <div className="grid w-full items-center gap-14 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                Smart School Management Platform
              </div>

              <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                Manage Your School.
                <br />
                <span className="text-blue-600 dark:text-blue-400">Simplify Everything.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                EduNexus brings students, teachers, academic activities, and
                school administration together in one unified platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 px-7 py-3.5 font-semibold text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/30 transition hover:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer active:scale-95"
                >
                  Get Started →
                </Link>

                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-200 transition hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer active:scale-95"
                >
                  Explore Features
                </Link>
              </div>

              {/* Small Info */}
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500 dark:text-slate-400">
                <span>✓ Admin</span>
                <span>✓ Teacher</span>
                <span>✓ Student</span>
                <span>✓ AI-Powered</span>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:block">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-blue-200/50 dark:bg-blue-600/20 blur-3xl" />

              {/* Main Illustration */}
              <div className="relative mx-auto flex h-105 w-105 items-center justify-center">
                {/* Outer Circle */}
                <div className="absolute h-95 w-95 rounded-full border border-blue-200 dark:border-blue-900 bg-white/70 dark:bg-slate-900/70 shadow-2xl backdrop-blur-xs" />

                {/* Inner Circle */}
                <div className="absolute h-75 w-75 rounded-full bg-blue-50 dark:bg-slate-800/60" />

                {/* School Building */}
                <div className="relative z-10 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-3xl shadow-lg">
                      🎓
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      EduNexus
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      School Management System
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/60 p-3 text-center">
                      <p className="text-lg">👨‍💼</p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        Admin
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-50 dark:bg-emerald-950/60 p-3 text-center">
                      <p className="text-lg">👨‍🏫</p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        Teacher
                      </p>
                    </div>

                    <div className="rounded-lg bg-purple-50 dark:bg-purple-950/60 p-3 text-center">
                      <p className="text-lg">🎓</p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        Student
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute left-0 top-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Performance</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Analytics
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-12 right-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🤖</span>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Powered by</p>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        AI Insights
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-2 top-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📚</span>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Academic</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Management
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Banner;
