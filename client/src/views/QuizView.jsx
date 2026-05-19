import { useState, useEffect } from 'react';
import { api } from '../api';

const SUBJECT_BANKS = {
  python: {
    title: '🐍 Python Core',
    questions: [
      { q: 'What is the output of print(2 ** 3)?', a: ['8', '6', '9', '5'], c: 0, exp: 'The ** operator represents exponentiation.' },
      { q: 'Which data structure is mutable in Python?', a: ['Tuple', 'List', 'String', 'Integer'], c: 1, exp: 'Lists can be altered after creation (mutable).' },
      { q: 'How do you define a function in Python?', a: ['function myFunc()', 'def myFunc():', 'void myFunc()', 'func myFunc()'], c: 1, exp: 'The "def" keyword is used to declare functions.' },
      { q: 'What does the len() function do?', a: ['Finds max', 'Returns length/item count', 'Deletes items', 'Generates numbers'], c: 1, exp: 'len() returns the number of items in a collection.' }
    ]
  },
  cpp: {
    title: '⚙️ C++ Programming',
    questions: [
      { q: 'Which operator is used to access memory address of a variable?', a: ['*', '&', '->', '&&'], c: 1, exp: 'The reference operator (&) returns the memory address.' },
      { q: 'What is a pointer in C++?', a: ['A loop counter', 'A variable storing memory address', 'A compiler flag', 'An array index'], c: 1, exp: 'A pointer stores the memory address of another variable.' },
      { q: 'How do you output text to standard console in C++?', a: ['cout << "Hello";', 'print("Hello");', 'System.out.println("Hello");', 'printf("Hello");'], c: 0, exp: 'std::cout along with stream insertion is standard in C++.' }
    ]
  },
  javascript: {
    title: '⚡ JavaScript Engine',
    questions: [
      { q: 'Which keyword defines a block-scoped local variable in ES6?', a: ['var', 'let', 'global', 'local'], c: 1, exp: 'The "let" keyword declares block-scoped variables.' },
      { q: 'What is the result of typeof NaN?', a: ['"number"', '"undefined"', '"null"', '"nan"'], c: 0, exp: 'NaN belongs to the Number type mathematically in JS.' }
    ]
  },
  react: {
    title: '⚛️ React SPA',
    questions: [
      { q: 'Which hook manages state inside functional components?', a: ['useEffect', 'useMemo', 'useState', 'useRef'], c: 2, exp: 'useState allows state handling inside components.' },
      { q: 'What is Virtual DOM?', a: ['A replica', 'Lightweight memory representation of real DOM', 'An external database', 'A grid'], c: 1, exp: 'React keeps a lightweight virtual representation of real DOM in memory.' }
    ]
  },
  html: {
    title: '🌐 HTML5 Layouts',
    questions: [
      { q: 'Which element represents the main content of a document?', a: ['<section>', '<article>', '<main>', '<div>'], c: 2, exp: '<main> defines the dominant content of the document body.' },
      { q: 'What is the correct HTML element for playing audio files?', a: ['<sound>', '<audio>', '<music>', '<play>'], c: 1, exp: 'The standard HTML5 element for audio is <audio>.' }
    ]
  },
  css: {
    title: '🎨 CSS3 Grid & Flex',
    questions: [
      { q: 'How do you make an element a flex container?', a: ['display: flex;', 'layout: flex;', 'display: grid;', 'float: left;'], c: 0, exp: '"display: flex;" initiates flexbox context.' },
      { q: 'Which CSS property controls text size?', a: ['font-style', 'text-size', 'font-size', 'text-style'], c: 2, exp: '"font-size" controls the visual size of fonts.' }
    ]
  },
  sql: {
    title: '🗄️ SQL Databases',
    questions: [
      { q: 'Which SQL statement selects data from a database?', a: ['GET', 'OPEN', 'SELECT', 'EXTRACT'], c: 2, exp: 'SELECT is used to retrieve data rows.' },
      { q: 'How do you filter rows in SQL?', a: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], c: 0, exp: 'The WHERE clause filters rows based on a condition.' }
    ]
  },
  rust: {
    title: '🦀 Rust Compiler',
    questions: [
      { q: 'What is Rust’s primary memory management model?', a: ['Garbage Collection', 'Manual malloc/free', 'Ownership & Borrowing', 'Reference counting only'], c: 2, exp: 'Rust uses ownership checks at compile-time to guarantee memory safety.' },
      { q: 'Which keyword defines an immutable variable in Rust by default?', a: ['let', 'mut let', 'const mut', 'static'], c: 0, exp: 'Variables declared with "let" are immutable by default.' }
    ]
  },
  docker: {
    title: '🐳 Docker Containers',
    questions: [
      { q: 'Which command builds an image from a Dockerfile?', a: ['docker run', 'docker build', 'docker compose', 'docker image'], c: 1, exp: 'docker build compiles the instructions inside a Dockerfile.' },
      { q: 'What is a Docker container?', a: ['A lightweight virtualization package', 'A virtual machine', 'A compiler', 'A script'], c: 0, exp: 'Containers package application code and dependencies together.' }
    ]
  },
  git: {
    title: '🌿 Git Versioning',
    questions: [
      { q: 'Which command shows the working directory file status?', a: ['git log', 'git status', 'git check', 'git diff'], c: 1, exp: 'git status shows modified and staged files.' },
      { q: 'How do you download branches from remote repository?', a: ['git push', 'git download', 'git fetch', 'git copy'], c: 2, exp: 'git fetch downloads commits and files from remote repositories.' }
    ]
  },
  linux: {
    title: '🐧 Linux Core',
    questions: [
      { q: 'Which command prints the working directory path?', a: ['dir', 'pwd', 'cd', 'ls'], c: 1, exp: 'pwd stands for Print Working Directory.' },
      { q: 'How do you create a new directory?', a: ['mkdir', 'rmdir', 'touch', 'newdir'], c: 0, exp: 'mkdir creates a folder directory.' }
    ]
  },
  typescript: {
    title: '📘 TypeScript Static',
    questions: [
      { q: 'Which file configures TypeScript options?', a: ['package.json', 'tsconfig.json', 'tsconfig.js', 'webpack.config.js'], c: 1, exp: 'tsconfig.json specifies compiler options.' },
      { q: 'What does "unknown" type represent?', a: ['A type-safe equivalent of any', 'An undefined type', 'A type representing null', 'A generic'], c: 0, exp: '"unknown" is type-safe and forces type checks before operations.' }
    ]
  },
  algorithms: {
    title: '⚙️ Algorithms CS',
    questions: [
      { q: 'What is the average time complexity of QuickSort?', a: ['O(N log N)', 'O(N^2)', 'O(log N)', 'O(N)'], c: 0, exp: 'QuickSort runs at O(N log N) on average.' },
      { q: 'Which data structure follows First-In-First-Out (FIFO)?', a: ['Stack', 'Queue', 'Binary Tree', 'Heap'], c: 1, exp: 'Queues process items in a first-in-first-out manner.' }
    ]
  },
  java: {
    title: '☕ Java Enterprise',
    questions: [
      { q: 'What is JVM?', a: ['Java Virtual Machine', 'Java Visual Mode', 'Java Version Manager', 'Java Vector Model'], c: 0, exp: 'JVM executes compiled Java bytecode.' },
      { q: 'Which keyword inherits a class in Java?', a: ['implements', 'extends', 'inherits', 'extends class'], c: 1, exp: 'The "extends" keyword implements class inheritance.' }
    ]
  },
  csharp: {
    title: '🎯 C# & .NET',
    questions: [
      { q: 'What compiles C# code to native bytecode?', a: ['CLR', 'Roslyn', 'JIT', 'CLI'], c: 1, exp: 'Roslyn is the official open-source compiler for C#.' },
      { q: 'Which type represents a value type in C#?', a: ['class', 'struct', 'interface', 'delegate'], c: 1, exp: 'structs are value types stored on the stack.' }
    ]
  },
  security: {
    title: '🛡️ Cyber Security',
    questions: [
      { q: 'What is SQL Injection?', a: ['Injecting custom SQL queries to input fields', 'A virus', 'A network sweep', 'A firewall rule'], c: 0, exp: 'SQLi manipulates backend databases via input payloads.' },
      { q: 'Which hash function is historically insecure?', a: ['SHA-256', 'MD5', 'bcrypt', 'Argon2'], c: 1, exp: 'MD5 is highly vulnerable to hash collision attacks.' }
    ]
  },
  networking: {
    title: '🔌 Web Protocols',
    questions: [
      { q: 'What does DNS stand for?', a: ['Domain Name System', 'Dynamic Net Standard', 'Data Network Suite', 'Domain Node Standard'], c: 0, exp: 'DNS translates readable domain names to IP addresses.' },
      { q: 'Which layer of OSI model does IP address reside?', a: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Physical Layer'], c: 0, exp: 'The Network Layer handles IP addressing and routing.' }
    ]
  },
  rust_advanced: {
    title: '🦀 Rust Memory',
    questions: [
      { q: 'What smart pointer provides reference counting?', a: ['Box', 'Rc', 'RefCell', 'Mutex'], c: 1, exp: 'Rc<T> enables multiple ownership by counting references.' },
      { q: 'Which block compiles unsafe operations?', a: ['unsafe { }', 'bypass { }', 'extern { }', 'direct { }'], c: 0, exp: 'The unsafe block allows pointers dereference and raw operations.' }
    ]
  },
  php: {
    title: '🐘 PHP Backend',
    questions: [
      { q: 'How do you represent variables in PHP?', a: ['var', '$var', 'let var', 'variable'], c: 1, exp: 'All variables in PHP are prefixed with a dollar sign ($).' },
      { q: 'What superglobal array holds form POST values?', a: ['$_POST', '$POST', '$_GET', '$_SERVER'], c: 0, exp: '$_POST collects form inputs submitted via HTTP POST.' }
    ]
  },
  mongodb: {
    title: '🍃 NoSQL MongoDB',
    questions: [
      { q: 'What format does MongoDB store document records?', a: ['XML', 'JSON/BSON', 'CSV', 'YAML'], c: 1, exp: 'MongoDB stores records as binary JSON (BSON).' },
      { q: 'Which command inserts a document?', a: ['insertOne()', 'add()', 'create()', 'push()'], c: 0, exp: 'insertOne() inserts a single BSON document.' }
    ]
  }
};

export default function QuizView() {
  const [bankKey, setBankKey] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [questionsList, setQuestionsList] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // Initialize and randomize/shuffle questions on start
  const startQuiz = (key) => {
    setBankKey(key);
    setQIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setCoinsEarned(0);
    setQuizDone(false);

    // Dynamic Random Shuffling of standard questions
    const bank = SUBJECT_BANKS[key];
    const shuffled = [...bank.questions]
      .sort(() => Math.random() - 0.5)
      .map(q => {
        // Also shuffle options randomly!
        const correctOptText = q.a[q.c];
        const shuffledOpts = [...q.a].sort(() => Math.random() - 0.5);
        const nextCorrectIdx = shuffledOpts.indexOf(correctOptText);
        return {
          q: q.q,
          a: shuffledOpts,
          c: nextCorrectIdx,
          exp: q.exp
        };
      });
    setQuestionsList(shuffled);
  };

  // dynamic real-time AI generation on prompt request!
  const generateAIQuestion = async (topic) => {
    setLoadingAI(true);
    setSubmitted(false);
    setSelectedOpt(null);
    try {
      const prompt = `Generate a single challenging, highly technical multiple choice question about ${topic}. 
Return ONLY a valid stringified JSON object matching this TypeScript interface (DO NOT output any backticks, markdown markers, no comments, or text outside the JSON):
{
  "q": "the question string",
  "a": ["option 0", "option 1", "option 2", "option 3"],
  "c": 2, // integer index of correct option (0 to 3)
  "exp": "clear explanation string"
}`;
      const res = await api.ai.chat([{ role: 'user', content: prompt }]);
      const cleanJson = res.response.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      setQuestionsList([parsed]);
      setBankKey(topic);
      setQIdx(0);
      setQuizDone(false);
    } catch(err) {
      console.error(err);
      alert("AI generator offline or payload error. Loading standard deck.");
      startQuiz('python');
    }
    setLoadingAI(false);
  };

  const selectOption = (idx) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const submitAnswer = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);
    const q = questionsList[qIdx];
    if (selectedOpt === q.c) {
      setScore(s => s + 1);
      setCoinsEarned(c => c + 30); // 30 Coins for dynamic/randomized answers!
      const currentCoins = Number(localStorage.getItem('nexus_coins') || '0');
      localStorage.setItem('nexus_coins', (currentCoins + 30).toString());
    }
  };

  const nextQuestion = () => {
    if (qIdx + 1 < questionsList.length) {
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
        <h1 className="page-title">📝 Revision Quizzes</h1>
        <p className="page-subtitle">Revise with 20 massive randomized subject decks or summon real-time AI generated questions!</p>
      </div>

      <div style={{ flex: 1, marginTop: 24, display: 'flex', justifyContent: 'center', paddingBottom: 40 }}>
        {bankKey === null ? (
          /* Subject Selector */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 950, width: '100%' }}>
            
            {/* AI Generator quick launch */}
            <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(0,229,255,0.1))', border: '1px solid var(--border-hi)' }}>
              <div>
                <h3 style={{ color: 'var(--text-bright)', fontSize: 18, fontWeight: 800 }}>🤖 Dynamic AI Question Summoner</h3>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Summon a real-time, randomly generated AI multiple-choice question on any programming topic!</span>
              </div>
              <button 
                className="btn btn-purple" 
                disabled={loadingAI}
                onClick={() => generateAIQuestion(prompt("Enter any engineering topic (e.g. C++ Pointers, React Hooks, Docker Volumes):") || 'React')}
              >
                {loadingAI ? 'Generating...' : 'Summon AI Question'}
              </button>
            </div>

            <div style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>20 CS SUBJECT DECKS (RANDOMIZED QUESTIONS)</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 20 }}>
              {Object.entries(SUBJECT_BANKS).map(([key, value]) => (
                <div 
                  key={key} 
                  className="card clickable" 
                  style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--border)' }}
                  onClick={() => startQuiz(key)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 24 }}>{value.title.split(' ')[0]}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>RANDOMIZED</span>
                  </div>
                  <h3 style={{ color: 'var(--text-bright)', fontSize: 15, fontWeight: 800, margin: 0 }}>{value.title}</h3>
                  <button className="btn btn-ghost" style={{ width: '100%', fontSize: 11, padding: '6px', marginTop: 'auto' }}>Revise Deck</button>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* Active Question Frame */
          <div className="card" style={{ maxWidth: 600, width: '100%', padding: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <button className="btn btn-ghost" onClick={() => setBankKey(null)} style={{ fontSize: 12 }}>← Quit</button>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                Progress: {qIdx + 1} / {questionsList.length}
              </div>
            </div>

            {loadingAI ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spinner" style={{ margin: '0 auto 20px', width: 40, height: 40 }} />
                <span style={{ color: 'var(--text-muted)' }}>AI Co-Pilot generating dynamic question...</span>
              </div>
            ) : !quizDone ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Question */}
                <h2 style={{ color: 'var(--text-bright)', fontSize: 19, fontWeight: 800, lineHeight: 1.4 }}>
                  {questionsList[qIdx]?.q}
                </h2>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {questionsList[qIdx]?.a.map((opt, idx) => {
                    const isSelected = selectedOpt === idx;
                    const isCorrect = idx === questionsList[qIdx].c;
                    
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

                {/* Explanation */}
                {submitted && (
                  <div style={{
                    padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                    borderRadius: 12, fontSize: 13, lineHeight: 1.5, color: 'var(--text)'
                  }}>
                    💡 <strong>Insight:</strong> {questionsList[qIdx].exp}
                  </div>
                )}

                {/* Controls */}
                {!submitted ? (
                  <button className="btn btn-cyan" onClick={submitAnswer} disabled={selectedOpt === null} style={{ width: '100%', padding: 12 }}>
                    Submit Answer
                  </button>
                ) : (
                  <button className="btn btn-purple" onClick={nextQuestion} style={{ width: '100%', padding: 12 }}>
                    {qIdx + 1 < questionsList.length ? 'Next Question →' : 'Complete Quiz'}
                  </button>
                )}

              </div>
            ) : (
              /* Finish Screen */
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 0' }}>
                <div style={{ fontSize: 60 }}>🏆</div>
                <h2 style={{ color: 'var(--text-bright)', fontSize: 24, fontWeight: 900 }}>Revision Complete!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                  You scored {score} / {questionsList.length} correct answers.
                </p>

                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1))',
                  border: '1px solid rgba(255,215,0,0.3)', padding: '16px 24px', borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, maxWidth: 300, margin: '10px auto'
                }}>
                  <span style={{ fontSize: 32 }}>🪙</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--yellow)' }}>+{coinsEarned} Coins</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Earned dynamically!</span>
                  </div>
                </div>

                <button className="btn btn-purple" onClick={() => setBankKey(null)} style={{ marginTop: 10 }}>
                  Back to Revision Decks
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
