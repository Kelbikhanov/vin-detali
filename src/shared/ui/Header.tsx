export function Header() {
  return (
    <header className="border-b border-gray-300 bg-white">
      <div className="mx-auto flex h-22 w-full max-w-5xl items-center justify-between gap-6 px-8">
        <a href="#" className="flex items-center gap-2.5 text-gray-900 no-underline">
          <div className="grid h-10.5 w-10.5 place-items-center rounded-md bg-blue-50">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              className="h-8 w-8 text-blue-700"
            >
              <path
                d="M5 22.5 9 13h22l4 9.5v8H5v-8Z"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="m11 13 3-5h12l3 5M9 22h22M11 27h3m12 0h3"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="12" cy="30" r="3" fill="#1769E8" />
              <circle cx="28" cy="30" r="3" fill="#1769E8" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Detail<span className="text-blue-700">Bot</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm font-bold text-gray-700 hover:text-blue-700">
            Как это работает
          </a>
          <a href="#sources" className="text-sm font-bold text-gray-700 hover:text-blue-700">
            Источники поиска
          </a>
        </nav>

        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-400 bg-white px-4 py-3 text-xs font-extrabold text-gray-900 no-underline hover:bg-gray-50"
        >
          Telegram <span className="text-blue-700">↗</span>
        </a>
      </div>
    </header>
  );
}
