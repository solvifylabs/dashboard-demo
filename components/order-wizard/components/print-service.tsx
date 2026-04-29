"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function PrintServiceIndicator() {
  return (
    <Badge variant="default" className="gap-2 bg-green-600 pointer-events-none select-none">
      <CheckCircle className="h-3 w-3" />
      Impresora lista
    </Badge>
  );
}
