import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function TestList({ subject, title, description }) {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        const res = await getAllPracticeTests();
        if (res.success && Array.isArray(res.data)) {
          // Filter by subject and status, and map fields for UI
          const filtered = res.data.filter(
            (t) => t.status === 'active' && t.subject === subject
          ).map((t) => ({
            id: t._id,
            title: t.title,
            description: t.description,
            duration: t.duration || 60,
            questions: t.questions?.length || t.questionsCount || 0,
            difficulty: t.difficulty || 'Medium',
            completed: t.completed || false, // You may need to adjust this based on user data
            score: t.score || null, // You may need to adjust this based on user data
            attempts: t.attempts || 0, // You may need to adjust this based on user data
            maxAttempts: t.maxAttempts || 3,
            dueDate: t.dueDate || new Date().toISOString(),
            topics: t.topics || [],
          }));
          setTests(filtered);
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
  }, [subject]);

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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total tests</p>
                    <p className="text-2xl font-bold">{tests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">
                      {tests.filter((t) => t.completed).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Average score</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        tests.filter((t) => t.score).reduce((acc, t) => acc + t.score, 0) /
                          tests.filter((t) => t.score).length
                      ) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Due soon</p>
                    <p className="text-2xl font-bold">
                      {tests.filter(
                        (t) =>
                          !t.completed &&
                          new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      ).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid gap-6">
          {tests.map((test) => (
            <Card key={test.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{test.title}</CardTitle>
                      <Badge className={getDifficultyColor(test.difficulty)}>
                        {test.difficulty}
                      </Badge>
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
                      {test.attempts}/{test.maxAttempts} attempts
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(test.dueDate).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {test.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
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

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/practice/${subject}/test/${test.id}/detail`)}
                    >
                      Details
                    </Button>
                  </div>

                  {new Date(test.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
                    !test.completed && (
                      <Badge variant="destructive" className="animate-pulse">
                        Due soon
                      </Badge>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestList;