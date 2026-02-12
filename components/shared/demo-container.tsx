import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

interface DemoContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  color?: {
    bgLight: string;
    border: string;
    text: string;
    badge: string;
  };
}

export function DemoContainer({
  title,
  description,
  children,
  color,
}: DemoContainerProps) {
  return (
    <Card className={cn("border-2 border-dashed", color?.border || "border-gray-300")}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Play
            className={cn("h-5 w-5", color?.text || "text-gray-600")}
          />
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline" className={cn("text-[10px]", color?.badge)}>
            인터랙티브 데모
          </Badge>
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
