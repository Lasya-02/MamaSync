import React, { useState } from 'react';

export default function Dashboard() {
  const [waterIntake, setWaterIntake] = useState(5);
  const [currentMood, setCurrentMood] = useState('happy');
  const [tasksCompleted, setTasksCompleted] = useState([false, false, false, false]);

  const waterGoal = 8;
  const waterPercentage = (waterIntake / waterGoal) * 100;

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '🤢', label: 'Unwell', value: 'unwell' }
  ];

  const todayTasks = [
    { id: 0, emoji: '💧', title: 'Drink 8 glasses of water', time: 'All day' },
    { id: 1, emoji: '🍎', title: 'Eat healthy breakfast', time: '8:00 AM' },
    { id: 2, emoji: '🧘‍♀️', title: 'Prenatal yoga stretch', time: '12:00 PM' },
    { id: 3, emoji: '💊', title: 'Take prenatal vitamin', time: '9:00 PM' }
  ];

  const upcomingAppointments = [
    { date: 'Nov 12', time: '10:30 AM', type: 'OB-GYN Checkup', doctor: 'Dr. Sarah Johnson' },
    { date: 'Nov 20', time: '2:00 PM', type: 'Ultrasound Scan', doctor: 'Radiology Dept' }
  ];

  const weeklyStreak = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: false },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false }
  ];

  const toggleTask = (id) => {
    const newTasks = [...tasksCompleted];
    newTasks[id] = !newTasks[id];
    setTasksCompleted(newTasks);
  };

  const completedCount = tasksCompleted.filter(Boolean).length;
  const completionPercentage = (completedCount / todayTasks.length) * 100;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fce7f3 0%, #fef3c7 50%, #ddd6fe 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
             Welcome Mama!
          </h1>
        </div>

        {/* Stats Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          {/* Water Intake */}
          <div style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', 
            borderRadius: '16px', 
            padding: '20px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💧</div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Water Intake</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{waterIntake}/{waterGoal}</div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '8px', 
              height: '6px', 
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                background: 'white', 
                height: '100%', 
                width: `${waterPercentage}%`,
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          {/* Tasks Progress */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', 
            borderRadius: '16px', 
            padding: '20px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Daily Tasks</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{completedCount}/{todayTasks.length}</div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '8px', 
              height: '6px', 
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                background: 'white', 
                height: '100%', 
                width: `${completionPercentage}%`,
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          {/* Weekly Streak */}
          {/* <div style={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', 
            borderRadius: '16px', 
            padding: '20px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔥</div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Weekly Streak</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>4 Days</div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
              {weeklyStreak.map((day, idx) => (
                <div key={idx} style={{ 
                  width: '100%', 
                  height: '6px', 
                  background: day.completed ? 'white' : 'rgba(255,255,255,0.2)',
                  borderRadius: '3px'
                }} />
              ))}
            </div>
          </div> */}

          {/* Baby Growth */}
          {/* <div style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', 
            borderRadius: '16px', 
            padding: '20px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👶</div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Baby Size</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Corn 🌽</div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px' }}>~30cm, 600g</div>
          </div> */}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Today's Tasks */}
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>📝 Today's Tasks</h2>
                <span style={{ 
                  background: '#fef3c7', 
                  color: '#92400e', 
                  padding: '4px 12px', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {completedCount} of {todayTasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todayTasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '16px',
                      background: tasksCompleted[task.id] ? '#f0fdf4' : '#f9fafb',
                      borderRadius: '12px',
                      border: `2px solid ${tasksCompleted[task.id] ? '#86efac' : '#e5e7eb'}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%',
                      border: `2px solid ${tasksCompleted[task.id] ? '#10b981' : '#d1d5db'}`,
                      background: tasksCompleted[task.id] ? '#10b981' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {tasksCompleted[task.id] && (
                        <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                      )}
                    </div>
                    <span style={{ fontSize: '24px', flexShrink: 0 }}>{task.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#1f2937',
                        textDecoration: tasksCompleted[task.id] ? 'line-through' : 'none',
                        opacity: tasksCompleted[task.id] ? 0.6 : 1
                      }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{task.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hydration Tracker */}
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                💧 Hydration Tracker
              </h2>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {[...Array(8)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setWaterIntake(idx + 1)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      border: 'none',
                      background: idx < waterIntake ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : '#f3f4f6',
                      cursor: 'pointer',
                      fontSize: '20px',
                      transition: 'all 0.3s',
                      boxShadow: idx < waterIntake ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                    }}
                  >
                    💧
                  </button>
                ))}
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <span>{waterIntake} glasses</span>
                <span>Goal: {waterGoal} glasses</span>
              </div>
            </div>

            {/* Mood Check-in */}
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                😊 How are you feeling today?
              </h2>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setCurrentMood(mood.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: currentMood === mood.value ? '#fef3c7' : '#f9fafb',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: currentMood === mood.value ? '0 2px 8px rgba(251, 191, 36, 0.3)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{mood.emoji}</span>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: currentMood === mood.value ? '600' : '400',
                      color: currentMood === mood.value ? '#92400e' : '#6b7280'
                    }}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Quick Tips */}
            <div style={{ 
              background: 'linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '2px solid #a78bfa',
              boxShadow: '0 4px 16px rgba(167, 139, 250, 0.2)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#4c1d95', marginBottom: '12px' }}>
                💡 Tip of the Day
              </h2>
              <p style={{ color: '#5b21b6', fontSize: '14px', lineHeight: '1.6' }}>
                At 24 weeks, your baby can hear sounds from outside! Try reading, singing, or playing gentle music. 
                This is a wonderful way to bond with your little one. 🎵
              </p>
            </div>

            {/* Inspirational Quote */}
            <div style={{ 
              background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '2px solid #f9a8d4',
              boxShadow: '0 4px 16px rgba(236, 72, 153, 0.2)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#831843', marginBottom: '12px' }}>
                💝 Daily Affirmation
              </h2>
              <p style={{ color: '#9f1239', fontSize: '16px', lineHeight: '1.6', fontStyle: 'italic' }}>
                "I am strong, capable, and creating life. Every day my body does amazing things for my baby."
              </p>
            </div>

            {/* Health Reminder */}
            <div style={{ 
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
              borderRadius: '20px', 
              padding: '24px',
              border: '2px solid #6ee7b7',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '12px' }}>
                🌿 Health Reminder
              </h2>
              <div style={{ color: '#047857', fontSize: '14px', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '8px' }}>✓ Take your prenatal vitamin with food</p>
                <p style={{ marginBottom: '8px' }}>✓ Gentle walking for 20-30 minutes</p>
                <p style={{ marginBottom: '8px' }}>✓ Sleep on your left side for better circulation</p>
                <p>✓ Practice deep breathing exercises</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}