import React, { useState } from 'react';
import './tests-management.css';
import PropTypes from 'prop-types';
import QuestionEditor from './QuestionEditor';

// Icons imports 
import { Plus, Save, X, HelpCircle } from 'lucide-react';

const TestForm = ({ test, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    test || {
      title: "",
      description: "",
      timeLimit: 30,
      passingScore: 70,
      status: "draft",
      questions: [],
      randomizeQuestions: false,
      showResults: true,
      allowRetake: true,
    }
  );

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
    onSave(formData);
  };

  const totalPoints = formData.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{test ? "Edit Practice Test" : "Create New Practice Test"}</h3>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Test
          </button>
        </div>
      </div>

      <div className="tab-container">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Test Information</div>
          </div>
          <div className="card-content space-y-4">
            <div className="grid gap-2">
              <label htmlFor="title">Test Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter test title..."
                className="form-input"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Test Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the test content and objectives..."
                rows={4}
                className="form-textarea"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="timeLimit">Time Limit (minutes)</label>
                <input
                  id="timeLimit"
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 30 })}
                  min="5"
                  max="180"
                  className="form-input"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="passingScore">Passing Score (%)</label>
                <input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 70 })}
                  min="0"
                  max="100"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium">Questions</h4>
              <p className="text-sm text-muted">Total points: {totalPoints} points</p>
            </div>
            <button className="btn btn-primary" onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </button>
          </div>

          <div className="questions-scroll-area">
            <div className="space-y-4">
              {formData.questions.map((question) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  onUpdate={(updates) => updateQuestion(question.id, updates)}
                  onDelete={() => deleteQuestion(question.id)}
                />
              ))}
              {formData.questions.length === 0 && (
                <div className="card empty-state">
                  <div className="p-8 text-center">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted" />
                    <h4 className="text-lg font-medium mb-2">No questions yet</h4>
                    <p className="text-muted mb-4">Start building your test by adding the first question</p>
                    <button className="btn btn-primary" onClick={addQuestion}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Question
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="card mt-6">
          <div className="card-header">
            <div className="card-title">Test Settings</div>
          </div>
          <div className="card-content space-y-4">
            <div className="grid gap-2">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-4">
              <label>Test Options</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="randomize"
                    checked={formData.randomizeQuestions}
                    onChange={(e) => setFormData({ ...formData, randomizeQuestions: e.target.checked })}
                    className="form-checkbox"
                  />
                  <label htmlFor="randomize">Randomize question order</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showResults"
                    checked={formData.showResults}
                    onChange={(e) => setFormData({ ...formData, showResults: e.target.checked })}
                    className="form-checkbox"
                  />
                  <label htmlFor="showResults">Show results immediately after completion</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowRetake"
                    checked={formData.allowRetake}
                    onChange={(e) => setFormData({ ...formData, allowRetake: e.target.checked })}
                    className="form-checkbox"
                  />
                  <label htmlFor="allowRetake">Allow test retakes</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TestForm.propTypes = {
  test: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default TestForm;