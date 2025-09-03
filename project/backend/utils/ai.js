import OpenAI from 'openai';

// Initialize OpenAI client only if API key exists to avoid constructor crash
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (e) {
    console.warn('⚠️ OpenAI client init warning:', e.message);
  }
}

// Generate interview question based on topic
export const generateQuestion = async (topic) => {
  try {
    const prompt = `Generate a professional interview question for the topic: ${topic}. 
    
    The question should be:
    - Appropriate for a college placement interview
    - Clear and specific
    - Designed to assess practical knowledge and understanding
    - Not too basic, but not extremely advanced
    - Focused on real-world application
    
    Topic areas to consider for ${topic}:
    ${getTopicGuidelines(topic)}
    
    Return only the question without any additional text, formatting, or explanations.`;

    if (!openai) throw new Error('OpenAI not configured');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an experienced technical interviewer conducting placement interviews for college students. Generate clear, relevant questions that test practical knowledge and problem-solving skills. Focus on questions that allow candidates to demonstrate their understanding and thinking process."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const question = completion.choices[0].message.content.trim();
    
    if (!question) {
      throw new Error('Empty question generated');
    }

    return question;

  } catch (error) {
    console.error('OpenAI question generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    }
    
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    
    throw new Error('Failed to generate question. Please try again.');
  }
};

// Generate feedback and score for an answer
export const generateFeedback = async (question, answer, topic) => {
  try {
    const prompt = `As an expert interviewer, evaluate this interview response:

Topic: ${topic}
Question: ${question}
Answer: ${answer}

Please provide:
1. A score from 0-10 (where 10 is excellent)
2. Constructive feedback focusing on:
   - Technical accuracy and depth
   - Communication clarity and structure
   - Completeness of the answer
   - Practical understanding
   - Areas for improvement
   - Specific suggestions for enhancement

Evaluation criteria:
- 9-10: Excellent answer with deep understanding and clear communication
- 7-8: Good answer with solid understanding, minor improvements needed
- 5-6: Average answer with basic understanding, needs development
- 3-4: Below average, significant gaps in knowledge or communication
- 0-2: Poor answer with major issues

Format your response exactly as:
Score: [0-10]
Feedback: [Your detailed, constructive feedback]

Keep feedback encouraging but honest, and provide specific, actionable suggestions for improvement.`;

    if (!openai) throw new Error('OpenAI not configured');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an experienced technical interviewer providing constructive feedback to help candidates improve. Be fair, encouraging, and specific in your evaluation. Focus on both technical accuracy and communication skills. Provide actionable advice for improvement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
      presence_penalty: 0.1
    });

    const response = completion.choices[0].message.content.trim();
    
    // Parse score and feedback
    const scoreMatch = response.match(/Score:\s*(\d+(?:\.\d+)?)/i);
    const feedbackMatch = response.match(/Feedback:\s*([\s\S]*)/i);
    
    let score = scoreMatch ? parseFloat(scoreMatch[1]) : 5;
    let feedback = feedbackMatch ? feedbackMatch[1].trim() : response;

    // Ensure score is within valid range
    score = Math.min(Math.max(score, 0), 10);
    
    // Ensure feedback is not empty
    if (!feedback || feedback.length < 10) {
      feedback = "Your answer shows understanding of the topic. Consider providing more detailed explanations and examples to strengthen your response.";
    }

    return { feedback, score };

  } catch (error) {
    console.error('OpenAI feedback generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    }
    
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    
    throw new Error('Failed to generate feedback. Please try again.');
  }
};

// Get topic-specific guidelines for question generation
const getTopicGuidelines = (topic) => {
  const guidelines = {
    'Java Programming': `
    - Object-oriented programming concepts (inheritance, polymorphism, encapsulation)
    - Core Java features (collections, exception handling, multithreading)
    - JVM concepts and memory management
    - Design patterns and best practices
    `,
    'HR & Behavioral': `
    - Behavioral scenarios and STAR method responses
    - Leadership and teamwork experiences
    - Problem-solving and conflict resolution
    - Career goals and motivation
    `,
    'Data Structures & Algorithms': `
    - Array and string manipulation problems
    - Tree and graph traversal algorithms
    - Sorting and searching techniques
    - Time and space complexity analysis
    `,
    'Communication Skills': `
    - Presentation and public speaking scenarios
    - Professional communication situations
    - Active listening and feedback
    - Cross-cultural communication
    `,
    'Database Management': `
    - SQL query writing and optimization
    - Database design and normalization
    - ACID properties and transactions
    - Indexing and performance tuning
    `,
    'System Design': `
    - Scalability and load balancing
    - Database design for large systems
    - Caching strategies and CDNs
    - Microservices architecture
    `
  };

  return guidelines[topic] || 'Focus on practical knowledge and real-world applications.';
};

// Validate OpenAI API key on startup
export const validateOpenAIKey = async () => {
  try {
    if (!process.env.OPENAI_API_KEY || !openai) {
      console.warn('⚠️ OPENAI_API_KEY not set. AI features will be disabled.');
      return;
    }
    // Light ping without failing startup on 401
    await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 1
    });
    console.log('✅ OpenAI API key validated successfully');
  } catch (error) {
    console.warn('⚠️ OpenAI validation warning:', error.message);
    console.warn('   Backend will start; AI endpoints may return errors until a valid key is provided.');
  }
};
