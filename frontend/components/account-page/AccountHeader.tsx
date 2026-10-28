import Link from "next/link";

export function AccountHeader() {
  return (
    <header className="border-b border-[#E3DFD8] bg-[#FAF8F5]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-[#857F73]">
            <li>
              <Link
                href="/"
                className="transition-colors duration-150 hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#17181A]">
              My Account
            </li>
          </ol>
        </nav>
        <h1 className="mt-3 font-serif text-3xl font-normal text-[#17181A] sm:text-4xl">
          My Account
        </h1>
      </div>
    </header>
  );
}