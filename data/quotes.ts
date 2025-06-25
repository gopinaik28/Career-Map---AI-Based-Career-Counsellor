// data/quotes.ts
export interface Quote {
  text: string;
  author: string;
  tags?: string[]; // For contextual display e.g. ['technology', 'learning', 'arts', 'perseverance']
}

export const INSPIRATIONAL_QUOTES: Quote[] = [
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", tags: ["general", "dreams", "future"] },
  { text: "Choose a job you love, and you will never have to work a day in your life.", author: "Confucius", tags: ["passion", "career", "work"] },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ["passion", "work", "technology", "innovation"] },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo", tags: ["learning", "growth", "education"] },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", tags: ["action", "future", "innovation", "business", "entrepreneurship"] },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", tags: ["perseverance", "resilience", "success", "failure"] },
  { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs", tags: ["passion", "career", "technology", "work"] },
  { text: "The mind is everything. What you think you become.", author: "Buddha", tags: ["mindset", "general", "philosophy"] },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", tags: ["value", "impact", "science", "success"] },
  { text: "The arts are not a way to make a living. They are a very human way of making life more bearable.", author: "Kurt Vonnegut", tags: ["arts", "humanity", "creativity", "writing"] },
  { text: "To practice any art, no matter how well or badly, is a way to make your soul grow.", author: "Kurt Vonnegut", tags: ["arts", "creativity", "growth", "writing"] },
  { text: "Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important.", author: "Bill Gates", tags: ["technology", "education", "teaching", "tools"] },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King", tags: ["learning", "education", "music"] },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", tags: ["learning", "knowledge", "education", "finance"] },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes", tags: ["learning", "beginner", "growth", "skills"] },
  { text: "It is never too late to be what you might have been.", author: "George Eliot", tags: ["dreams", "change", "career", "potential"] },
  { text: "Go confidently in the direction of your dreams. Live the life you've imagined.", author: "Henry David Thoreau", tags: ["dreams", "action", "confidence"] },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", tags: ["mindset", "future", "doubt", "potential"] },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein", tags: ["creativity", "intelligence", "science", "fun"] },
  { text: "The best careers are not about the money, but about the mission.", author: "Unknown", tags: ["passion", "mission", "career", "value"] },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson", tags: ["perseverance", "action", "time"] },
  { text: "Build your own dreams, or someone else will hire you to build theirs.", author: "Farrah Gray", tags: ["dreams", "entrepreneurship", "action", "business", "career"] },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", tags: ["action", "journey", "beginner", "philosophy"] },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", tags: ["mindset", "confidence", "belief"] },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar", tags: ["growth", "goals", "journey"] },
  { text: "The harder I work, the luckier I get.", author: "Samuel Goldwyn", tags: ["work", "perseverance", "success"] },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats", tags: ["action", "initiative", "opportunity"] },
  { text: "Opportunities don't happen, you create them.", author: "Chris Grosser", tags: ["opportunity", "action", "entrepreneurship"] },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", tags: ["potential", "choice", "self"] },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington", tags: ["service", "community", "impact", "collaboration"] },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", tags: ["happiness", "life", "philosophy"] },
  { text: "Get action. Seize the moment. Man was never intended to become an oyster.", author: "Theodore Roosevelt", tags: ["action", "initiative"] },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson", tags: ["effort", "excellence", "success"] },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci", tags: ["learning", "knowledge", "arts", "science"] },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", tags: ["action", "opportunity", "future", "time"] },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky", tags: ["action", "risk", "opportunity", "sports"] },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison", tags: ["failure", "perseverance", "learning", "innovation", "science"] },
  { text: "If you can dream it, you can do it.", author: "Walt Disney", tags: ["dreams", "action", "belief", "creativity"] },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan", tags: ["dreams", "risk", "failure", "action"] },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", tags: ["action", "impact", "value"] }
];
