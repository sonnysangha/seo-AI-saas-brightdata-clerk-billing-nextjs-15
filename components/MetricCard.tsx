import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground">
            {changeType === "positive" && (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            )}
            {changeType === "negative" && (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={
                changeType === "positive"
                  ? "text-green-500"
                  : changeType === "negative"
                    ? "text-red-500"
                    : ""
              }
            >
              {change}
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
