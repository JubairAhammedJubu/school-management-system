const Banner = () => {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-50">
        {/* Background Decorations */}
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />

        <div className="relative mx-auto flex min-h-162.5 max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="grid w-full items-center gap-14 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Smart School Management Platform
              </div>

              <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-6xl">
                Manage Your School.
                <br />
                <span className="text-blue-600">Simplify Everything.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                EduManage brings students, teachers, academic activities, and
                school administration together in one unified platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-700">
                  Get Started →
                </button>

                <button className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50">
                  Explore Features
                </button>
              </div>

              {/* Small Info */}
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
                <span>✓ Admin</span>
                <span>✓ Teacher</span>
                <span>✓ Student</span>
                <span>✓ AI-Powered</span>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:block">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-blue-200/50 blur-3xl" />

              {/* Main Illustration */}
              <div className="relative mx-auto flex h-105 w-105 items-center justify-center">
                {/* Outer Circle */}
                <div className="absolute h-95 w-95 rounded-full border border-blue-200 bg-white/70 shadow-2xl" />

                {/* Inner Circle */}
                <div className="absolute h-75 w-75 rounded-full bg-blue-50" />

                {/* School Building */}
                <div className="relative z-10 w-64 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl shadow-lg">
                      🎓
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <h3 className="text-xl font-bold text-slate-900">
                      EduManage
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      School Management System
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                      <p className="text-lg">👨‍💼</p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-600">
                        Admin
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-50 p-3 text-center">
                      <p className="text-lg">👨‍🏫</p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-600">
                        Teacher
                      </p>
                    </div>

                    <div className="rounded-lg bg-purple-50 p-3 text-center">
                      <p className="text-lg">🎓</p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-600">
                        Student
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute left-0 top-16 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>

                    <div>
                      <p className="text-xs text-slate-400">Performance</p>
                      <p className="text-sm font-bold text-slate-800">
                        Analytics
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-12 right-0 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🤖</span>

                    <div>
                      <p className="text-xs text-slate-400">Powered by</p>
                      <p className="text-sm font-bold text-blue-600">
                        AI Insights
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-2 top-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📚</span>

                    <div>
                      <p className="text-xs text-slate-400">Academic</p>
                      <p className="text-sm font-bold text-slate-800">
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
