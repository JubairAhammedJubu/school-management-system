const Navbar = () => {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl">
            🎓
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Edu<span className="text-blue-600">Manage</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              School Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Contact
          </a>
        </nav>

        {/* Buttons */}
        <div className="hidden items-center gap-3 sm:flex">
          <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
            Get Started
          </button>
        </div>

        {/* Mobile */}
        <button className="rounded-lg border border-slate-200 px-3 py-2 md:hidden">
          ☰
        </button>
      </div>
    </header>
  );
};

export default Navbar;
