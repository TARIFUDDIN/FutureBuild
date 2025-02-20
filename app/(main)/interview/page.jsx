import { getAssessments } from '../../../actions/interview';
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

import React from 'react'

const InterviewPrepPage=async () => {
  const assessments = await getAssessments();
  return (
    <div>
       <div className="flex items-center justify-between mb-5">
       <h1 className="text-6xl font-bold gradient-title">
       Interview Preparation
       </h1>
       </div>
       <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  )
}

export default InterviewPrepPage;
