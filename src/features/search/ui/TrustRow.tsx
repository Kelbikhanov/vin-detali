export function TrustRow() {
  return (
    <div id="sources" className="mt-6.5 flex flex-col items-start justify-center gap-3.5 md:flex-row md:items-center md:gap-6.5">
      <div className="flex items-start gap-2.5 text-left">
        <div className="grid h-8.5 w-8.5 flex-shrink-0 place-items-center rounded-md bg-blue-50 font-extrabold text-blue-700 text-lg">
          ⌕
        </div>
        <div>
          <b className="block text-xs font-extrabold">Один поиск</b>
          <small className="block mt-0.75 text-xs text-gray-600">вместо десятков вкладок</small>
        </div>
      </div>

      <div className="hidden h-7.5 w-px bg-gray-400 md:block"></div>

      <div className="flex items-start gap-2.5 text-left">
        <div className="grid h-8.5 w-8.5 flex-shrink-0 place-items-center rounded-md bg-blue-50 font-extrabold text-blue-700 text-lg">
          ₽
        </div>
        <div>
          <b className="block text-xs font-extrabold">Сравнение цен</b>
          <small className="block mt-0.75 text-xs text-gray-600">на разных площадках</small>
        </div>
      </div>

      <div className="hidden h-7.5 w-px bg-gray-400 md:block"></div>

      <div className="flex items-start gap-2.5 text-left">
        <div className="grid h-8.5 w-8.5 flex-shrink-0 place-items-center rounded-md bg-blue-50 font-extrabold text-blue-700 text-lg">
          ↗
        </div>
        <div>
          <b className="block text-xs font-extrabold">Переход к продавцу</b>
          <small className="block mt-0.75 text-xs text-gray-600">заказ на исходном сайте</small>
        </div>
      </div>
    </div>
  );
}
