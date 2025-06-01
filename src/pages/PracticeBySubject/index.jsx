import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TestList from '../../components/tests-management/TestList';
import { getAllSubjects } from '../../apis/subjectApi';

const PracticeBySubject = () => {
  const { subject } = useParams();
  const [subjects, setSubjects] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await getAllSubjects();
        if (res.success && Array.isArray(res.data)) {
          // Map lại thành object như cũ, fallback description về label nếu không có
          const mapped = {};
          res.data.forEach(s => {
            mapped[s.value] = {
              title: s.label || s.value,
              description: s.description || s.label || 'Practice tests for this subject'
            };
          });
          setSubjects(mapped);
        }
      } catch (e) {
        setSubjects({});
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const subjectInfo = subjects[subject] || {
    title: subject,
    description: 'Practice tests for this subject'
  };

  return (
    <TestList 
      subject={subject}
      title={subjectInfo.title}
      description={subjectInfo.description}
    />
  );
};

export default PracticeBySubject;