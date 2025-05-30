import React from 'react';
import './tests-management.css';
import PropTypes from 'prop-types';
import { X, Trash2, Plus } from 'lucide-react';

const QuestionEditor = ({ question, onUpdate, onDelete }) => {
  const questionTypes = [
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "true-false", label: "True/False" },
    { value: "essay", label: "Essay" },
    { value: "fill-blank", label: "Fill in the Blank" },
  ];

  const addOption = () => {
    const newOptions = [...(question.options || []), ""];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = question.options?.filter((_, i) => i !== index) || [];
    onUpdate({ options: newOptions });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h4 className="text-lg">Question {question.order}</h4>
          <div className="flex items-center gap-2">
            <span className="badge">{question.points} points</span>
            <button className="btn btn-ghost btn-icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="card-content space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Question Type</label>
            <select
              value={question.type}
              onChange={(e) => onUpdate({ type: e.target.value })}
              className="form-select"
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label>Points</label>
            <input
              type="number"
              value={question.points}
              onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 1 })}
              min="1"
              max="10"
              className="form-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label>Question</label>
          <textarea
            value={question.question}
            onChange={(e) => onUpdate({ question: e.target.value })}
            placeholder="Enter question content..."
            rows={3}
            className="form-textarea"
          />
        </div>

        {/* Multiple Choice Options */}
        {question.type === "multiple-choice" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label>Answer Options</label>
              <button className="btn btn-outline btn-sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </button>
            </div>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={question.correctAnswer === option}
                    onChange={() => onUpdate({ correctAnswer: option })}
                    name={`question-${question.id}-options`}
                    className="form-radio"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="form-input flex-1"
                  />
                  <button className="btn btn-ghost btn-icon" onClick={() => removeOption(index)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* True/False */}
        {question.type === "true-false" && (
          <div className="space-y-2">
            <label>Correct Answer</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`true-${question.id}`}
                  value="true"
                  checked={question.correctAnswer === "true"}
                  onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                  name={`question-${question.id}-tf`}
                  className="form-radio"
                />
                <label htmlFor={`true-${question.id}`}>True</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`false-${question.id}`}
                  value="false"
                  checked={question.correctAnswer === "false"}
                  onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                  name={`question-${question.id}-tf`}
                  className="form-radio"
                />
                <label htmlFor={`false-${question.id}`}>False</label>
              </div>
            </div>
          </div>
        )}

        {/* Essay */}
        {question.type === "essay" && (
          <div className="space-y-2">
            <label>Sample Answer (optional)</label>
            <textarea
              value={question.correctAnswer || ""}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
              placeholder="Enter sample answer or grading rubric..."
              rows={3}
              className="form-textarea"
            />
          </div>
        )}

        {/* Fill in the blank */}
        {question.type === "fill-blank" && (
          <div className="space-y-2">
            <label>Correct Answer</label>
            <input
              type="text"
              value={question.correctAnswer || ""}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
              placeholder="Enter correct answer..."
              className="form-input"
            />
            <p className="text-sm text-muted">
              Use underscores (_____) in the question to mark blank spaces
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label>Explanation (optional)</label>
          <textarea
            value={question.explanation || ""}
            onChange={(e) => onUpdate({ explanation: e.target.value })}
            placeholder="Explain the answer or provide additional information..."
            rows={2}
            className="form-textarea"
          />
        </div>
      </div>
    </div>
  );
};

QuestionEditor.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['multiple-choice', 'true-false', 'essay', 'fill-blank']).isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    explanation: PropTypes.string,
    points: PropTypes.number.isRequired,
    order: PropTypes.number.isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default QuestionEditor;