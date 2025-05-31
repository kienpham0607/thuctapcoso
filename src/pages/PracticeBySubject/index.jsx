import React from 'react';
import { useParams } from 'react-router-dom';
import TestList from '../../components/tests-management/TestList';

const subjects = {
  'database': {
    title: 'Database',
    description: 'Test your knowledge of databases, SQL, and data management'
  },
  'computer-networks': {
    title: 'Computer Networks',
    description: 'Practice exercises on computer networks, protocols, and network security'
  },
  'web-security': {
    title: 'Web and Database Security',
    description: 'Practice web security and database protection'
  },
  'party-history': {
    title: 'Party History',
    description: 'Review the history of the Communist Party of Vietnam'
  },
  'general-law': {
    title: 'General Law',
    description: 'Learn about basic legal concepts and Vietnamese legal system'
  },
  'political-economy': {
    title: 'Marxist-Leninist Political Economy',
    description: 'Review basic concepts and principles of Marxist-Leninist political economy'
  }
};

const PracticeBySubject = () => {
  const { subject } = useParams();
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