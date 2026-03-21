export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="flex-1 px-6 py-8">
      <p className="text-muted-foreground text-center">
        /result/{id} — 결과 상세 페이지 (개발 예정)
      </p>
    </main>
  );
}
