import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/widgets/header";
import { ResultDetail } from "@/widgets/result-detail";
import { MOCK_PLACES } from "@/shared/mocks";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const place = MOCK_PLACES.find((p) => p.id === id);

  if (!place) {
    notFound();
  }

  const t = await getTranslations();
  const cityLabel = t(`cities.${place.city}`);

  return (
    <>
      <Header showBack city={cityLabel} />
      <main className="flex-1 max-w-md mx-auto w-full">
        <ResultDetail place={place} />
      </main>
    </>
  );
}
