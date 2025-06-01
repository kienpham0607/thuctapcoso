import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import {
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Play,
  Star,
  TrendingUp,
  Users,
  Award,
  Calendar,
} from "lucide-react";
import { getAllPracticeTests } from '../../apis/practiceTestApi';
import ResultSummaryCard from "../TestQuestions/ResultSummaryCard";

function TestList({ subject, title, description }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

  // Listen for navigation/focus events
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1); // Increment refresh key when window gains focus
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        const res = await getAllPracticeTests({ subject, status: 'active' });
        if (res.success && Array.isArray(res.data)) {
          console.log('API response:', res.data);
          const mapped = res.data.map((t) => ({
            id: t._id,
            title: t.title,
            description: t.description,
            duration: t.timeLimit || 60,
            questions: t.questions?.length || t.questionsCount || 0,
            difficulty: t.difficulty || 'Medium',
            completed: !!t.completed,
            score: typeof t.score === 'number' ? t.score : null,
            attempts: typeof t.attempts === 'number' ? t.attempts : 0,
            maxAttempts: t.maxAttempts || 3,
            dueDate: t.dueDate || new Date().toISOString(),
            topics: t.topics || [],
            createdAt: t.createdAt,
          }));
          console.log('Mapped tests:', mapped);
          setTests(mapped);
        } else {
          setTests([]);
        }
      } catch (e) {
        setTests([]);
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, [subject, refreshKey, location.pathname]); // Add refreshKey and location.pathname to dependencies

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Tính số bài đã hoàn thành và điểm trung bình
  const completedCount = tests.filter((t) => t.completed).length;
  const scoredTests = tests.filter((t) => typeof t.score === 'number');
  const averageScore = scoredTests.length > 0 ? Math.round(scoredTests.reduce((acc, t) => acc + t.score, 0) / scoredTests.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid gap-6">
          {tests.map((test) => (
            test.completed ? (
              <ResultSummaryCard
                key={test.id}
                title={test.title}
                difficulty={test.difficulty}
                completed={test.completed}
                score={test.score}
                maxScore={100}
                timeLimit={test.duration}
                questionCount={test.questions}
                attempts={test.attempts}
                maxAttempts={test.maxAttempts}
                dueDate={test.dueDate ? new Date(test.dueDate).toLocaleDateString("en-GB") : ""}
                topics={test.topics || []}
                onViewResult={() => navigate(`/practice/${subject}/test/${test.id}/review`)}
                onViewDetail={() => navigate(`/practice/${subject}/test/${test.id}/review`)}
              />
            ) : (
              <Card key={test.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{test.title}</CardTitle>
                        {test.completed && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <Award className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">{test.description}</CardDescription>
                    </div>

                    {test.completed && test.score && (
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                          {test.score}/100
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          Score
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Test Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{test.duration} min</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{test.questions} questions</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {test.attempts ?? 0} attempts
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {test.createdAt ? new Date(test.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</span>
                    </div>
                  </div>

                  {/* Progress for completed tests */}
                  {test.completed && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion progress</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {!test.completed && test.attempts < test.maxAttempts && (
                        <Button
                          className="flex items-center gap-2"
                          onClick={() => navigate(`/practice/${subject}/test/${test.id}`)}
                        >
                          <Play className="w-4 h-4" />
                          {test.attempts === 0 ? "Start test" : "Retake"}
                        </Button>
                      )}

                      {test.completed && (
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => navigate(`/practice/${subject}/test/${test.id}/review`)}
                        >
                          <BookOpen className="w-4 h-4" />
                          View result
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestList;