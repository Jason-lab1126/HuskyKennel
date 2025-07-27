import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Home, MapPin } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI housing assistant for the U District. I can help you find the perfect housing based on your specific needs and preferences. What are you looking for?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Sample responses based on keywords
    if (message.includes('pet') || message.includes('dog') || message.includes('cat')) {
      return "I can help you find pet-friendly housing! Many U District apartments welcome pets. Would you prefer a ground floor apartment for easier pet access, or are you looking for specific amenities like nearby parks or pet washing stations?";
    }
    
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable') || message.includes('$')) {
      return "Budget is definitely important! U District has options ranging from $800-$3000+ per month. What's your ideal budget range? I can also suggest ways to save money like shared rooms, unofficial subleases, or apartments slightly further from campus.";
    }
    
    if (message.includes('close') || message.includes('walk') || message.includes('campus') || message.includes('near')) {
      return "Location is key for students! The closest apartments are within 5-10 minutes walk to campus but tend to be pricier. Would you be open to a 15-20 minute walk or bus ride for better value? I can also suggest the best bus routes from different areas.";
    }
    
    if (message.includes('roommate') || message.includes('shared') || message.includes('social')) {
      return "Looking for roommates can be great for both cost and social aspects! Are you hoping to find compatible roommates through the apartment complex, or would you prefer to find your own roommates first? I can suggest buildings known for their community atmosphere.";
    }
    
    if (message.includes('quiet') || message.includes('study') || message.includes('peaceful')) {
      return "A quiet environment is essential for academic success! I'd recommend looking at apartments away from The Ave party scene, buildings with good soundproofing, or upper floors. Would you prefer a more residential neighborhood like Ravenna over the busy U District core?";
    }
    
    if (message.includes('furnished') || message.includes('furniture')) {
      return "Furnished vs unfurnished is a big decision! Furnished places cost more monthly but save you from buying/moving furniture. Are you an international student or someone who moves frequently? That might make furnished worth it. I can show you both options.";
    }
    
    if (message.includes('parking') || message.includes('car')) {
      return "Parking in the U District can be challenging and expensive! Many students find it's cheaper to rely on public transit, biking, or walking. If you need parking, I'd recommend looking for apartments with dedicated spots rather than street parking. What's your transportation situation?";
    }
    
    if (message.includes('gym') || message.includes('fitness') || message.includes('workout')) {
      return "Great that you want to stay active! Some apartment complexes have their own gyms, plus UW has excellent facilities. Would you prefer in-building fitness amenities, or are you planning to use the campus recreation center?";
    }
    
    if (message.includes('short') || message.includes('summer') || message.includes('quarter') || message.includes('sublease')) {
      return "Short-term housing has unique considerations! Summer subleases are often cheaper since many students go home. Are you looking for official subleases through apartment management, or are you open to unofficial arrangements with students? Each has different advantages.";
    }
    
    if (message.includes('studio') || message.includes('1 bed') || message.includes('2 bed') || message.includes('shared room')) {
      return "Room type really affects your living experience! Studios are most affordable but can feel cramped for studying. 1-bedrooms offer privacy but cost more. Shared rooms save money but require compatible roommates. What's most important to you - privacy, budget, or social aspects?";
    }
    
    // Default responses for general queries
    const defaultResponses = [
      "That's a great question! To give you the best recommendations, could you tell me more about your priorities? For example, budget range, preferred distance from campus, or any must-have amenities?",
      "I'd love to help you find the perfect place! Are you looking for something specific like pet-friendly housing, short-term leases, or particular neighborhoods in the U District?",
      "Let me help you narrow down your options. What's most important to you - staying within walking distance of campus, keeping costs low, or having specific amenities like parking or a gym?",
      "I can definitely assist with that! To provide better suggestions, could you share your budget range and whether you're looking for a studio, shared room, or private bedroom?",
      "The U District has so many great options! Would you like me to focus on official apartment complexes, sublease opportunities, or both? Also, any specific move-in timeframe?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "I need pet-friendly housing under $1500",
    "Looking for a quiet place near campus for studying",
    "Need short-term summer housing",
    "Want a studio apartment with parking",
    "Looking for roommates and social environment"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mr-3">
              <Bot className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Housing Assistant</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tell me exactly what you're looking for in U District housing. I'll help you find options that match your specific needs and preferences.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 md:h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-purple-600' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(prompt)}
                    className="text-sm bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your ideal housing situation..."
                  className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
            <p className="text-sm text-gray-600">Smart recommendations based on your specific needs</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">U District Focus</h3>
            <p className="text-sm text-gray-600">Specialized knowledge of campus area housing</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Local Expertise</h3>
            <p className="text-sm text-gray-600">Insider knowledge of neighborhoods and transit</p>
          </div>
        </div>
      </div>
    </div>
  );
}