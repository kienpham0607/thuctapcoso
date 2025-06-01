import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Calendar, Users, Clock, FileText, Star } from "lucide-react";

export default function ResultSummaryCard({
  title,
  difficulty,
  completed,
  score,
  maxScore = 100,
  timeLimit,
  questionCount,
  attempts,
  maxAttempts,
  dueDate,
  topics = [],
  onViewResult,
  onViewDetail
}) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">
            {title} {difficulty && (
              <Badge variant="destructive" className="ml-2 align-middle">{difficulty}</Badge>
            )}
            {completed && (
              <Badge variant="success" className="ml-2 align-middle">Hoàn thành</Badge>
            )}
          </CardTitle>
          <div className="text-gray-600 mt-1">Thực hành về tính đa hình và các design patterns cơ bản</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-bold text-blue-600">{score}/{maxScore}</span>
          <span className="text-sm text-gray-500 flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" />Điểm số</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-6 text-gray-700 mb-2">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{timeLimit} phút</div>
          <div className="flex items-center gap-2"><FileText className="w-4 h-4" />{questionCount} câu hỏi</div>
          <div className="flex items-center gap-2"><Users className="w-4 h-4" />{attempts}/{maxAttempts} lần thử</div>
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />Hạn: {dueDate}</div>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {topics.map((topic, idx) => (
            <Badge key={idx} variant="outline">{topic}</Badge>
          ))}
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Tiến độ hoàn thành</span>
            <span>100%</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={onViewResult}>
            <span role="img" aria-label="result">📖</span> Xem kết quả
          </Button>
          <Button variant="ghost" onClick={onViewDetail}>Chi tiết</Button>
        </div>
      </CardContent>
    </Card>
  );
} 