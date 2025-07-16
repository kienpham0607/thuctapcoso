import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Save, X, HelpCircle } from "lucide-react";
import { QuestionEditor } from "./QuestionEditor";
import { getAllSubjects } from '../../apis/subjectApi';

export default function TestForm({ test, onSave, onCancel }) {
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      const res = await getAllSubjects();
      if (res.success && Array.isArray(res.data)) {
        setSubjects(res.data);
      } else {
        setSubjects([]);
      }
      setSubjectsLoading(false);
    };
    fetchSubjects();
  }, []);

  const [formData, setFormData] = useState(
    test || {
      title: "",
      description: "",
      subject: "",
      timeLimit: 30,
      passingScore: 70,
      status: "draft",
      questions: [],
      randomizeQuestions: false,
      showResults: true,
      allowRetake: true,
    }
  );

  useEffect(() => {
    if (!formData.subject && subjects.length > 0) {
      setFormData((prev) => ({ ...prev, subject: subjects[0].value }));
    }
  }, [subjects]);

  useEffect(() => {
    if (test) {
      // First normalize the test data
      const normalizedTest = {
        ...test,
        title: String(test.title || ''),
        description: String(test.description || ''),
        subject: String(test.subject || subjects[0]?.value || ''),
        timeLimit: Number(test.timeLimit || 30),
        passingScore: Number(test.passingScore || 70),
        status: String(test.status || 'draft'),
        randomizeQuestions: Boolean(test.randomizeQuestions),
        showResults: Boolean(test.showResults),
        allowRetake: Boolean(test.allowRetake),
      };

      // Then normalize the questions array
      const normalizedQuestions = (test.questions || []).map((q, idx) => {
        // Extract and convert all question properties
        const questionText = String(q.questionText || q.question || '');
        const options = Array.isArray(q.options) ? q.options.map(opt => String(opt)) : [];
        const correctAnswer = typeof q.correctAnswer === 'number' ? q.correctAnswer : Number(q.correctAnswer);
        const explanation = String(q.explanation || '');
        const type = String(q.type || 'multiple-choice');
        const points = Number(q.points || 1);
        const order = Number(q.order || idx + 1);
        const id = q._id || Date.now() + idx;

        return {
          id,
          type,
          question: questionText,
          options,
          correctAnswer,
          points,
          order,
          explanation
        };
      });

      // Set the fully normalized form data
      setFormData({
        ...normalizedTest,
        questions: normalizedQuestions
      });
    }
  }, [test]);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: "multiple-choice",
      question: "",
      options: ["", ""],
      correctAnswer: "",
      points: 1,
      order: formData.questions.length + 1,
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const updateQuestion = (questionId, updates) => {
    setFormData({
      ...formData,
      questions: formData.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
    });
  };

  const deleteQuestion = (questionId) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((q) => q.id !== questionId),
    });
  };

  const handleSave = () => {
    // Deep copy and normalize all form data
    const normalizedFormData = {
      title: String(formData.title || ''),
      description: String(formData.description || ''),
      subject: String(formData.subject || subjects[0]?.value || ''),
      timeLimit: Number(formData.timeLimit || 30),
      passingScore: Number(formData.passingScore || 70),
      status: String(formData.status || 'draft'),
      randomizeQuestions: Boolean(formData.randomizeQuestions),
      showResults: Boolean(formData.showResults),
      allowRetake: Boolean(formData.allowRetake)
    };

    // Normalize questions array
    const normalizedQuestions = formData.questions.map(q => {
      // Create a clean question object with only the required fields
      const normalizedQuestion = {
        questionText: String(q.question || q.questionText || ''),
        options: Array.isArray(q.options) ? q.options.map(opt => String(opt)) : [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : Number(q.correctAnswer),
        explanation: String(q.explanation || ''),
        type: String(q.type || 'multiple-choice'),
        points: Number(q.points || 1),
        order: Number(q.order || 1)
      };

      // If question has an ID, include it
      if (q._id) {
        normalizedQuestion._id = q._id;
      }

      return normalizedQuestion;
    });

    // Combine everything into the final payload
    const payload = {
      ...normalizedFormData,
      questions: normalizedQuestions
    };

    console.log('Form data before save:', formData);
    console.log('Normalized form data:', normalizedFormData);
    console.log('Normalized questions:', normalizedQuestions);
    console.log('Final payload:', payload);
    
    onSave(payload);
  };

  const totalPoints = formData.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{test ? "Edit Practice Test" : "Create New Practice Test"}</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Test
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="questions">Questions ({formData.questions.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                {subjectsLoading ? (
                  <div>Loading subjects...</div>
                ) : (
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter test title..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Test Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the test content and objectives..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: Number.parseInt(e.target.value) || 30 })}
                    min="5"
                    max="180"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: Number.parseInt(e.target.value) || 70 })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium">Questions</h4>
              <p className="text-sm text-muted-foreground">Total points: {totalPoints} points</p>
            </div>
            <Button onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {(formData.questions || []).map((question, idx) => {
                // Extract properties safely
                const questionText = String(question.questionText || question.question || "");
                const options = Array.isArray(question.options) ? question.options.map(opt => String(opt)) : [];
                const correctAnswer = typeof question.correctAnswer === 'number' ? question.correctAnswer : Number(question.correctAnswer);
                const explanation = String(question.explanation || "");
                const type = String(question.type || "multiple-choice");
                const points = Number(question.points || 1);
                const order = Number(question.order || idx + 1);
                const id = question.id || question._id || Date.now() + idx;

                // Create formatted question
                const formattedQuestion = {
                  id,
                  type,
                  question: questionText,
                  options,
                  correctAnswer,
                  points,
                  order,
                  explanation
                };
                
                return (
                  <QuestionEditor
                    key={formattedQuestion.id}
                    question={formattedQuestion}
                    onUpdate={(updates) => updateQuestion(formattedQuestion.id, updates)}
                    onDelete={() => deleteQuestion(formattedQuestion.id)}
                  />
                );
              })}
              {formData.questions.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-medium mb-2">No questions yet</h4>
                    <p className="text-muted-foreground mb-4">Start building your test by adding the first question</p>
                    <Button onClick={addQuestion}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Question
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Test Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="randomize"
                      checked={formData.randomizeQuestions}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, randomizeQuestions: checked })
                      }
                    />
                    <Label htmlFor="randomize">Randomize question order</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showResults"
                      checked={formData.showResults}
                      onCheckedChange={(checked) => setFormData({ ...formData, showResults: checked })}
                    />
                    <Label htmlFor="showResults">Show results immediately after completion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowRetake"
                      checked={formData.allowRetake}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowRetake: checked })}
                    />
                    <Label htmlFor="allowRetake">Allow test retakes</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}