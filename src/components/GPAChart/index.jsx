import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GPAChart({ semesters, calculateOverallGPA }) {
  if (semesters.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
        color: '#666'
      }}>
        Add your first semester to see GPA chart
      </div>
    );
  }

  // Only include semesters with courses
  const validSemesters = semesters.filter(semester => semester.courses.length > 0);
  const data = validSemesters.map(semester => ({
    name: semester.title,
    'Term GPA': Number(semester.gpa.toFixed(2)),
    'Cumulative GPA': Number(calculateOverallGPA())
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px', 
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 500, color: '#333' }}>{label}</p>
          <p style={{ fontSize: '14px', color: '#16977D' }}>
            Term GPA: {Number(payload[0].value).toFixed(2)}
          </p>
          <p style={{ fontSize: '14px', color: '#fd79a8' }}>
            Cumulative GPA: {Number(payload[1].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: '24px',
        color: '#333'
      }}>
        GPA Performance Overview
      </h2>
      <div style={{ width: '100%', height: '380px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="gradientTerm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16977D" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#16977D" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradientCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fd79a8" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#fd79a8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#ddd' }}
            />
            <YAxis 
              domain={[0, 4.0]}
              ticks={[0, 1.0, 2.0, 3.0, 4.0]}
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#ddd' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line
              name="Term GPA"
              type="natural"
              dataKey="Term GPA"
              stroke="#16977D"
              strokeWidth={3}
              dot={{ r: 4, fill: "#16977D", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#16977D", strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#gradientTerm)"
            />
            <Line
              name="Cumulative GPA"
              type="natural"
              dataKey="Cumulative GPA"
              stroke="#fd79a8"
              strokeWidth={3}
              dot={{ r: 4, fill: "#fd79a8", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#fd79a8", strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#gradientCumulative)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}