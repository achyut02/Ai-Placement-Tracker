const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate interview question based on topic
router.post('/question', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required'
      });
    }

    const prompt = `Generate a professional interview question for the topic: ${topic}. 
    The question should be:
    - Appropriate for a college placement interview
    - Clear and specific
    - Designed to assess practical knowledge
    - Not too basic, but not extremely advanced
    
    Just return the question without any additional text or formatting.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an experienced technical interviewer conducting placement interviews for college students. Generate clear, relevant questions that test practical knowledge."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const question = completion.choices[0].message.content.trim();

    res.json({
      success: true,
      question: question
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

// Evaluate answer and provide feedback
router.post('/feedback', async (req, res) => {
  try {
    const { question, answer, topic } = req.body;
    
    if (!question || !answer || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Question, answer, and topic are required'
      });
    }

    const prompt = `As an expert interviewer, evaluate this interview response:

Topic: ${topic}
Question: ${question}
Answer: ${answer}

Please provide:
1. A score from 0-10 (where 10 is excellent)
2. Constructive feedback focusing on:
   - Technical accuracy
   - Communication clarity
   - Completeness of answer
   - Areas for improvement

Format your response as:
Score: [0-10]
Feedback: [Your detailed feedback]

Keep feedback encouraging but honest, and provide specific suggestions for improvement.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an experienced technical interviewer providing constructive feedback to help candidates improve. Be fair, encouraging, and specific in your evaluation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content.trim();
    
    // Parse score and feedback
    const scoreMatch = response.match(/Score:\s*(\d+(?:\.\d+)?)/i);
    const feedbackMatch = response.match(/Feedback:\s*([\s\S]*)/i);
    
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 5;
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : response;

    res.json({
      success: true,
      score: Math.min(Math.max(score, 0), 10), // Ensure score is between 0-10
      feedback: feedback
    });

  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;