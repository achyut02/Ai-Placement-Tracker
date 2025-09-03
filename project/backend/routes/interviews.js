import express from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import Interview from '../models/Interview.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { generateQuestion, generateFeedback } from '../utils/ai.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Get available topics
router.get('/topics', async (req, res) => {
  try {
    // Static topics data (you can move this to database later)
    const topics = [
      {
        id: 'java',
        title: 'Java Programming',
        description: 'Core Java concepts, OOP principles, and advanced topics',
        color: 'bg-gradient-to-br from-orange-500 to-red-600',
        questionCount: 15,
        difficulty: 'Intermediate'
      },
      {
        id: 'hr',
        title: 'HR & Behavioral',
        description: 'Behavioral questions, situational scenarios, and soft skills',
        color: 'bg-gradient-to-br from-green-500 to-emerald-600',
        questionCount: 20,
        difficulty: 'Mixed'
      },
      {
        id: 'dsa',
        title: 'Data Structures & Algorithms',
        description: 'Arrays, trees, graphs, sorting, searching, and complexity analysis',
        color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        questionCount: 25,
        difficulty: 'Advanced'
      },
      {
        id: 'communication',
        title: 'Communication Skills',
        description: 'Presentation skills, public speaking, and professional communication',
        color: 'bg-gradient-to-br from-purple-500 to-pink-600',
        questionCount: 12,
        difficulty: 'Beginner'
      },
      {
        id: 'database',
        title: 'Database Management',
        description: 'SQL queries, database design, normalization, and DBMS concepts',
        color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        questionCount: 18,
        difficulty: 'Intermediate'
      },
      {
        id: 'system-design',
        title: 'System Design',
        description: 'Scalability, architecture patterns, and distributed systems',
        color: 'bg-gradient-to-br from-teal-500 to-blue-600',
        questionCount: 10,
        difficulty: 'Advanced'
      }
    ];

    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics'
    });
  }
});

// Start new interview session
router.post('/start', [
  body('topic')
    .notEmpty()
    .trim()
    .withMessage('Topic is required'),
  body('topicId')
    .notEmpty()
    .trim()
    .withMessage('Topic ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { topic, topicId } = req.body;
    const userId = req.user._id;

    // Generate first question using AI
    const question = await generateQuestion(topic);

    // Create session ID for this interview
    const sessionId = uuidv4();

    res.json({
      success: true,
      data: {
        question,
        sessionId,
        topic,
        topicId
      }
    });

  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start interview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Generate new question
router.post('/question', [
  body('topic')
    .notEmpty()
    .trim()
    .withMessage('Topic is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { topic } = req.body;

    const question = await generateQuestion(topic);

    res.json({
      success: true,
      data: { question }
    });

  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Submit answer and get feedback
router.post('/answer', [
  body('question')
    .notEmpty()
    .trim()
    .withMessage('Question is required'),
  body('answer')
    .notEmpty()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Answer must be between 10 and 5000 characters'),
  body('topic')
    .notEmpty()
    .trim()
    .withMessage('Topic is required'),
  body('topicId')
    .notEmpty()
    .trim()
    .withMessage('Topic ID is required'),
  body('sessionId')
    .notEmpty()
    .trim()
    .withMessage('Session ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { question, answer, topic, topicId, sessionId } = req.body;
    const userId = req.user._id;

    // Get AI feedback and score
    const { feedback, score } = await generateFeedback(question, answer, topic);

    // Save interview attempt to database
    const interview = new Interview({
      userId,
      topic,
      topicId,
      question,
      answer,
      feedback,
      score,
      sessionId
    });

    await interview.save();

    // Update user's average score
    await req.user.updateAverageScore();

    res.json({
      success: true,
      data: {
        feedback,
        score,
        interviewId: interview._id
      }
    });

  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process answer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's interview progress and statistics
router.get('/progress', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get comprehensive statistics
    const stats = await Interview.getUserStats(userId);
    const recentInterviews = await Interview.getRecentInterviews(userId, 5);

    res.json({
      success: true,
      data: {
        ...stats,
        recentInterviews
      }
    });

  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get interview history with pagination
router.get('/history', async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const topic = req.query.topic;

    const query = { userId };
    if (topic) {
      query.topicId = topic;
    }

    const interviews = await Interview.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('topic question answer score feedback createdAt');

    const total = await Interview.countDocuments(query);

    res.json({
      success: true,
      data: {
        interviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching interview history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get specific interview details
router.get('/:interviewId', async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;

    const interview = await Interview.findOne({
      _id: interviewId,
      userId
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.json({
      success: true,
      data: interview
    });

  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete interview
router.delete('/:interviewId', async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;

    const interview = await Interview.findOneAndDelete({
      _id: interviewId,
      userId
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Update user's average score after deletion
    await req.user.updateAverageScore();

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;