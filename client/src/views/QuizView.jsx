import { useState, useEffect } from 'react';

const QUIZ_BANKS = {
  python: {
    title: '🐍 Python core',
    questions: [
      { q: 'What is the output of print(2 ** 3)?', a: ['8', '6', '9', '5'], c: 0, exp: 'The ** operator in Python represents exponentiation (2 cubed is 8).' },
      { q: 'Which data structure is mutable in Python?', a: ['Tuple', 'List', 'String', 'Integer'], c: 1, exp: 'Lists can be changed after creation (mutable), whereas tuples, strings, and integers are immutable.' },
      { q: 'How do you define a function in Python?', a: ['function myFunc()', 'def myFunc():', 'void myFunc()', 'func myFunc()'], c: 1, exp: 'The "def" keyword followed by a colon is used to define functions in Python.' },
      { q: 'What does the len() function do?', a: ['Finds maximum value', 'Returns length/item count', 'Deletes items', 'Generates numbers'], c: 1, exp: 'len() returns the number of items in a collection or length of a string.' }
    ]
  },
  cpp: {
    title: '⚙️ C++ Programming',
    questions: [
      { q: 'Which operator is used to access memory address of a variable?', a: ['*', '&', '->', '&&'], c: 1, exp: 'The reference operator (&) returns the memory address of a variable.' },
      { q: 'What is a pointer in C++?', a: ['A loop counter', 'A variable storing memory address', 'A compiler flag', 'An array index'], c: 1, exp: 'A pointer variable stores the memory address of another variable.' },
      { q: 'How do you print output to standard console in C++?', a: ['cout << "Hello";', 'print("Hello");', 'System.out.println("Hello");', 'printf("Hello");'], c: 0, exp: 'std::cout along with stream insertion operator (<<) is used to output text.' },
      { q: 'What is dynamic memory allocation operator?', a: ['malloc', 'new', 'alloc', 'create'], c: 1, exp: 'The "new" operator dynamically allocates memory on the heap in C++.' }
    ]
  },
  javascript: {
    title: '⚡ JavaScript Engine',
    questions: [
      { q: 'Which keyword defines a block-scoped local variable in ES6?', a: ['var', 'let', 'global', 'local'], c: 1, exp: 'The "let" keyword declares a block-scoped local variable in modern JS.' },
      { q: 'What is the result of typeof NaN?', a: ['"number"', '"undefined"', '"null"', '"nan"'], c: 0, exp: 'Despite standing for Not-a-Number, NaN mathematically belongs to the Number type in JavaScript.' },
      { q: 'What does === operator do?', a: ['Assignment', 'Equality with type conversion', 'Strict equality without type conversion', 'Bitwise comparison'], c: 2, exp: 'The triple-equal operator compares both value and type for strict equality.' },
      { q: 'How do you create a promise?', a: ['new Promise()', 'Promise.create()', 'make Promise()', 'async Promise()'], c: 0, exp: 'Promises are instantiated using "new Promise((resolve, reject) => { })".' }
    ]
  },
  react: {
    title: '⚛️ React SPA Framework',
    questions: [
      { q: 'Which hook manages state inside React functional components?', a: ['useEffect', 'useMemo', 'useState', 'useRef'], c: 2, exp: 'useState allows adding local state variables to functional components.' },
      { q: 'What is Virtual DOM?', a: ['A direct replica of standard DOM', 'Lightweight memory representation of real DOM', 'An external database', 'A visual layout inspector'], c: 1, exp: 'React keeps a lightweight virtual representation of the real DOM in memory to perform rapid updates.' },
      { q: 'What is the purpose of useEffect?', a: ['To style elements', 'To execute side-effects', 'To create context grids', 'To build buttons'], c: 1, exp: 'useEffect runs side-effects like fetching data, subscriptions, or updating DOM.' },
      { q: 'How do you pass data down to child components?', a: ['State hooks', 'Props', 'Redux', 'Context API'], c: 1, exp: 'Props (properties) are passed from parent components down to child components.' }
    ]
  }
};

export default function QuizView() {
  const [bankKey, setBankKey] = useState(null); // null | 'python' | 'cpp' | ...
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const startQuiz = (key) => {
    setBankKey(key);
    setQIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setCoinsEarned(0);
    setQuizDone(false);
  };

  const selectOption = (idx) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const submitAnswer = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);
    const bank = QUIZ_BANKS[bankKey];
    const q = bank.questions[qIdx];
    if (selectedOpt === q.c) {
      setScore(s => s + 1);
      setCoinsEarned(c => c + 20); // 20 ByteCoins per correct answer!
      // Add to persistent balance
      const currentCoins = Number(localStorage.getItem('nexus_coins') || '0');
      localStorage.setItem('nexus_coins', (currentCoins + 20).toString());
    }
  };

  const nextQuestion = () => {
    const bank = QUIZ_BANKS[bankKey];
    if (qIdx + 1 < bank.questions.length) {
      setQIdx(qIdx + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setQuizDone(true);
    }
  };

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div className="page-eyebrow">Knowledge OS · Revision</div>
        <h1 className="page-title">📝 revision Quizzes</h1>
        <p className="page-subtitle">Master core engineering concepts, test your memory, and earn reward ByteCoins!</p>
      </div>

      <div style={{ flex: 1, marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        {bankKey === null ? (
          /* Selection Screen */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, maxWidth: 900, width: '100%', padding: 10 }}>
            {Object.entries(QUIZ_BANKS).map(([key, value]) => (
              <div 
                key={key} 
                className="card clickable" 
                style={{ padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, border: '1px solid var(--border-hi)', background: 'linear-gradient(135deg, var(--cyan-dim), var(--purple-dim))' }}
                onClick={() => startQuiz(key)}
              >
                <div style={{ fontSize: 44 }}>{value.title.split(' ')[0]}</div>
                <h3 style={{ color: 'var(--text-bright)', fontSize: 18, fontWeight: 800 }}>{value.title}</h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{value.questions.length} Revision Steps</span>
                <button className="btn btn-cyan" style={{ width: '100%', marginTop: 'auto', fontSize: 12 }}>Start Revision</button>
              </div>
            ))}
          </div>
        ) : (
          /* Active Quiz Dashboard */
          <div className="card" style={{ maxWidth: 600, width: '100%', padding: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Header progress info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <button className="btn btn-ghost" onClick={() => setBankKey(null)} style={{ fontSize: 12 }}>← Quit</button>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                Progress: {qIdx + 1} / {QUIZ_BANKS[bankKey].questions.length}
              </div>
            </div>

            {!quizDone ? (
              /* Question Step */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Question */}
                <h2 style={{ color: 'var(--text-bright)', fontSize: 20, fontWeight: 800, lineHeight: 1.4 }}>
                  {QUIZ_BANKS[bankKey].questions[qIdx].q}
                </h2>

                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {QUIZ_BANKS[bankKey].questions[qIdx].a.map((opt, idx) => {
                    const isSelected = selectedOpt === idx;
                    const isCorrect = idx === QUIZ_BANKS[bankKey].questions[qIdx].c;
                    
                    let bg = 'var(--surface)';
                    let border = '1px solid var(--border)';
                    let color = 'var(--text)';

                    if (isSelected) {
                      bg = 'var(--cyan-dim)';
                      border = '1px solid var(--cyan)';
                      color = 'var(--cyan)';
                    }
                    if (submitted) {
                      if (isCorrect) {
                        bg = 'rgba(16,185,129,0.1)';
                        border = '1px solid var(--green)';
                        color = 'var(--green)';
                      } else if (isSelected) {
                        bg = 'rgba(239,68,68,0.1)';
                        border = '1px solid #ef4444';
                        color = '#ef4444';
                      }
                    }

                    return (
                      <button 
                        key={idx}
                        onClick={() => selectOption(idx)}
                        disabled={submitted}
                        style={{
                          textAlign: 'left', padding: '14px 20px', borderRadius: 12,
                          background: bg, border: border, color: color, fontSize: 14, fontWeight: 600,
                          cursor: submitted ? 'default' : 'pointer', transition: 'all 0.15s'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Context */}
                {submitted && (
                  <div style={{
                    padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                    borderRadius: 12, fontSize: 13, lineHeight: 1.5, color: 'var(--text)'
                  }}>
                    💡 <strong>Insight:</strong> {QUIZ_BANKS[bankKey].questions[qIdx].exp}
                  </div>
                )}

                {/* Control Action Buttons */}
                {!submitted ? (
                  <button className="btn btn-cyan" onClick={submitAnswer} disabled={selectedOpt === null} style={{ width: '100%', padding: 12 }}>
                    Submit Answer
                  </button>
                ) : (
                  <button className="btn btn-purple" onClick={nextQuestion} style={{ width: '100%', padding: 12 }}>
                    {qIdx + 1 < QUIZ_BANKS[bankKey].questions.length ? 'Next Question →' : 'Complete Quiz'}
                  </button>
                )}

              </div>
            ) : (
              /* Quiz Completion Scorecard */
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 0' }}>
                <div style={{ fontSize: 60 }}>🏆</div>
                <h2 style={{ color: 'var(--text-bright)', fontSize: 24, fontWeight: 900 }}>Revision Finished!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                  You answered {score} out of {QUIZ_BANKS[bankKey].questions.length} questions correctly.
                </p>

                {/* Coins feedback */}
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1))',
                  border: '1px solid rgba(255,215,0,0.3)', padding: '16px 24px', borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, maxWidth: 300, margin: '10px auto'
                }}>
                  <span style={{ fontSize: 32 }}>🪙</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--yellow)' }}>+{coinsEarned} Coins</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Added to your wallet!</span>
                  </div>
                </div>

                <button className="btn btn-purple" onClick={() => setBankKey(null)} style={{ marginTop: 10 }}>
                  Back to Subject Selection
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
