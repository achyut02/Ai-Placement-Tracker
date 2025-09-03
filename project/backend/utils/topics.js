// Static topics data - can be moved to database later
export const topics = [
  {
    id: 'java',
    title: 'Java Programming',
    description: 'Core Java concepts, OOP principles, and advanced topics',
    color: 'bg-gradient-to-br from-orange-500 to-red-600',
    questionCount: 15,
    difficulty: 'Intermediate',
    keywords: ['OOP', 'Collections', 'Multithreading', 'JVM', 'Exception Handling']
  },
  {
    id: 'hr',
    title: 'HR & Behavioral',
    description: 'Behavioral questions, situational scenarios, and soft skills',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    questionCount: 20,
    difficulty: 'Mixed',
    keywords: ['Leadership', 'Teamwork', 'Communication', 'Problem Solving', 'Adaptability']
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Arrays, trees, graphs, sorting, searching, and complexity analysis',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    questionCount: 25,
    difficulty: 'Advanced',
    keywords: ['Arrays', 'Trees', 'Graphs', 'Sorting', 'Dynamic Programming']
  },
  {
    id: 'communication',
    title: 'Communication Skills',
    description: 'Presentation skills, public speaking, and professional communication',
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    questionCount: 12,
    difficulty: 'Beginner',
    keywords: ['Presentation', 'Public Speaking', 'Active Listening', 'Feedback']
  },
  {
    id: 'database',
    title: 'Database Management',
    description: 'SQL queries, database design, normalization, and DBMS concepts',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    questionCount: 18,
    difficulty: 'Intermediate',
    keywords: ['SQL', 'Normalization', 'Indexing', 'Transactions', 'Performance']
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Scalability, architecture patterns, and distributed systems',
    color: 'bg-gradient-to-br from-teal-500 to-blue-600',
    questionCount: 10,
    difficulty: 'Advanced',
    keywords: ['Scalability', 'Load Balancing', 'Microservices', 'Caching', 'Databases']
  }
];

// Get topic by ID
export const getTopicById = (topicId) => {
  return topics.find(topic => topic.id === topicId);
};

// Get all topics
export const getAllTopics = () => {
  return topics;
};

// Validate topic ID
export const isValidTopicId = (topicId) => {
  return topics.some(topic => topic.id === topicId);
};