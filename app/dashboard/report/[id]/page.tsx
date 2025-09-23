async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  console.log(id);
  return <div>ReportPage {id}</div>;
}

export default ReportPage;
