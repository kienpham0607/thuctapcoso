import React from 'react';
import TestForm from '../../components/tests-management/TestForm';

const CreatePracticeTestPage = () => {
  const handleSaveTest = (test) => {
    // TODO: Implement save test functionality by calling your API
    console.log('Saving test:', test);
  };

  const handleCancel = () => {
    // TODO: Implement navigation back to tests list
    console.log('Cancelled test creation');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <TestForm 
        onSave={handleSaveTest}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreatePracticeTestPage;