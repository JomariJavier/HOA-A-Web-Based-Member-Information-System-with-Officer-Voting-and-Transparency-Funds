import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function BudgetDashboard() {
    // Mock Data for the Budget Line Graph
    const data = [
        { month: 'Jan', budget: 150000, spent: 120000 },
        { month: 'Feb', budget: 150000, spent: 135000 },
        { month: 'Mar', budget: 150000, spent: 140000 },
        { month: 'Apr', budget: 150000, spent: 110000 },
        { month: 'May', budget: 150000, spent: 160000 }, // Slight overspend mocked
        { month: 'Jun', budget: 150000, spent: 100000 },
    ];

    return (
        <div className="budget-dashboard">
            <h2 className="m3-display-small" style={{ marginBottom: '8px' }}>Budget Summary</h2>
            <p className="m3-body-medium m3-on-surface-variant" style={{ marginBottom: '24px' }}>
                Overview of HOA financial health and ongoing project expenses.
            </p>

            <div className="audit-stat-grid">
                <div className="audit-stat-card">
                    <span className="stat-title">Total Yearly Budget</span>
                    <span className="stat-value">₱1,800,000</span>
                </div>
                <div className="audit-stat-card">
                    <span className="stat-title">Monthly Allocation</span>
                    <span className="stat-value">₱150,000</span>
                </div>
                <div className="audit-stat-card">
                    <span className="stat-title">Active Projects</span>
                    <span className="stat-value">3</span>
                </div>
                <div className="audit-stat-card">
                    <span className="stat-title">Current Project Budget</span>
                    <span className="stat-value" style={{ color: 'var(--m3-primary)' }}>₱450,000</span>
                </div>
            </div>

            <div className="chart-container-card">
                <h3 className="m3-title-large" style={{ marginBottom: '24px', color: 'var(--m3-on-surface)' }}>
                    Monthly Budget vs. Spent Tracker (2026)
                </h3>
                
                {/* 
                    ResponsiveContainer ensures the chart resizes automatically.
                    We use a fixed height for accessibility/older demographics to see easily.
                */}
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E1E5" />
                            <XAxis 
                                dataKey="month" 
                                stroke="#46464F" 
                                tick={{ fill: '#46464F', fontSize: 14 }} 
                                tickMargin={10} 
                            />
                            <YAxis 
                                stroke="#46464F" 
                                tick={{ fill: '#46464F', fontSize: 14 }}
                                tickFormatter={(value) => `₱${value.toLocaleString()}`}
                                width={80}
                            />
                            <Tooltip 
                                formatter={(value) => `₱${value.toLocaleString()}`}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line 
                                type="monotone" 
                                dataKey="budget" 
                                name="Allocated Budget"
                                stroke="#777680" 
                                strokeWidth={3} 
                                dot={{ r: 4 }} 
                                activeDot={{ r: 6 }} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="spent" 
                                name="Actual Spent"
                                stroke="#3F51B5" 
                                strokeWidth={3} 
                                dot={{ r: 4, fill: '#3F51B5' }} 
                                activeDot={{ r: 8 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
