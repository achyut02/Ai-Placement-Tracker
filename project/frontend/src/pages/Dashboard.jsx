import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import ChartCard from '../components/ChartCard';
import { 
  TrendingUp, 
  Target, 
  Award, 
  MessageSquare, 
  Brain, 
  Calendar,
  ArrowRight,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    topicPerformance: [],
    progressData: [],
    recentInterviews: []
  });

  useEffect(() => {
    fetchInterviewData();
  }, [user]);

  const fetchInterviewData = async () => {
    try {
      const { data } = await api.get('/interviews/history?limit=100');
      const items = (data.data?.interviews || []).map((i) => ({
        ...i,
        timestamp: i.createdAt ? new Date(i.createdAt) : undefined,
      }));
      setInterviews(items);
      calculateStats(items);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (interviewsData) => {
    if (interviewsData.length === 0) {
      setStats({
        totalInterviews: 0,
        averageScore: 0,
        topicPerformance: [],
        progressData: [],
        recentInterviews: []
      });
      return;
    }

    // Calculate topic performance
    const topicScores = {};
    const topicCounts = {};
    
    interviewsData.forEach(interview => {
      if (!topicScores[interview.topic]) {
        topicScores[interview.topic] = 0;
        topicCounts[interview.topic] = 0;
      }
      topicScores[interview.topic] += interview.score;
      topicCounts[interview.topic]++;
    });

    const topicPerformance = Object.keys(topicScores).map(topic => ({
      name: topic,
      value: Math.round(topicScores[topic] / topicCounts[topic] * 10) / 10,
      count: topicCounts[topic]
    }));

    // Calculate progress over time (last 10 interviews)
    const recentInterviews = interviewsData.slice(0, 10).reverse();
    const progressData = recentInterviews.map((interview, index) => ({
      attempt: index + 1,
      score: interview.score,
      date: interview.timestamp?.toLocaleDateString()
    }));

    // Calculate overall stats
    const totalScore = interviewsData.reduce((sum, interview) => sum + interview.score, 0);
    const averageScore = Math.round((totalScore / interviewsData.length) * 10) / 10;

    setStats({
      totalInterviews: interviewsData.length,
      averageScore,
      topicPerformance,
      progressData,
      recentInterviews: interviewsData.slice(0, 5)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 animate-pulse mx-auto">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg font-medium text-gray-700">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.profile?.name || user.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-gray-600">Here's your interview preparation progress</p>
            </div>
            <button
              onClick={() => navigate('/topics')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Start New Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Total Interviews', 
              value: stats.totalInterviews, 
              icon: MessageSquare, 
              color: 'text-blue-600',
              bgColor: 'bg-blue-100'
            },
            { 
              title: 'Average Score', 
              value: `${stats.averageScore}/10`, 
              icon: Star, 
              color: 'text-yellow-600',
              bgColor: 'bg-yellow-100'
            },
            { 
              title: 'Topics Covered', 
              value: stats.topicPerformance.length, 
              icon: Target, 
              color: 'text-green-600',
              bgColor: 'bg-green-100'
            },
            { 
              title: 'Best Score', 
              value: interviews.length > 0 ? `${Math.max(...interviews.map(i => i.score))}/10` : '0/10', 
              icon: Award, 
              color: 'text-purple-600',
              bgColor: 'bg-purple-100'
            }
          ].map((stat, index) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {stats.totalInterviews === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your First Interview</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Begin your AI-powered interview preparation journey. 
              Choose a topic and get personalized feedback to improve your skills.
            </p>
            <button
              onClick={() => navigate('/topics')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2 mx-auto"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Choose Interview Topic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Charts and Analytics */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Topic Performance Pie Chart */}
            <ChartCard title="Performance by Topic">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.topicPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.topicPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Progress Over Time */}
            <ChartCard title="Progress Over Time">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="attempt" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip 
                      labelFormatter={(value) => `Attempt ${value}`}
                      formatter={(value) => [`${value}/10`, 'Score']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Recent Interviews */}
            <ChartCard title="Recent Interview Sessions" className="lg:col-span-2">
              <div className="space-y-4">
                {stats.recentInterviews.map((interview, index) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{interview.topic}</div>
                        <div className="text-sm text-gray-500">
                          {interview.timestamp?.toLocaleDateString()} at {interview.timestamp?.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        interview.score >= 8 
                          ? 'bg-green-100 text-green-800'
                          : interview.score >= 6
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {interview.score}/10
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                
                {stats.recentInterviews.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No recent interviews found
                  </div>
                )}
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
}