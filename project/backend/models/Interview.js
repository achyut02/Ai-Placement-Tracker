import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
    maxlength: [100, 'Topic cannot exceed 100 characters']
  },
  topicId: {
    type: String,
    required: [true, 'Topic ID is required'],
    trim: true
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [1000, 'Question cannot exceed 1000 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [5000, 'Answer cannot exceed 5000 characters']
  },
  feedback: {
    type: String,
    required: [true, 'Feedback is required'],
    trim: true,
    maxlength: [2000, 'Feedback cannot exceed 2000 characters']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be less than 0'],
    max: [10, 'Score cannot be greater than 10']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: true
  },
  sessionId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
interviewSchema.index({ userId: 1, createdAt: -1 });
interviewSchema.index({ topic: 1 });
interviewSchema.index({ score: -1 });
interviewSchema.index({ sessionId: 1 });

// Static method to get user statistics
interviewSchema.statics.getUserStats = async function(userId) {
  try {
    const stats = await this.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalInterviews: { $sum: 1 },
          averageScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' },
          topicStats: {
            $push: {
              topic: '$topic',
              score: '$score',
              createdAt: '$createdAt'
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        maxScore: 0,
        minScore: 0,
        topicPerformance: [],
        progressData: []
      };
    }

    const result = stats[0];
    
    // Calculate topic performance
    const topicPerformance = {};
    result.topicStats.forEach(stat => {
      if (!topicPerformance[stat.topic]) {
        topicPerformance[stat.topic] = { scores: [], count: 0 };
      }
      topicPerformance[stat.topic].scores.push(stat.score);
      topicPerformance[stat.topic].count++;
    });

    const topicPerformanceArray = Object.keys(topicPerformance).map(topic => ({
      name: topic,
      value: Math.round((topicPerformance[topic].scores.reduce((a, b) => a + b, 0) / topicPerformance[topic].count) * 10) / 10,
      count: topicPerformance[topic].count
    }));

    // Calculate progress over time (last 10 interviews)
    const recentInterviews = result.topicStats
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-10);

    const progressData = recentInterviews.map((interview, index) => ({
      attempt: index + 1,
      score: interview.score,
      date: new Date(interview.createdAt).toLocaleDateString()
    }));

    return {
      totalInterviews: result.totalInterviews,
      averageScore: Math.round(result.averageScore * 10) / 10,
      maxScore: result.maxScore,
      minScore: result.minScore,
      topicPerformance: topicPerformanceArray,
      progressData
    };
  } catch (error) {
    throw new Error('Failed to calculate user statistics');
  }
};

// Static method to get recent interviews
interviewSchema.statics.getRecentInterviews = function(userId, limit = 5) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('topic question score feedback createdAt');
};

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;