import { Header } from "@/shared/ui/Header";
import { SearchWidget } from "@/widgets/SearchWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchWidget />
    </div>
  );
}
