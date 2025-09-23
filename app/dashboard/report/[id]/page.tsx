"use client";

import { Chatbot } from "@/components/Chatbot";
import { useParams } from "next/navigation";

function ReportPage() {
  const params = useParams();
  const id = params.id as string;

  console.log(id);
  return (
    <div>
      <h1>ReportPage {id}</h1>
      <p>Your SEO report details will appear here.</p>
      <Chatbot />
    </div>
  );
}

export default ReportPage;
