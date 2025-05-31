"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { Badge } from "../ui/badge"
import { Spinner } from "../ui/spinner"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { useParams, useNavigate } from 'react-router-dom';
import { getPracticeTestById } from '../../apis/practiceTestApi';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Target,
  Timer,
  Award,
} from "lucide-react"

function TestResults({ testData, answers, timeSpent, onRetake, onExit }) {
  const calculateScore = () => {
    let correct = 0;
    testData.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / testData.questions.length) * 100);
  };

  const score = calculateScore();
  const passed = score >= 70;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            passed ? "bg-green-100" : "bg-red-100"
          }`}>
            {passed ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <AlertTriangle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl mb-2">
            {passed ? "Congratulations!" : "Test Completed"}
          </CardTitle>
          <p className="text-muted-foreground">
            {passed ? "You have passed the test!" : "Keep practicing to improve your score."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-blue-50 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-blue-700">Final Score</div>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(answers).length}
              </div>
              <div className="text-sm text-green-700">Questions Answered</div>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">
                {testData.questions.length}
              </div>
              <div className="text-sm text-purple-700">Total Questions</div>
            </div>
            
            <div className="p-4 rounded-lg bg-orange-50 text-center">
              <Timer className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{timeSpent}m</div>
              <div className="text-sm text-orange-700">Time Taken</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onExit}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tests
            </Button>
            <Button onClick={onRetake}>
              Retake Test
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Your Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {testData.questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="mb-2">{question.questionText}</p>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              optIndex === question.correctAnswer
                                ? "bg-green-100"
                                : optIndex === answers[question.id]
                                ? "bg-red-100"
                                : "bg-gray-50"
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function TestTakingInterface({ testData, onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(testData.timeLimit * 60);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitTest();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const toggleFlag = (questionId) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const timeSpent = Math.ceil((testData.timeLimit * 60 - timeLeft) / 60);
    return (
      <TestResults
        testData={testData}
        answers={answers}
        timeSpent={timeSpent}
        onRetake={() => window.location.reload()}
        onExit={onExit}
      />
    );
  }

  const question = testData.questions[currentQuestion];
  const progress = (Object.keys(answers).length / testData.questions.length) * 100;

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Question Navigation */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="grid grid-cols-4 gap-2">
              {testData.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  className={`relative ${
                    answers[testData.questions[index].id] !== undefined
                      ? "bg-green-100 hover:bg-green-200"
                      : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                  {flaggedQuestions.has(testData.questions[index].id) && (
                    <Flag className="absolute -top-2 -right-2 h-4 w-4 text-orange-500" />
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Question Content */}
      <div className="md:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Badge>Question {currentQuestion + 1}</Badge>
                  <Badge variant="outline">
                    {progress.toFixed(0)}% Complete
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4" />
                  <span className={timeLeft < 300 ? "text-red-600 font-bold" : ""}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFlag(question.id)}
              >
                <Flag className={`h-4 w-4 mr-2 ${
                  flaggedQuestions.has(question.id) ? "fill-current text-orange-500" : ""
                }`} />
                {flaggedQuestions.has(question.id) ? "Unflag" : "Flag"}
              </Button>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">
              {question.questionText}
            </div>

            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(question.id, Number(value))}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50"
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentQuestion === testData.questions.length - 1 ? (
            <Button onClick={handleSubmitTest}>
              Submit Test
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion((prev) => Math.min(testData.questions.length - 1, prev + 1))}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestQuestions() {
  const { subject, testId } = useParams();
  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockTestData = {
    id: 1,
    title: "Database Fundamentals Quiz",
    description: "Test your knowledge of database concepts, SQL, and data management",
    timeLimit: 45,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        questionText: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "Standard Query Language",
          "System Query Language",
        ],
        correctAnswer: 0,
        explanation: "SQL stands for Structured Query Language, which is used to manage and manipulate relational databases.",
      }
    ]
  };

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPracticeTestById(testId);
        if (!response.success) throw new Error(response.message || 'Failed to fetch test');
        setTestData(response.data);
      } catch (err) {
        setError(err.message);
        setTestData(mockTestData);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <Spinner className="h-8 w-8 text-primary" />
      <p className="text-muted-foreground">Loading test...</p>
    </div>
  );
  if (error) return (
    <div className="text-red-500 p-8">{error}</div>
  );
  if (!testData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{testData.title}</CardTitle>
            <p className="text-muted-foreground">{testData.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate(`/practice/${subject}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
              <Badge variant="outline">
                {testData.questions.length} Questions
              </Badge>
            </div>
          </CardContent>
        </Card>

        <TestTakingInterface 
          testData={testData} 
          onExit={() => navigate(`/practice/${subject}`)}
        />
      </div>
    </div>
  );
}