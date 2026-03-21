import { notFound } from "next/navigation";
import { Header } from "@/widgets/header";
import { ResultDetail } from "@/widgets/result-detail";
import { MOCK_PLACES } from "@/shared/mocks";
import { CITIES } from "@/shared/config";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = MOCK_PLACES.find((p) => p.id === id);

  if (!place) {
    notFound();
  }

  const cityLabel = CITIES.find((c) => c.key === place.city)?.label;

  return (
    <>
      <Header showBack city={cityLabel} />
      <main className="flex-1 max-w-md mx-auto w-full">
        <ResultDetail place={place} />
      </main>
    </>
  );
}
