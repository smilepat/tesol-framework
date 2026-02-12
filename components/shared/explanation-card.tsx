import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, Target } from "lucide-react";

interface ExplanationCardProps {
  title: string;
  description: string;
  keyPoints?: string[];
  color?: {
    bgLight: string;
    border: string;
    text: string;
  };
}

export function ExplanationCard({
  title,
  description,
  keyPoints,
  color,
}: ExplanationCardProps) {
  return (
    <Card
      className={cn(
        "border-2",
        color ? `${color.bgLight} ${color.border}` : "bg-slate-50 border-slate-200"
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 p-2 rounded-lg",
              color ? color.bgLight : "bg-slate-100"
            )}
          >
            <Lightbulb
              className={cn("h-5 w-5", color ? color.text : "text-slate-600")}
            />
          </div>
          <div>
            <CardTitle
              className={cn("text-lg", color ? color.text : "text-slate-800")}
            >
              {title}
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-600 leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {keyPoints && keyPoints.length > 0 && (
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                학습 목표
              </span>
            </div>
            <ul className="space-y-2">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span
                    className={cn(
                      "mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                      color?.text ? color.text.replace("text-", "bg-") : "bg-slate-400"
                    )}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
