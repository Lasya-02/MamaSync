import React, { useState } from 'react';

export default function Guide() {
  const [activeTab, setActiveTab] = useState('first');

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  };

  const trimesters = {
    first: {
      title: "First Trimester",
      subtitle: "Weeks 1-12",
      emoji: "🌸",
      tips: [
        { emoji: "📅", title: "Start Prenatal Care", desc: "Schedule your first appointment within 8 weeks of your last period" },
        { emoji: "💊", title: "Take Prenatal Vitamins", desc: "Begin taking folic acid (400-800 mcg daily) immediately" },
        { emoji: "🫖", title: "Manage Morning Sickness", desc: "Eat small, frequent meals and try ginger or vitamin B6" },
        { emoji: "😴", title: "Prioritize Rest", desc: "Aim for 8+ hours of sleep nightly as fatigue is common" },
        { emoji: "⚠️", title: "Important Don'ts", desc: "Avoid alcohol, smoking, hot tubs, and certain foods" }
      ]
    },
    second: {
      title: "Second Trimester",
      subtitle: "Weeks 13-27",
      emoji: "💜",
      tips: [
        { emoji: "🌟", title: "Enjoy Increased Energy", desc: "Most women feel their best during this trimester" },
        { emoji: "🔍", title: "20-Week Anatomy Scan", desc: "Detailed ultrasound checks baby's development" },
        { emoji: "🏃‍♀️", title: "Stay Active Safely", desc: "Aim for 150 minutes of moderate exercise weekly" },
        { emoji: "🧴", title: "Care for Changing Skin", desc: "Moisturize regularly as your belly grows" },
        { emoji: "🍼", title: "Start Baby Prep", desc: "Create a baby registry and research childbirth classes" }
      ]
    },
    third: {
      title: "Third Trimester",
      subtitle: "Weeks 28-40",
      emoji: "💙",
      tips: [
        { emoji: "📋", title: "Frequent Check-ups", desc: "Weekly visits starting around week 36" },
        { emoji: "🛏️", title: "Manage Discomfort", desc: "Use pillows, elevate feet, and rest frequently" },
        { emoji: "🚨", title: "Know Labor Signs", desc: "Learn difference between Braxton Hicks and real contractions" },
        { emoji: "🎒", title: "Pack Hospital Bag", desc: "Prepare bag by week 35 with essentials" },
        { emoji: "✅", title: "Final Preparations", desc: "Install car seat, finalize nursery, prepare meals" }
      ]
    }
  };

  const workTips = [
    { emoji: "💼", title: "Communicate with Employer", desc: "Inform your manager and discuss flexible hours" },
    { emoji: "☕", title: "Take Regular Breaks", desc: "Work 25 minutes, rest 5. Stand every hour" },
    { emoji: "🍎", title: "Keep Healthy Snacks", desc: "Eat every 2-3 hours to maintain energy" },
    { emoji: "🪑", title: "Maintain Good Posture", desc: "Use ergonomic support and stretch" },
    { emoji: "💤", title: "Manage Fatigue", desc: "Get 8+ hours of sleep nightly" },
    { emoji: "👥", title: "Build Support Network", desc: "Connect with other working moms" }
  ];

  const current = trimesters[activeTab];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fce7f3, #fdf2f8, #f3e8ff)', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            💗 Your Pregnancy Guide 💗
          </h1>
          <p style={{ color: '#6b7280' }}>Navigate your journey with confidence</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.entries(trimesters).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === key ? 'linear-gradient(to right, #ec4899, #f43f5e)' : 'white',
                color: activeTab === key ? 'white' : '#374151',
                boxShadow: activeTab === key ? '0 4px 12px rgba(236, 72, 153, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s'
              }}
            >
              {data.emoji} {data.title}
            </button>
          ))}
        </div>

        {/* Trimester Content */}
        <div style={{ 
          background: activeTab === 'first' ? '#fce7f3' : activeTab === 'second' ? '#f3e8ff' : '#dbeafe',
          border: '2px solid',
          borderColor: activeTab === 'first' ? '#fbcfe8' : activeTab === 'second' ? '#e9d5ff' : '#bfdbfe',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '60px', marginBottom: '8px' }}>{current.emoji}</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{current.title}</h2>
            <p style={{ color: '#6b7280' }}>{current.subtitle}</p>
          </div>

          <div>
            {current.tips.map((tip, idx) => (
              <div key={idx} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '36px', flexShrink: 0 }}>{tip.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px', fontSize: '18px' }}>
                      {tip.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Working Tips */}
        <div style={{
          background: 'linear-gradient(to bottom right, #e0e7ff, #ede9fe)',
          border: '2px solid #c7d2fe',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
               Working While Pregnant
            </h2>
            <p style={{ color: '#6b7280' }}>Balance your career and pregnancy</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {workTips.map((tip, idx) => (
              <div key={idx} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '32px', flexShrink: 0 }}>{tip.emoji}</span>
                  <div>
                    <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px', fontSize: '16px' }}>
                      {tip.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', background: '#c7d2fe', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <p style={{ color: '#1f2937', fontSize: '14px' }}>
              <strong>Remember:</strong> You're amazing! Listen to your body and don't feel guilty!
            </p>
          </div>
        </div>

        {/* Important Reminders */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>
            Important Reminders
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {[
              { emoji: '💧', title: 'Stay Hydrated', desc: 'Drink 8-10 glasses of water daily', bg: '#f0fdf4', border: '#bbf7d0' },
              { emoji: '✅', title: 'Attend Appointments', desc: 'Regular prenatal care is crucial', bg: '#f0fdf4', border: '#bbf7d0' },
              { emoji: '🚨', title: 'Call Doctor If', desc: 'Severe pain, bleeding, or decreased movement', bg: '#fef3c7', border: '#fde68a' },
              { emoji: '🧠', title: 'Mental Health Matters', desc: 'Reach out if feeling depressed or anxious', bg: '#fef3c7', border: '#fde68a' }
            ].map((item, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                gap: '12px', 
                padding: '12px', 
                background: item.bg, 
                borderRadius: '12px', 
                border: `1px solid ${item.border}` 
              }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>{item.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', color: '#9ca3af', fontSize: '12px' }}>
          <p>💗 Made with love for all the amazing mamas 💗</p>
          <p style={{ marginTop: '4px' }}>Always consult your healthcare provider for personalized advice</p>
        </div>
      </div>
    </div>
  );
}