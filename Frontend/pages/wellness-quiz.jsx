import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WellnessQuiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState({
    selfCare: 0,
    mindfulness: 0,
    socialConnection: 0,
    resilience: 0,
    restfulness: 0
  });
  const [animateIn, setAnimateIn] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Array of quiz questions with their options and categories
  const questions = [
    {
      id: 1,
      text: "How often do you find yourself feeling overwhelmed by your thoughts?",
      category: "mindfulness",
      options: [
        { value: 1, text: "Almost all the time" },
        { value: 2, text: "Several times a day" },
        { value: 3, text: "A few times a week" },
        { value: 4, text: "Occasionally" },
        { value: 5, text: "Rarely or never" }
      ]
    },
    {
      id: 2,
      text: "In the past week, how many days did you engage in an activity solely because it brings you joy?",
      category: "selfCare",
      options: [
        { value: 1, text: "None" },
        { value: 2, text: "1-2 days" },
        { value: 3, text: "3-4 days" },
        { value: 4, text: "5-6 days" },
        { value: 5, text: "Every day" }
      ]
    },
    {
      id: 3,
      text: "When faced with a significant setback, how long does it typically take you to regain your emotional balance?",
      category: "resilience",
      options: [
        { value: 1, text: "More than a month" },
        { value: 2, text: "A couple of weeks" },
        { value: 3, text: "Several days" },
        { value: 4, text: "A day or two" },
        { value: 5, text: "I recover quite quickly" }
      ]
    },
    {
      id: 4,
      text: "How satisfied are you with the quality of your sleep?",
      category: "restfulness",
      options: [
        { value: 1, text: "Very unsatisfied" },
        { value: 2, text: "Somewhat unsatisfied" },
        { value: 3, text: "Neutral" },
        { value: 4, text: "Somewhat satisfied" },
        { value: 5, text: "Very satisfied" }
      ]
    },
    {
      id: 5,
      text: "How deeply connected do you feel to the people in your life?",
      category: "socialConnection",
      options: [
        { value: 1, text: "Not connected at all" },
        { value: 2, text: "Slightly connected" },
        { value: 3, text: "Moderately connected" },
        { value: 4, text: "Very connected" },
        { value: 5, text: "Deeply connected" }
      ]
    },
    {
      id: 6,
      text: "When was the last time you made a conscious decision to prioritize your wellbeing over other responsibilities?",
      category: "selfCare",
      options: [
        { value: 1, text: "I can't remember ever doing this" },
        { value: 2, text: "More than a month ago" },
        { value: 3, text: "Within the last month" },
        { value: 4, text: "Within the last week" },
        { value: 5, text: "Today or yesterday" }
      ]
    },
    {
      id: 7,
      text: "How often do you take a moment to notice your surroundings and be present in the moment?",
      category: "mindfulness",
      options: [
        { value: 1, text: "Almost never" },
        { value: 2, text: "Rarely" },
        { value: 3, text: "Sometimes" },
        { value: 4, text: "Often" },
        { value: 5, text: "Multiple times throughout each day" }
      ]
    },
    {
      id: 8,
      text: "When things don't go as planned, how quickly do you adapt to the new situation?",
      category: "resilience",
      options: [
        { value: 1, text: "I struggle significantly with changes" },
        { value: 2, text: "It takes me a while to adjust" },
        { value: 3, text: "I eventually adapt, but it's not easy" },
        { value: 4, text: "I can usually adapt fairly well" },
        { value: 5, text: "I embrace change and pivot quickly" }
      ]
    },
    {
      id: 9,
      text: "How often do you wake up feeling well-rested?",
      category: "restfulness",
      options: [
        { value: 1, text: "Almost never" },
        { value: 2, text: "1-2 days a week" },
        { value: 3, text: "3-4 days a week" },
        { value: 4, text: "5-6 days a week" },
        { value: 5, text: "Nearly every day" }
      ]
    },
    {
      id: 10,
      text: "How comfortable are you sharing your true feelings with those close to you?",
      category: "socialConnection",
      options: [
        { value: 1, text: "Very uncomfortable" },
        { value: 2, text: "Somewhat uncomfortable" },
        { value: 3, text: "Neutral" },
        { value: 4, text: "Somewhat comfortable" },
        { value: 5, text: "Very comfortable" }
      ]
    },
    {
      id: 11,
      text: "How often do you engage in activities that nurture your mind, body, or spirit?",
      category: "selfCare",
      options: [
        { value: 1, text: "Rarely or never" },
        { value: 2, text: "Once in a while" },
        { value: 3, text: "A few times a month" },
        { value: 4, text: "Several times a week" },
        { value: 5, text: "Daily" }
      ]
    },
    {
      id: 12,
      text: "When you experience negative thoughts, how aware are you of their presence and impact?",
      category: "mindfulness",
      options: [
        { value: 1, text: "I'm rarely aware of my thought patterns" },
        { value: 2, text: "I sometimes notice after they've affected me" },
        { value: 3, text: "I'm moderately aware of them" },
        { value: 4, text: "I'm usually aware of them as they happen" },
        { value: 5, text: "I'm highly attuned to my thoughts and their effects" }
      ]
    },
    {
      id: 13,
      text: "How well do you maintain your emotional well-being during stressful periods?",
      category: "resilience",
      options: [
        { value: 1, text: "I struggle significantly" },
        { value: 2, text: "I often get overwhelmed" },
        { value: 3, text: "I manage moderately well" },
        { value: 4, text: "I generally maintain my balance" },
        { value: 5, text: "I thrive even under pressure" }
      ]
    },
    {
      id: 14,
      text: "How would you rate the balance between activity and rest in your life?",
      category: "restfulness",
      options: [
        { value: 1, text: "Very unbalanced - mostly activity" },
        { value: 2, text: "Somewhat unbalanced" },
        { value: 3, text: "Neutral/moderate balance" },
        { value: 4, text: "Good balance" },
        { value: 5, text: "Excellent balance between activity and rest" }
      ]
    },
    {
      id: 15,
      text: "How meaningful do you find your interactions with others?",
      category: "socialConnection",
      options: [
        { value: 1, text: "Rarely meaningful" },
        { value: 2, text: "Occasionally meaningful" },
        { value: 3, text: "Sometimes meaningful" },
        { value: 4, text: "Often meaningful" },
        { value: 5, text: "Almost always deeply meaningful" }
      ]
    }
  ];

  // Handle selecting an answer
  const handleSelectAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  // Go to next question with animation
  const goToNextQuestion = () => {
    if (!answers[questions[currentQuestion].id]) return;
    
    setIsTransitioning(true);
    setAnimateIn(false);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate results
        calculateResults();
        setQuizComplete(true);
      }
      setTimeout(() => {
        setAnimateIn(true);
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // Go to previous question with animation
  const goToPrevQuestion = () => {
    if (currentQuestion === 0) return;
    
    setIsTransitioning(true);
    setAnimateIn(false);
    
    setTimeout(() => {
      setCurrentQuestion(currentQuestion - 1);
      setTimeout(() => {
        setAnimateIn(true);
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // Calculate quiz results
  const calculateResults = () => {
    let newResults = {
      selfCare: 0,
      mindfulness: 0,
      socialConnection: 0,
      resilience: 0,
      restfulness: 0
    };

    let categoryCounts = {
      selfCare: 0,
      mindfulness: 0,
      socialConnection: 0,
      resilience: 0,
      restfulness: 0
    };

    // Sum up scores by category
    questions.forEach(question => {
      if (answers[question.id]) {
        newResults[question.category] += answers[question.id];
        categoryCounts[question.category]++;
      }
    });

    // Calculate averages for each category
    Object.keys(newResults).forEach(category => {
      if (categoryCounts[category] > 0) {
        newResults[category] = Math.round((newResults[category] / (categoryCounts[category] * 5)) * 100);
      }
    });

    setResults(newResults);
  };

  // Get recommendation based on results
  const getRecommendation = () => {
    // Find the lowest scoring area
    const lowestCategory = Object.entries(results).reduce(
      (min, [category, score]) => score < min[1] ? [category, score] : min,
      ['', 100]
    )[0];

    switch (lowestCategory) {
      case 'selfCare':
        return {
          title: "Focus on Self-Care",
          text: "Your results suggest that investing more in self-care activities could benefit your overall wellbeing. Try scheduling regular time for activities that bring you joy and replenish your energy.",
          suggestion: "Start with just 10 minutes a day dedicated solely to something you enjoy, whether it's reading, a hobby, or simply sitting quietly."
        };
      case 'mindfulness':
        return {
          title: "Practice Mindfulness",
          text: "Your results indicate you might benefit from more mindfulness in your daily life. Mindfulness helps us stay present and reduces overthinking.",
          suggestion: "Try a simple daily meditation practice or moments of conscious breathing throughout your day."
        };
      case 'socialConnection':
        return {
          title: "Nurture Your Connections",
          text: "Your results suggest you might benefit from deeper social connections. Meaningful relationships are a cornerstone of wellbeing.",
          suggestion: "Consider reaching out to someone you care about this week for a meaningful conversation or shared experience."
        };
      case 'resilience':
        return {
          title: "Build Resilience",
          text: "Your results indicate you could benefit from strengthening your resilience. Resilience helps us navigate life's challenges with greater ease.",
          suggestion: "Practice reframing challenges as opportunities for growth, and remember past difficulties you've successfully overcome."
        };
      case 'restfulness':
        return {
          title: "Prioritize Rest",
          text: "Your results suggest improving the quality of your rest and sleep could significantly benefit your wellbeing.",
          suggestion: "Consider establishing a calming bedtime routine and creating a sleep environment that promotes quality rest."
        };
      default:
        return {
          title: "Maintain Your Balance",
          text: "Your results show good overall wellbeing practices. Continue nurturing all aspects of your wellness.",
          suggestion: "Consider which area feels most meaningful to you right now, and deepen your practice there."
        };
    }
  };

  // Use effect to trigger initial animation
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #5b7d61, #88a28d)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0
      }}></div>
      
      {/* Floating shapes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 20 + Math.random() * 30,
            height: 20 + Math.random() * 30,
            borderRadius: Math.random() > 0.5 ? '50%' : '5px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(2px)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float${i + 1} ${15 + Math.random() * 10}s infinite ease-in-out`,
            zIndex: 0
          }}
        ></div>
      ))}
      
      {/* Close button */}
      <button 
        onClick={() => router.push('/')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: 'white',
          cursor: 'pointer',
          backdropFilter: 'blur(2px)',
          zIndex: 10,
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ×
      </button>
      
      {/* Main card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '90%',
        maxWidth: '650px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '450px',
        display: 'flex',
        flexDirection: 'column',
        transform: animateIn ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        opacity: animateIn ? 1 : 0.5,
        transition: 'all 0.3s ease-out',
        zIndex: 5
      }}>
        {/* Decorative card pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          borderRadius: '0 0 0 100%',
          background: 'linear-gradient(135deg, rgba(91, 125, 97, 0.05), rgba(91, 125, 97, 0.15))',
          zIndex: 0
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100px',
          height: '100px',
          borderRadius: '0 100% 0 0',
          background: 'linear-gradient(135deg, rgba(91, 125, 97, 0.05), rgba(91, 125, 97, 0.15))',
          zIndex: 0
        }}></div>
        
        {/* Header */}
        <div style={{ marginBottom: '20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            width: '40px', 
            height: '3px', 
            background: '#5b7d61', 
            margin: '0 auto 15px' 
          }}></div>
          <div style={{ 
            fontSize: '14px', 
            color: '#5b7d61', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            fontWeight: '600'
          }}>
            Solace Wellness Assessment
          </div>
        </div>
        
        {!quizComplete ? (
          <>
            {/* Progress indicator */}
            <div style={{
              width: '100%',
              height: '4px',
              background: '#eee',
              borderRadius: '2px',
              marginBottom: '30px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${(currentQuestion / (questions.length - 1)) * 100}%`,
                background: 'linear-gradient(to right, #5b7d61, #88a28d)',
                borderRadius: '2px',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
            
            {/* Question */}
            <div style={{ 
              marginBottom: '30px', 
              flex: 1, 
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              position: 'relative',
              zIndex: 1
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600',
                color: '#333',
                marginBottom: '25px',
                lineHeight: '1.4'
              }}>
                {questions[currentQuestion].text}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {questions[currentQuestion].options.map((option, index) => (
                  <label 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '18px 20px',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: answers[questions[currentQuestion].id] === option.value 
                        ? 'rgba(91, 125, 97, 0.1)' 
                        : 'white',
                      borderColor: answers[questions[currentQuestion].id] === option.value 
                        ? '#5b7d61' 
                        : '#ddd',
                      boxShadow: answers[questions[currentQuestion].id] === option.value 
                        ? '0 2px 8px rgba(91, 125, 97, 0.2)' 
                        : 'none',
                      transform: answers[questions[currentQuestion].id] === option.value 
                        ? 'translateY(-2px)' 
                        : 'translateY(0)'
                    }}
                    onClick={() => handleSelectAnswer(questions[currentQuestion].id, option.value)}
                    onMouseOver={(e) => {
                      if (answers[questions[currentQuestion].id] !== option.value) {
                        e.currentTarget.style.borderColor = '#5b7d61';
                        e.currentTarget.style.background = 'rgba(91, 125, 97, 0.03)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (answers[questions[currentQuestion].id] !== option.value) {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '2px solid #ddd',
                      marginRight: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: answers[questions[currentQuestion].id] === option.value 
                        ? '#5b7d61' 
                        : 'white',
                      borderColor: answers[questions[currentQuestion].id] === option.value 
                        ? '#5b7d61' 
                        : '#ddd',
                      transition: 'all 0.2s ease'
                    }}>
                      {answers[questions[currentQuestion].id] === option.value && (
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'white'
                        }}></div>
                      )}
                    </div>
                    <span style={{
                      fontSize: '15px',
                      color: answers[questions[currentQuestion].id] === option.value 
                        ? '#444' 
                        : '#666',
                      fontWeight: answers[questions[currentQuestion].id] === option.value 
                        ? '500' 
                        : 'normal'
                    }}>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
              position: 'relative',
              zIndex: 1
            }}>
              <button
                onClick={goToPrevQuestion}
                disabled={currentQuestion === 0}
                style={{
                  padding: '14px 26px',
                  background: 'transparent',
                  border: '1px solid #ccc',
                  color: currentQuestion === 0 ? '#ccc' : '#555',
                  borderRadius: '30px',
                  cursor: currentQuestion === 0 ? 'default' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  minWidth: '110px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (currentQuestion !== 0) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                    e.currentTarget.style.borderColor = '#aaa';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentQuestion !== 0) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#ccc';
                  }
                }}
              >
                <span style={{ fontSize: '18px' }}>←</span> Back
              </button>
              
              <button
                onClick={goToNextQuestion}
                disabled={!answers[questions[currentQuestion].id]}
                style={{
                  padding: '14px 26px',
                  background: answers[questions[currentQuestion].id] 
                    ? 'linear-gradient(to right, #5b7d61, #88a28d)'
                    : '#eee',
                  border: 'none',
                  color: answers[questions[currentQuestion].id] ? 'white' : '#999',
                  borderRadius: '30px',
                  cursor: answers[questions[currentQuestion].id] ? 'pointer' : 'default',
                  fontSize: '16px',
                  fontWeight: '500',
                  minWidth: '110px',
                  transition: 'all 0.3s ease',
                  boxShadow: answers[questions[currentQuestion].id] 
                    ? '0 4px 15px rgba(91, 125, 97, 0.3)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (answers[questions[currentQuestion].id]) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(91, 125, 97, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (answers[questions[currentQuestion].id]) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(91, 125, 97, 0.3)';
                  }
                }}
              >
                {currentQuestion === questions.length - 1 ? 'Complete' : 'Continue'} <span style={{ fontSize: '18px' }}>→</span>
              </button>
            </div>
            
            {/* Question counter */}
            <div style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: '#999',
              position: 'relative',
              zIndex: 1
            }}>
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </>
        ) : (
          // Results section
          <div style={{ 
            textAlign: 'center', 
            position: 'relative', 
            zIndex: 1,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '600',
              color: '#333',
              marginBottom: '30px'
            }}>
              Your Wellness Profile
            </h2>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '25px',
              marginBottom: '40px'
            }}>
              {Object.entries(results).map(([category, score], index) => (
                <div 
                  key={category}
                  style={{
                    width: '110px',
                    textAlign: 'center',
                    position: 'relative',
                    animation: `fadeIn 0.5s ease forwards ${0.2 + index * 0.1}s`,
                    opacity: 0
                  }}
                >
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `conic-gradient(#5b7d61 ${score}%, transparent 0)`,
                      animation: `rotate 1.5s ease forwards ${0.5 + index * 0.2}s`
                    }}></div>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#5b7d61',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {score}%
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#555',
                    textTransform: 'capitalize'
                  }}>
                    {category === 'selfCare' ? 'Self-Care' : 
                     category === 'socialConnection' ? 'Social' : category}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Recommendation */}
            <div style={{
              background: 'rgba(91, 125, 97, 0.1)',
              padding: '30px',
              borderRadius: '16px',
              marginBottom: '30px',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
              animation: 'fadeIn 0.5s ease forwards 1.5s',
              opacity: 0
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                background: 'rgba(91, 125, 97, 0.05)',
                borderRadius: '0 0 0 80px'
              }}></div>
              
              <h3 style={{
                fontSize: '20px',
                color: '#5b7d61',
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                {getRecommendation().title}
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#444',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                {getRecommendation().text}
              </p>
              <div style={{
                fontSize: '15px',
                color: '#333',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.7)',
                padding: '15px',
                borderRadius: '10px'
              }}>
                <span style={{ fontSize: '24px', color: '#5b7d61' }}>💡</span>
                <span>{getRecommendation().suggestion}</span>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '16px 34px',
                background: 'linear-gradient(to right, #5b7d61, #88a28d)',
                border: 'none',
                color: 'white',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(91, 125, 97, 0.3)',
                animation: 'fadeIn 0.5s ease forwards 1.8s',
                opacity: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(91, 125, 97, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(91, 125, 97, 0.3)';
              }}
            >
              Return to Dashboard <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </div>
        )}
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, 15px); }
          50% { transform: translate(-5px, 20px); }
          75% { transform: translate(-15px, 5px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-10px, -15px); }
          50% { transform: translate(15px, -20px); }
          75% { transform: translate(5px, -10px); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, 10px); }
          50% { transform: translate(5px, -15px); }
          75% { transform: translate(-10px, 5px); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-20px, 10px); }
          50% { transform: translate(-10px, -10px); }
          75% { transform: translate(15px, 5px); }
        }
        
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -20px); }
          50% { transform: translate(-5px, -5px); }
          75% { transform: translate(-15px, -15px); }
        }
        
        @keyframes float6 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5px, 15px); }
          50% { transform: translate(10px, 5px); }
          75% { transform: translate(15px, -5px); }
        }
      `}</style>
    </main>
  );
} 