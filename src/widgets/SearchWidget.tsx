import { SearchForm } from "@/features/search/ui/SearchForm";

export function SearchWidget() {
  return (
    <main className="flex flex-col items-center justify-center px-5 py-12 text-center md:px-0 md:py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
        Найдём нужную деталь.
        <br />
        <span className="text-blue-700">Среди сотен предложений.</span>
      </h1>

      <p className="max-w-prose mx-auto text-xl text-gray-600 mb-7.5">
        Укажите автомобиль и запчасть — сравним предложения из разных
        источников, чтобы вы могли выбрать подходящий вариант по цене и
        состоянию.
      </p>

      <div className="w-full max-w-3xl">
        <SearchForm />
      </div>
    </main>
  );
}
