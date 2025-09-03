import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Send, Mic, MicOff, RotateCcw, CheckCircle, Clock, Brain } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Interview() {
  const { topicId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTopic = async () => {
    try {
      const { data } = await api.get('/interviews/topics');
      const found = (data.data || []).find(t => t.id === topicId);
      if (found) setTopic(found);
      else {
        toast.error('Topic not found');
        navigate('/topics');
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
      toast.error('Failed to load topic');
    }
  };

  const startInterview = async () => {
    setInterviewStarted(true);
    setLoading(true);

    try {
      const { data } = await api.post('/interviews/start', { topic: topic.title, topicId });
      if (data.success) {
        const welcomeMessage = {
          id: Date.now(),
          role: 'interviewer',
          content: `Welcome to your ${topic.title} interview! I'll be asking you questions to assess your knowledge. Let's begin.`,
          timestamp: new Date()
        };

        const questionMessage = {
          id: Date.now() + 1,
          role: 'interviewer',
          content: data.data.question,
          timestamp: new Date()
        };

        setMessages([welcomeMessage, questionMessage]);
        setQuestionCount(1);
      } else {
        toast.error('Failed to generate question');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: currentAnswer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentAnswer('');
    setLoading(true);

    try {
      const lastQuestion = messages.filter(m => m.role === 'interviewer').pop()?.content;
      
      const { data } = await api.post('/interviews/answer', {
        question: lastQuestion,
        answer: currentAnswer,
        topic: topic.title,
        topicId,
        sessionId: 'session'
      });

      if (data.success) {
        const feedbackMessage = {
          id: Date.now() + 1,
          role: 'interviewer',
          content: `${data.data.feedback}\n\nScore: ${data.data.score}/10`,
          score: data.data.score,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, feedbackMessage]);
        setTotalScore(prev => prev + data.data.score);

        // Generate next question if under 5 questions
        if (questionCount < 5) {
          setTimeout(async () => {
            const nextQuestion = await api.post('/interviews/question', { topic: topic.title });
            if (nextQuestion.data?.success) {
              const nextMessage = {
                id: Date.now() + 2,
                role: 'interviewer',
                content: nextQuestion.data.data.question,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, nextMessage]);
              setQuestionCount(prev => prev + 1);
            }
          }, 2000);
        } else {
          // Interview completed
          setTimeout(() => {
            const completionMessage = {
              id: Date.now() + 2,
              role: 'interviewer',
              content: `Interview completed! Your average score: ${(totalScore + (data.data.score || 0)) / 5}/10. Great job! You can review your performance in the dashboard.`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, completionMessage]);
            
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          }, 2000);
        }
      } else {
        toast.error('Failed to get feedback');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const endInterview = () => {
    navigate('/dashboard');
  };

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 animate-pulse mx-auto">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg font-medium text-gray-700">Loading interview...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Interview Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{topic.title} Interview</h1>
                <p className="text-gray-600">{topic.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {interviewStarted && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Question {questionCount}/5</span>
                </div>
              )}
              
              <button
                onClick={endInterview}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>

        {/* Interview Interface */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-[600px]">
          {!interviewStarted ? (
            /* Start Screen */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
                <p className="text-gray-600 mb-6">
                  You'll be asked 5 questions about {topic.title}. 
                  Take your time to provide thoughtful answers and get instant AI feedback.
                </p>
                <button
                  onClick={startInterview}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 font-medium"
                >
                  {loading ? 'Starting...' : 'Start Interview'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="text-sm font-medium mb-1">
                        {message.role === 'user' ? 'You' : 'AI Interviewer'}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.score && (
                        <div className="mt-2 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium">Score: {message.score}/10</span>
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          submitAnswer();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-3 rounded-lg transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={submitAnswer}
                      disabled={loading || !currentAnswer.trim()}
                      className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-500 text-center">
                  Press Enter to send • Shift+Enter for new line
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}