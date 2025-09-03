import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Code, Users, Database, MessageSquare, Brain, Target, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const topicIcons = {
  'java': Code,
  'hr': Users,
  'dsa': Brain,
  'communication': MessageSquare,
  'database': Database,
  'system-design': Target
};

export default function TopicSelection() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data } = await api.get('/interviews/topics');
      setTopics(data.data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic.id);
    try {
      toast.success(`Starting ${topic.title} interview!`);
      navigate(`/interview/${topic.id}`);
    } catch (error) {
      console.error('Error selecting topic:', error);
      toast.error('Failed to start interview');
      setSelectedTopic(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 animate-pulse mx-auto">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg font-medium text-gray-700">Loading topics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-gradient">Interview Topic</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a topic to start your AI-powered interview simulation. 
            Get personalized questions and instant feedback to improve your skills.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic, index) => {
            const IconComponent = topicIcons[topic.id] || Brain;
            const isSelected = selectedTopic === topic.id;
            
            return (
              <div
                key={topic.id}
                className={`group relative bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleTopicSelect(topic)}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Topic Icon */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${
                  topic.color || 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {topic.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{topic.questionCount || 10}+ Questions</span>
                  <span>{topic.difficulty || 'Mixed'} Level</span>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">AI Ready</span>
                  </div>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm font-medium mr-1">Start Interview</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Loading Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <div className="bg-white rounded-lg px-4 py-2 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium text-blue-600">Starting...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {topics.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Topics Available</h3>
            <p className="text-gray-600">No topics available from the API yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}