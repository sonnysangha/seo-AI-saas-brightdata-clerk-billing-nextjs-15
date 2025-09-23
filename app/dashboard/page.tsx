"use client";

import startScraping from "@/actions/startScraping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chatbot } from "@/components/Chatbot";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    const response = await startScraping(prompt);
    if (response.ok) {
      console.log(response.data);
      const snapshotId = response.data.snapshot_id;
      router.push(`/dashboard/report/${snapshotId}`);
    } else {
      console.error(response.error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a Name / Business / Product / Website etc."
        />
        <Button type="submit">Generate Report</Button>
      </form>
      <Chatbot />
    </div>
  );
}

export default Dashboard;
