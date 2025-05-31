import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Plus, X, Trash2 } from "lucide-react";

export function QuestionEditor({ question, onUpdate, onDelete }) {
  // Ensure question has all required fields with default values
  // Ensure all values are properly converted to their correct types
  const safeQuestion = {
    id: question.id || question._id || Date.now(),
    type: String(question.type || "multiple-choice"),
    question: String(question.questionText || question.question || ""),
    options: Array.isArray(question.options)
      ? question.options.map(opt => typeof opt === 'object' ? JSON.stringify(opt) : String(opt))
      : [],
    correctAnswer: String(question.correctAnswer || ""),
    points: Number(question.points || 1),
    order: Number(question.order || 1),
    explanation: String(question.explanation || ""),
  };

  const questionTypes = [
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "true-false", label: "True/False" },
    { value: "essay", label: "Essay" },
    { value: "fill-blank", label: "Fill in the Blank" },
  ];

  const addOption = () => {
    const newOptions = [...safeQuestion.options, ""];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...safeQuestion.options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = safeQuestion.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Question {safeQuestion.order}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{safeQuestion.points} points</Badge>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select value={safeQuestion.type} onValueChange={(value) => onUpdate({ type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Points</Label>
            <Input
              type="number"
              value={safeQuestion.points}
              onChange={(e) => onUpdate({ points: Number.parseInt(e.target.value) || 1 })}
              min="1"
              max="10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Question</Label>
          <Textarea
            value={safeQuestion.question}
            onChange={(e) => onUpdate({ question: e.target.value })}
            placeholder="Enter question content..."
            rows={3}
          />
        </div>

        {/* Multiple Choice Options */}
        {safeQuestion.type === "multiple-choice" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <Button size="sm" variant="outline" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {safeQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <RadioGroup
                    value={safeQuestion.correctAnswer}
                    onValueChange={(value) => onUpdate({ correctAnswer: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={String(option)} id={`option-${index}`} />
                    </div>
                  </RadioGroup>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  <Button size="icon" variant="ghost" onClick={() => removeOption(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* True/False */}
        {safeQuestion.type === "true-false" && (
          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <RadioGroup
              value={safeQuestion.correctAnswer}
              onValueChange={(value) => onUpdate({ correctAnswer: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false">False</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Essay */}
        {safeQuestion.type === "essay" && (
          <div className="space-y-2">
            <Label>Sample Answer (optional)</Label>
            <Textarea
              value={safeQuestion.correctAnswer}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
              placeholder="Enter sample answer or grading rubric..."
              rows={3}
            />
          </div>
        )}

        {/* Fill in the blank */}
        {safeQuestion.type === "fill-blank" && (
          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <Input
              value={safeQuestion.correctAnswer}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
              placeholder="Enter correct answer..."
            />
            <p className="text-sm text-muted-foreground">
              Use underscores (_____) in the question to mark blank spaces
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Explanation (optional)</Label>
          <Textarea
            value={safeQuestion.explanation}
            onChange={(e) => onUpdate({ explanation: e.target.value })}
            placeholder="Explain the answer or provide additional information..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}