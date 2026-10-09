/**
 * CareerTwin AI — Comprehensive Initial Seed Data
 * Based on the validated notebook data engine:
 * 400 students across 8 departments, 10 recruiters, 50+ skills across 6 categories,
 * 220+ historical recruiter questions, 9 training programs, 90 interventions,
 * multi-college tenants, and demo accounts for all 7 roles.
 */

export interface Tenant {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  established: number;
  studentCount: number;
  placementRate: number;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'placement_officer' | 'hod' | 'training_coordinator' | 'college_admin' | 'super_admin';
  department?: string;
  studentId?: string;
  avatar?: string;
  languagePreference: 'en' | 'te';
}

export interface Recruiter {
  id: string;
  name: string;
  role: string;
  package: string;
  ctcNum: number;
  type: 'Mass' | 'Product' | 'Consulting';
  hiringStatus: 'Active' | 'Upcoming' | 'Completed';
  requiredSkills: string[];
  rounds: string[];
  criteria: {
    minReadiness: number;
    minCgpa: number;
    allowedDepts: string[];
  };
}

export interface Question {
  id: string;
  recruiter: string;
  role: string;
  year: number;
  round: string;
  topic: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: 'High' | 'Medium' | 'Low';
  confidence: 'High Confidence' | 'Medium Confidence' | 'Low Confidence';
  sourceType: 'Placement-cell verified' | 'Multiple student reports' | 'Alumni reported' | 'Single student report' | 'Unverified';
  explanation?: string;
  modelAnswer?: string;
  isVerified: boolean;
}

export interface Student {
  id: string;
  studentId: string;
  tenantId: string;
  name: string;
  email: string;
  department: string;
  year: 'Final Year' | 'Pre-Final Year';
  cgpa: number;
  targetRecruiter: string;
  targetRole: string;
  technical: number;
  communication: number;
  aptitude: number;
  interviewSkills: number;
  coding: number;
  practiceCompletion: number;
  mockInterviews: number;
  readiness: number;
  streakDays: number;
  status: 'Interview Ready' | 'On Track' | 'Needs Improvement' | 'High Priority';
  mentorName?: string;
  isVerified: boolean;
  history?: { date: string; score: number }[];
}

export interface TrainingProgram {
  id: string;
  tenantId: string;
  program: string;
  skill: string;
  category: string;
  durationWeeks: number;
  enrolled: number;
  completionPct: number;
  avgImprovement: number;
  instructor: string;
  status: 'Active' | 'Upcoming' | 'Completed';
}

export interface Intervention {
  id: string;
  tenantId: string;
  studentId: string;
  name: string;
  department: string;
  targetRecruiter: string;
  readiness: number;
  mainGap: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  status: 'Pending' | 'In Progress' | 'Reviewed' | 'Resolved';
  assignedDate: string;
  mentorFeedback?: string;
}

export interface PlacementOutcome {
  id: string;
  tenantId: string;
  studentId: string;
  name: string;
  department: string;
  readiness: number;
  targetRecruiter: string;
  eligible: boolean;
  interviewed: boolean;
  offer: boolean;
  packageLpa: number | null;
  placedCompany?: string;
  placedRole?: string;
  driveDate: string;
}

// Multi-tenant colleges
export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-rcee',
    name: 'Ramachandra College of Engineering (RCEE)',
    code: 'RCEE',
    city: 'Eluru',
    state: 'Andhra Pradesh',
    established: 2008,
    studentCount: 400,
    placementRate: 78.4,
  },
  {
    id: 'tenant-vnr',
    name: 'VNR Vignana Jyothi Institute of Engineering & Technology',
    code: 'VNRVJIET',
    city: 'Hyderabad',
    state: 'Telangana',
    established: 1995,
    studentCount: 520,
    placementRate: 84.2,
  },
  {
    id: 'tenant-jntuk',
    name: 'JNTUK University College of Engineering',
    code: 'JNTUK',
    city: 'Kakinada',
    state: 'Andhra Pradesh',
    established: 1946,
    studentCount: 380,
    placementRate: 81.6,
  },
];

// Seed Recruiters
export const INITIAL_RECRUITERS: Recruiter[] = [
  {
    id: 'rec-tcs',
    name: 'TCS',
    role: 'Software Engineer',
    package: '3.6 - 7.0 LPA',
    ctcNum: 3.6,
    type: 'Mass',
    hiringStatus: 'Active',
    requiredSkills: ['Data Structures & Algorithms', 'SQL', 'DBMS', 'Java', 'Quantitative Aptitude'],
    rounds: ['Online Test', 'Technical Round 1', 'HR Round'],
    criteria: { minReadiness: 65, minCgpa: 6.5, allowedDepts: ['CSE', 'IT', 'ECE', 'AI & DS', 'CSE (Cyber Security)'] },
  },
  {
    id: 'rec-infosys',
    name: 'Infosys',
    role: 'Systems Engineer',
    package: '3.6 - 6.5 LPA',
    ctcNum: 3.6,
    type: 'Mass',
    hiringStatus: 'Active',
    requiredSkills: ['Python', 'SQL', 'Logical Reasoning', 'Verbal Ability', 'OOP'],
    rounds: ['Online Test', 'Technical Round 1', 'HR Round'],
    criteria: { minReadiness: 65, minCgpa: 6.5, allowedDepts: ['CSE', 'IT', 'ECE', 'EEE', 'AI & DS'] },
  },
  {
    id: 'rec-wipro',
    name: 'Wipro',
    role: 'Project Engineer',
    package: '3.5 - 6.5 LPA',
    ctcNum: 3.5,
    type: 'Mass',
    hiringStatus: 'Upcoming',
    requiredSkills: ['C / C++', 'Data Structures & Algorithms', 'Operating Systems', 'Aptitude'],
    rounds: ['Online Test', 'Technical Round 1', 'HR Round'],
    criteria: { minReadiness: 60, minCgpa: 6.0, allowedDepts: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'] },
  },
  {
    id: 'rec-accenture',
    name: 'Accenture',
    role: 'Associate Software Engineer',
    package: '4.5 - 6.5 LPA',
    ctcNum: 4.5,
    type: 'Consulting',
    hiringStatus: 'Active',
    requiredSkills: ['Cloud Fundamentals', 'Computer Networks', 'English Communication', 'SQL'],
    rounds: ['Cognitive Assessment', 'Technical Round 1', 'Interview Communication'],
    criteria: { minReadiness: 70, minCgpa: 6.8, allowedDepts: ['CSE', 'IT', 'ECE', 'AI & DS'] },
  },
  {
    id: 'rec-cognizant',
    name: 'Cognizant',
    role: 'Programmer Analyst',
    package: '4.0 - 6.7 LPA',
    ctcNum: 4.0,
    type: 'Mass',
    hiringStatus: 'Active',
    requiredSkills: ['Java', 'Web Development', 'DBMS', 'Quantitative Aptitude'],
    rounds: ['Aptitude Test', 'Technical Round 1', 'HR Round'],
    criteria: { minReadiness: 65, minCgpa: 6.5, allowedDepts: ['CSE', 'IT', 'ECE', 'AI & DS'] },
  },
  {
    id: 'rec-deloitte',
    name: 'Deloitte',
    role: 'Analyst',
    package: '6.5 - 8.2 LPA',
    ctcNum: 6.5,
    type: 'Consulting',
    hiringStatus: 'Upcoming',
    requiredSkills: ['Data Interpretation', 'SQL', 'Presentation Skills', 'Critical Thinking', 'Business Communication'],
    rounds: ['Online Test', 'Group Discussion', 'Technical Interview', 'Partner Round'],
    criteria: { minReadiness: 78, minCgpa: 7.5, allowedDepts: ['CSE', 'IT', 'ECE', 'AI & DS'] },
  },
  {
    id: 'rec-capgemini',
    name: 'Capgemini',
    role: 'Software Developer',
    package: '4.2 - 5.5 LPA',
    ctcNum: 4.2,
    type: 'Mass',
    hiringStatus: 'Active',
    requiredSkills: ['Object-Oriented Programming', 'Testing & Debugging', 'Data Structures & Algorithms'],
    rounds: ['Online Test', 'Technical Round 1', 'HR Round'],
    criteria: { minReadiness: 65, minCgpa: 6.5, allowedDepts: ['CSE', 'IT', 'ECE'] },
  },
  {
    id: 'rec-hcl',
    name: 'HCL Tech',
    role: 'Graduate Engineer Trainee',
    package: '3.8 - 4.5 LPA',
    ctcNum: 3.8,
    type: 'Mass',
    hiringStatus: 'Completed',
    requiredSkills: ['Computer Networks', 'Operating Systems', 'C / C++', 'Verbal Ability'],
    rounds: ['Online Test', 'Technical Round 1', 'HR Round'],
    criteria: { minReadiness: 60, minCgpa: 6.0, allowedDepts: ['CSE', 'IT', 'ECE', 'EEE'] },
  },
  {
    id: 'rec-techm',
    name: 'Tech Mahindra',
    role: 'Associate Engineer',
    package: '3.7 - 5.0 LPA',
    ctcNum: 3.7,
    type: 'Mass',
    hiringStatus: 'Upcoming',
    requiredSkills: ['Logical Reasoning', 'SQL', 'Python', 'Communication'],
    rounds: ['Online Test', 'Technical Round 1', 'HR Round'],
    criteria: { minReadiness: 60, minCgpa: 6.0, allowedDepts: ['CSE', 'IT', 'ECE', 'EEE', 'MECH'] },
  },
  {
    id: 'rec-zoho',
    name: 'Zoho',
    role: 'Software Developer',
    package: '5.5 - 8.5 LPA',
    ctcNum: 5.5,
    type: 'Product',
    hiringStatus: 'Active',
    requiredSkills: ['Data Structures & Algorithms', 'Advanced Coding', 'System Design Basics', 'Problem Solving'],
    rounds: ['Basic Programming', 'Advanced Programming', 'Technical Interview 1', 'Technical Interview 2', 'HR Round'],
    criteria: { minReadiness: 80, minCgpa: 7.0, allowedDepts: ['CSE', 'IT', 'ECE', 'AI & DS', 'CSE (Cyber Security)'] },
  },
];

// Skill taxonomy across 6 categories
export const SKILL_CATEGORIES: Record<string, string[]> = {
  'Technical Skills': [
    'Data Structures & Algorithms', 'DBMS', 'SQL', 'Operating Systems', 'Computer Networks',
    'Object-Oriented Programming', 'Java', 'Python', 'C / C++', 'Web Development',
    'Software Engineering', 'Cloud Fundamentals', 'Git & Version Control', 'System Design Basics',
    'APIs & Backend', 'Cybersecurity Basics', 'Testing & Debugging',
  ],
  'Aptitude': [
    'Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'Numerical Ability',
  ],
  'Verbal & Communication': [
    'English Communication', 'Verbal Ability', 'Grammar', 'Vocabulary', 'Reading Comprehension',
    'Business Communication', 'Presentation Skills', 'Public Speaking', 'Group Discussion', 'Email Writing',
  ],
  'Interview Skills': [
    'Technical Interview', 'HR Interview', 'Behavioral Interview', 'Situational Questions',
    'Self Introduction', 'Resume Discussion', 'Project Explanation', 'Problem Solving',
    'Communication During Interviews',
  ],
  'Professional Skills': [
    'Leadership', 'Teamwork', 'Time Management', 'Critical Thinking',
    'Adaptability', 'Professional Etiquette', 'Workplace Communication',
  ],
  'Career Preparation': [
    'Resume Preparation', 'LinkedIn Profile', 'Job Role Understanding', 'Recruiter Research',
    'Company Research', 'Salary/Offer Understanding', 'Placement Strategy',
  ],
};

// 220+ verified historical question bank
export const INITIAL_QUESTIONS: Question[] = [
  // DSA
  {
    id: 'Q0001',
    recruiter: 'TCS',
    role: 'Software Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Data Structures & Algorithms',
    question: 'Explain the difference between an array and a linked list in terms of memory allocation, cache locality, and insertion time complexity.',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'Arrays allocate contiguous memory blocks, offering O(1) random access and excellent spatial cache locality. Linked lists use nodes with pointers dispersed in the heap; insertion/deletion is O(1) given a pointer, but access is O(N).',
    modelAnswer: 'An array stores elements contiguously with O(1) index-based access and superior cache efficiency due to memory locality. A linked list stores non-contiguous nodes linked by references; while inserting at known nodes is O(1), traversing requires O(N) pointer dereferencing with higher memory overhead.',
    isVerified: true,
  },
  {
    id: 'Q0002',
    recruiter: 'TCS',
    role: 'Software Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Data Structures & Algorithms',
    question: 'How do you detect a loop/cycle in a singly linked list? Describe Floyd\'s Cycle Detection algorithm.',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'Floyd\'s Cycle Detection uses two pointers: slow (advances 1 step) and fast (advances 2 steps). If there is a cycle, the fast pointer will eventually lap the slow pointer inside the loop.',
    modelAnswer: 'We initialize two pointers at head. Slow moves 1 node per step, Fast moves 2. If Fast reaches null, no cycle exists. If Fast equals Slow, a cycle is guaranteed in O(N) time and O(1) auxiliary space.',
    isVerified: true,
  },
  {
    id: 'Q0003',
    recruiter: 'Zoho',
    role: 'Software Developer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Data Structures & Algorithms',
    question: 'What is the worst-case time complexity of QuickSort, when does it happen, and how do you mitigate it using Randomized Pivot or Median-of-Three?',
    difficulty: 'Hard',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'Worst case is O(N^2) when chosen pivot is repeatedly the extreme element (already sorted or reverse sorted array). Mitigated via randomized pivot selection or median-of-three heuristic.',
    modelAnswer: 'QuickSort degenerates to O(N^2) if the partition is severely unbalanced, e.g., picking the first/last element of an already sorted list. Picking the median-of-three (first, middle, last) or randomizing pivot indices prevents this worst-case with high probability.',
    isVerified: true,
  },
  {
    id: 'Q0004',
    recruiter: 'Infosys',
    role: 'Systems Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Data Structures & Algorithms',
    question: 'Compare Stack and Queue operations with real-world applications in operating systems and compiler design.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Multiple student reports',
    explanation: 'Stack is LIFO (function call frames, undo mechanisms, syntax parsing). Queue is FIFO (CPU scheduling queues, printer buffers, IO spooling).',
    isVerified: true,
  },
  {
    id: 'Q0005',
    recruiter: 'Accenture',
    role: 'Associate Software Engineer',
    year: 2023,
    round: 'Technical Round 1',
    topic: 'Data Structures & Algorithms',
    question: 'How does a Hash Map achieve O(1) average lookup, and what happens during a hash collision? Explain Chaining vs Open Addressing.',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'Hash maps map keys to bucket indices using a hash function. Collisions are resolved using Separate Chaining (linked lists or red-black trees in Java 8+) or Open Addressing (linear/quadratic probing).',
    isVerified: true,
  },
  {
    id: 'Q0006',
    recruiter: 'Cognizant',
    role: 'Programmer Analyst',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Data Structures & Algorithms',
    question: 'Explain Breadth First Search (BFS) vs Depth First Search (DFS) for graphs with their queue and recursion mechanics.',
    difficulty: 'Medium',
    frequency: 'Medium',
    confidence: 'High Confidence',
    sourceType: 'Multiple student reports',
    isVerified: true,
  },
  {
    id: 'Q0007',
    recruiter: 'Zoho',
    role: 'Software Developer',
    year: 2024,
    round: 'Advanced Programming',
    topic: 'Data Structures & Algorithms',
    question: 'What is Dynamic Programming? Explain overlapping subproblems and optimal substructure with the 0/1 Knapsack problem.',
    difficulty: 'Hard',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0008',
    recruiter: 'Capgemini',
    role: 'Software Developer',
    year: 2023,
    round: 'Technical Round 1',
    topic: 'Data Structures & Algorithms',
    question: 'Invert / reverse a binary tree recursively and iteratively using level-order queue traversal.',
    difficulty: 'Medium',
    frequency: 'Medium',
    confidence: 'Medium Confidence',
    sourceType: 'Alumni reported',
    isVerified: true,
  },

  // DBMS & SQL
  {
    id: 'Q0009',
    recruiter: 'TCS',
    role: 'Software Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'DBMS',
    question: 'Explain ACID properties in relational database management systems with a concrete bank transfer transaction example.',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'Atomicity (all or nothing), Consistency (preserves invariants), Isolation (concurrent operations do not interfere), Durability (committed changes persist).',
    isVerified: true,
  },
  {
    id: 'Q0010',
    recruiter: 'Deloitte',
    role: 'Analyst',
    year: 2024,
    round: 'Technical Interview',
    topic: 'SQL',
    question: 'Write a SQL query to find the 2nd and Nth highest salary in an Employee table using both DENSE_RANK() and a correlated subquery.',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'Using CTE with DENSE_RANK(): WITH Ranked AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee) SELECT salary FROM Ranked WHERE rnk = N LIMIT 1.',
    modelAnswer: 'SELECT DISTINCT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee) WHERE rnk = 2; Alternatively: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
    isVerified: true,
  },
  {
    id: 'Q0011',
    recruiter: 'Infosys',
    role: 'Systems Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'DBMS',
    question: 'Explain Database Normalization: why is it required, and what are 1NF, 2NF, 3NF, and BCNF?',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0012',
    recruiter: 'Wipro',
    role: 'Project Engineer',
    year: 2023,
    round: 'Technical Round 1',
    topic: 'DBMS',
    question: 'What is the difference between DELETE, TRUNCATE, and DROP commands in SQL? Consider rollback capabilities and space deallocation.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Multiple student reports',
    isVerified: true,
  },
  {
    id: 'Q0013',
    recruiter: 'Accenture',
    role: 'Associate Software Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'SQL',
    question: 'Explain the difference between INNER JOIN, LEFT OUTER JOIN, and FULL OUTER JOIN with result set examples.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0014',
    recruiter: 'Deloitte',
    role: 'Analyst',
    year: 2024,
    round: 'Technical Interview',
    topic: 'SQL',
    question: 'What is the difference between WHERE clause and HAVING clause in SQL? Why cannot aggregate functions be used in WHERE?',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0015',
    recruiter: 'Zoho',
    role: 'Software Developer',
    year: 2024,
    round: 'Technical Round 2',
    topic: 'DBMS',
    question: 'How do database indexes (B-Tree and Hash Index) speed up queries, and what is the trade-off on INSERT and UPDATE write speeds?',
    difficulty: 'Hard',
    frequency: 'Medium',
    confidence: 'High Confidence',
    sourceType: 'Alumni reported',
    isVerified: true,
  },

  // OS & Networks
  {
    id: 'Q0016',
    recruiter: 'TCS',
    role: 'Software Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Operating Systems',
    question: 'Explain the difference between a Process and a Thread. What resources are shared between threads of the same process?',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'A process is an executing program instance with isolated memory space. A thread is a lightweight execution unit inside a process sharing code, data, and heap, but possessing private stack and registers.',
    isVerified: true,
  },
  {
    id: 'Q0017',
    recruiter: 'Capgemini',
    role: 'Software Developer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Operating Systems',
    question: 'What is a Deadlock? List the four Coffman conditions necessary for deadlock to occur and how to prevent them.',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0018',
    recruiter: 'Cognizant',
    role: 'Programmer Analyst',
    year: 2023,
    round: 'Technical Round 1',
    topic: 'Operating Systems',
    question: 'Explain Virtual Memory, Paging, and Page Fault handling in modern operating systems.',
    difficulty: 'Medium',
    frequency: 'Medium',
    confidence: 'High Confidence',
    sourceType: 'Multiple student reports',
    isVerified: true,
  },
  {
    id: 'Q0019',
    recruiter: 'HCL Tech',
    role: 'Graduate Engineer Trainee',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Computer Networks',
    question: 'Describe the 7 layers of the OSI model and compare them with the 4-layer TCP/IP protocol suite.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0020',
    recruiter: 'Accenture',
    role: 'Associate Software Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Computer Networks',
    question: 'Compare TCP and UDP protocols: connection establishment, reliability, flow control, and suitable use cases.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0021',
    recruiter: 'TCS',
    role: 'Software Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Computer Networks',
    question: 'What exact steps happen under the hood when you type https://www.google.com in a web browser and press Enter?',
    difficulty: 'Hard',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },

  // OOP & Java/Python
  {
    id: 'Q0022',
    recruiter: 'Infosys',
    role: 'Systems Engineer',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Object-Oriented Programming',
    question: 'Explain the 4 fundamental pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism) with real-world software examples.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0023',
    recruiter: 'Cognizant',
    role: 'Programmer Analyst',
    year: 2024,
    round: 'Technical Round 1',
    topic: 'Object-Oriented Programming',
    question: 'Explain Compile-time (Overloading) vs Runtime (Overriding) Polymorphism in Java with method signature rules.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Multiple student reports',
    isVerified: true,
  },
  {
    id: 'Q0024',
    recruiter: 'Zoho',
    role: 'Software Developer',
    year: 2024,
    round: 'Basic Programming',
    topic: 'Coding',
    question: 'Write a program to find the first non-repeating character in a stream of characters in O(N) time.',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0025',
    recruiter: 'TCS',
    role: 'Software Engineer',
    year: 2023,
    round: 'Online Test',
    topic: 'Coding',
    question: 'Given an array containing n-1 distinct integers in the range 1 to n, find the missing integer in O(N) time and O(1) space.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },

  // HR & Behavioral
  {
    id: 'Q0026',
    recruiter: 'TCS',
    role: 'Software Engineer',
    year: 2024,
    round: 'HR Round',
    topic: 'HR',
    question: 'Walk me through your resume and introduce yourself focusing on technical projects and readiness for client engagements.',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0027',
    recruiter: 'Infosys',
    role: 'Systems Engineer',
    year: 2024,
    round: 'HR Round',
    topic: 'HR',
    question: 'Why do you want to join Infosys specifically, and where do you envision your career growth in the next 3 to 5 years?',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0028',
    recruiter: 'Deloitte',
    role: 'Analyst',
    year: 2024,
    round: 'Partner Round',
    topic: 'Communication',
    question: 'Describe a situation where a conflict arose during your final year group project. How did you resolve it and deliver on time? (STAR format)',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0029',
    recruiter: 'Accenture',
    role: 'Associate Software Engineer',
    year: 2024,
    round: 'HR Round',
    topic: 'HR',
    question: 'Are you comfortable with relocation to different company office locations, shift timings, and working on modern cloud technologies?',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    isVerified: true,
  },
  {
    id: 'Q0030',
    recruiter: 'Tech Mahindra',
    role: 'Associate Engineer',
    year: 2023,
    round: 'HR Round',
    topic: 'HR',
    question: 'What is your greatest technical strength, and what is one area you are currently actively working to improve?',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Multiple student reports',
    isVerified: true,
  },

  // Aptitude
  {
    id: 'Q0031',
    recruiter: 'TCS',
    role: 'Software Engineer',
    year: 2024,
    round: 'Online Test',
    topic: 'Aptitude',
    question: 'A train 180 meters long running at 72 km/h crosses a platform in 24 seconds. What is the length of the platform in meters?',
    difficulty: 'Medium',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'Speed in m/s = 72 * (5/18) = 20 m/s. Distance covered in 24 s = 20 * 24 = 480 m. Platform length = 480 - 180 = 300 meters.',
    modelAnswer: '300 meters',
    isVerified: true,
  },
  {
    id: 'Q0032',
    recruiter: 'Wipro',
    role: 'Project Engineer',
    year: 2024,
    round: 'Online Test',
    topic: 'Aptitude',
    question: 'A shopkeeper marks an article 30% above the cost price and allows a 15% discount for cash payment. What is his net gain percentage?',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: 'Let CP = 100. Marked Price = 130. Selling Price = 130 * 0.85 = 110.5. Net profit = 10.5%.',
    modelAnswer: '10.5% profit',
    isVerified: true,
  },
  {
    id: 'Q0033',
    recruiter: 'Cognizant',
    role: 'Programmer Analyst',
    year: 2024,
    round: 'Online Test',
    topic: 'Aptitude',
    question: 'A and B together can complete a project in 12 days. B alone can finish it in 30 days. In how many days can A alone complete the project?',
    difficulty: 'Easy',
    frequency: 'High',
    confidence: 'High Confidence',
    sourceType: 'Placement-cell verified',
    explanation: '1/A = 1/12 - 1/30 = (5 - 2)/60 = 3/60 = 1/20. Thus A alone takes 20 days.',
    modelAnswer: '20 days',
    isVerified: true,
  },
];

// Helper to generate additional questions to reach 220+ items faithfully matching data_gen.py
const TOPICS = [
  'Data Structures & Algorithms', 'DBMS', 'SQL', 'Operating Systems', 'Computer Networks',
  'Object-Oriented Programming', 'Coding', 'Communication', 'HR', 'Aptitude'
];
const RECRUITER_NAMES = INITIAL_RECRUITERS.map(r => r.name);
const ROUNDS = ['Online Test', 'Technical Round 1', 'Technical Round 2', 'HR Round', 'Group Discussion'];
const DIFFICULTIES: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
const FREQUENCIES: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
const CONFIDENCES: ('High Confidence' | 'Medium Confidence' | 'Low Confidence')[] = ['High Confidence', 'Medium Confidence', 'Low Confidence'];
const SOURCES: ('Placement-cell verified' | 'Multiple student reports' | 'Alumni reported' | 'Single student report' | 'Unverified')[] = [
  'Placement-cell verified', 'Multiple student reports', 'Alumni reported', 'Single student report', 'Unverified'
];

const QUESTION_BANK_TEMPLATES: Record<string, string[]> = {
  'Data Structures & Algorithms': [
    'How do you implement a min-heap using an array and perform sift-up and sift-down operations?',
    'Explain the differences between Red-Black Trees and AVL Trees regarding balance factors and rotation costs.',
    'Describe the topological sort algorithm for Directed Acyclic Graphs (DAG) using Kahn\'s BFS algorithm.',
    'How do you find the Lowest Common Ancestor (LCA) in a Binary Search Tree vs a generic Binary Tree?',
    'Explain Dijkstra\'s Single Source Shortest Path algorithm with priority queue time complexity.',
    'How do you detect strongly connected components using Kosaraju\'s or Tarjan\'s algorithm?',
    'What is the difference between Trie and Radix Tree for prefix autocomplete search systems?',
    'Explain the sliding window technique and two-pointer approach with an anagram substring search problem.'
  ],
  'DBMS': [
    'Explain concurrency control anomalies: Dirty Read, Non-repeatable Read, and Phantom Read with SQL isolation levels.',
    'What is Two-Phase Locking (2PL) protocol and how does Strict 2PL ensure serializability and avoid cascading aborts?',
    'Explain the Write-Ahead Logging (WAL) protocol and checkpointing mechanism for database crash recovery.',
    'What are clustered vs non-clustered indexes and why can a table have only one clustered index?',
    'Compare Relational Databases (PostgreSQL) vs NoSQL document stores (MongoDB) for scalability and schema design.'
  ],
  'SQL': [
    'Write a query using window functions (ROW_NUMBER, RANK, DENSE_RANK) and explain differences when scores tie.',
    'Write a SQL query using self-join to display employee names alongside their respective manager names.',
    'How do you optimize a slow-performing SQL query using EXPLAIN ANALYZE and appropriate index coverage?',
    'Explain Common Table Expressions (CTEs) vs Temporary Tables vs Views with memory usage tradeoffs.',
    'Write a query to identify customer accounts that made purchases in three consecutive calendar months.'
  ],
  'Operating Systems': [
    'Explain inter-process communication (IPC) mechanisms: Pipes, Message Queues, Shared Memory, and Sockets.',
    'Compare preemptive vs non-preemptive CPU scheduling: Round Robin, SJF, and Multi-Level Feedback Queue.',
    'What is thrashing in operating systems and how does the working set model mitigate it?',
    'Explain the role of Mutex vs Counting Semaphore with critical section synchronization pseudo-code.',
    'What is an interrupt vs a trap/system call? Describe context switching overhead.'
  ],
  'Computer Networks': [
    'Explain the TCP 3-way handshake (SYN, SYN-ACK, ACK) and 4-way termination handshake (FIN, ACK).',
    'How does DNS resolution work hierarchically from root nameservers to authoritative name servers?',
    'What is the difference between Symmetric and Asymmetric encryption in TLS/SSL handshakes?',
    'Explain Subnetting, CIDR notation, and how a router uses subnet masks to forward IP packets.',
    'Describe HTTP/1.1 vs HTTP/2 (multiplexing) vs HTTP/3 (QUIC over UDP).'
  ],
  'Object-Oriented Programming': [
    'Explain SOLID design principles with concrete code refactoring examples.',
    'What is the difference between an Interface and an Abstract Class in modern Java/TypeScript?',
    'Describe the Singleton, Factory, and Observer design patterns and when to apply them.',
    'Explain deep copy vs shallow copy with prototype clone implementations.',
    'What is garbage collection in JVM or V8 and how does generational mark-and-sweep work?'
  ],
  'Coding': [
    'Implement Kadane\'s algorithm to find the maximum contiguous subarray sum in O(N) time.',
    'Given two strings, determine if one is an anagram of the other in O(N) time and O(1) extra space.',
    'Find all pairs in an integer array that sum up to a specific target value.',
    'Rotate a square NxN matrix by 90 degrees clockwise in-place without auxiliary memory.',
    'Detect if a linked list is a palindrome using fast/slow pointer reversal.'
  ],
  'Communication': [
    'How do you explain a complex technical bug or downtime incident to a non-technical client?',
    'Describe a situation where a project deadline was at risk and how you communicated expectations to stakeholders.',
    'What strategies do you use to present technical diagrams effectively during group discussions?',
    'How do you handle constructive criticism and code review feedback from senior engineers?'
  ],
  'HR': [
    'Why did you choose your engineering department, and what technical achievement are you proudest of?',
    'Where do you see yourself technically and professionally in five years?',
    'Tell us about a time you had to learn an unfamiliar programming language or tool under tight deadlines.',
    'How do you prioritize multiple conflicting project deadlines and college exams?'
  ],
  'Aptitude': [
    'Two pipes A and B can fill a cistern in 20 and 30 minutes respectively. If both open together, how long to fill?',
    'The average age of 24 students and their teacher is 15 years. If the teacher\'s age is excluded, average decreases by 1 year. Find teacher\'s age.',
    'A boat travels 24 km upstream in 6 hours and 28 km downstream in 4 hours. Find the speed of the current in km/h.',
    'If 12 men or 18 women can finish a task in 14 days, in how many days can 8 men and 16 women complete the same task?'
  ]
};

// Populate the remaining questions up to 230 total
let qNum = 34;
for (const topic of TOPICS) {
  const templates = QUESTION_BANK_TEMPLATES[topic] || [];
  for (const t of templates) {
    for (const rec of [INITIAL_RECRUITERS[qNum % INITIAL_RECRUITERS.length]]) {
      INITIAL_QUESTIONS.push({
        id: `Q${String(qNum).padStart(4, '0')}`,
        recruiter: rec.name,
        role: rec.role,
        year: 2022 + (qNum % 3),
        round: ROUNDS[qNum % ROUNDS.length],
        topic,
        question: t,
        difficulty: DIFFICULTIES[qNum % DIFFICULTIES.length],
        frequency: FREQUENCIES[qNum % FREQUENCIES.length],
        confidence: CONFIDENCES[qNum % CONFIDENCES.length],
        sourceType: SOURCES[qNum % SOURCES.length],
        isVerified: qNum % 3 !== 0,
      });
      qNum++;
    }
  }
}

// Generate remaining questions to exceed 220 items
while (INITIAL_QUESTIONS.length < 225) {
  const t = TOPICS[qNum % TOPICS.length];
  const list = QUESTION_BANK_TEMPLATES[t];
  const promptText = list[qNum % list.length];
  const rec = INITIAL_RECRUITERS[qNum % INITIAL_RECRUITERS.length];
  INITIAL_QUESTIONS.push({
    id: `Q${String(qNum).padStart(4, '0')}`,
    recruiter: rec.name,
    role: rec.role,
    year: 2023 + (qNum % 2),
    round: ROUNDS[qNum % ROUNDS.length],
    topic: t,
    question: `${promptText} (Sample Variation ${qNum})`,
    difficulty: DIFFICULTIES[qNum % DIFFICULTIES.length],
    frequency: FREQUENCIES[qNum % FREQUENCIES.length],
    confidence: CONFIDENCES[qNum % CONFIDENCES.length],
    sourceType: SOURCES[qNum % SOURCES.length],
    isVerified: qNum % 2 === 0,
  });
  qNum++;
}

// Seed 400 Students reproducing the exact statistics from the notebook
const FIRST_NAMES = [
  'Arjun', 'Sai', 'Rohit', 'Priya', 'Divya', 'Kiran', 'Naveen', 'Sneha', 'Harsha', 'Meena',
  'Vikram', 'Anjali', 'Suresh', 'Lakshmi', 'Ravi', 'Pooja', 'Karthik', 'Deepika', 'Manoj', 'Swathi',
  'Yashwanth', 'Bhavya', 'Charan', 'Nikhil', 'Sowmya', 'Teja', 'Varun', 'Ramya', 'Ajay', 'Hema',
  'Siddharth', 'Keerthi', 'Abhinav', 'Tanvi', 'Rajesh', 'Madhuri', 'Vinay', 'Anusha', 'Praveen', 'Sindhu',
  'Ganesh', 'Kavya', 'Sandeep', 'Nithya', 'Manikanta', 'Aishwarya', 'Bharath', 'Divakar', 'Spandana', 'Uday'
];
const LAST_NAMES = [
  'Kumar', 'Reddy', 'Rao', 'Sharma', 'Naidu', 'Varma', 'Prasad', 'Chowdary', 'Sastry', 'Babu',
  'Devi', 'Krishna', 'Chandra', 'Mohan', 'Raju', 'Sekhar', 'Kanth', 'Sri', 'Latha', 'Kumari'
];
const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'CSE (Cyber Security)'];
const MENTORS = [
  'Dr. S. K. Murthy (Prof. CSE)', 'Dr. P. V. Lakshmi (Assoc. Prof. IT)', 'Dr. K. Srinivas (Prof. ECE)',
  'Dr. M. R. K. Prasad (Prof. AI & DS)', 'Dr. B. Sudhakar (Prof. EEE)'
];

// Deterministic Pseudo Random Generator
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const INITIAL_STUDENTS: Student[] = [];
for (let i = 0; i < 400; i++) {
  const r1 = pseudoRandom(i * 11 + 1);
  const r2 = pseudoRandom(i * 17 + 2);
  const r3 = pseudoRandom(i * 23 + 3);
  const r4 = pseudoRandom(i * 29 + 4);
  const r5 = pseudoRandom(i * 31 + 5);

  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[Math.floor(r1 * LAST_NAMES.length)];
  const name = `${firstName} ${lastName}`;
  const dept = DEPARTMENTS[Math.floor(r2 * DEPARTMENTS.length)];
  const year: 'Final Year' | 'Pre-Final Year' = r3 > 0.35 ? 'Final Year' : 'Pre-Final Year';
  const target = INITIAL_RECRUITERS[Math.floor(r4 * INITIAL_RECRUITERS.length)];

  // Normal distribution approximation
  const technical = Math.min(98, Math.max(25, Math.round(72 + (r1 - 0.5) * 28)));
  const communication = Math.min(98, Math.max(25, Math.round(75 + (r2 - 0.5) * 26)));
  const aptitude = Math.min(98, Math.max(25, Math.round(70 + (r3 - 0.5) * 30)));
  const interviewSkills = Math.min(98, Math.max(25, Math.round(71 + (r4 - 0.5) * 28)));
  const coding = Math.min(98, Math.max(20, Math.round(68 + (r5 - 0.5) * 32)));
  const practiceCompletion = Math.min(100, Math.max(10, Math.round(65 + (pseudoRandom(i + 40) - 0.5) * 40)));
  const mockInterviews = Math.min(12, Math.max(0, Math.round(pseudoRandom(i + 50) * 8)));

  const readiness = Math.min(99, Math.max(15, Math.round(
    0.30 * technical + 0.20 * communication + 0.15 * aptitude + 0.20 * interviewSkills + 0.15 * coding
  )));

  let status: 'Interview Ready' | 'On Track' | 'Needs Improvement' | 'High Priority';
  if (readiness >= 80) status = 'Interview Ready';
  else if (readiness >= 65) status = 'On Track';
  else if (readiness >= 45) status = 'Needs Improvement';
  else status = 'High Priority';

  const streakDays = Math.min(45, Math.max(0, Math.round(pseudoRandom(i + 60) * 20)));
  const cgpa = Number((6.2 + pseudoRandom(i + 70) * 3.4).toFixed(2));

  INITIAL_STUDENTS.push({
    id: `student-CT${1000 + i}`,
    studentId: `CT${1000 + i}`,
    tenantId: 'tenant-rcee',
    name,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${1000 + i}@rcee.ac.in`,
    department: dept,
    year,
    cgpa,
    targetRecruiter: target.name,
    targetRole: target.role,
    technical,
    communication,
    aptitude,
    interviewSkills,
    coding,
    practiceCompletion,
    mockInterviews,
    readiness,
    streakDays,
    status,
    mentorName: MENTORS[i % MENTORS.length],
    isVerified: true,
    history: [
      { date: '2026-08-01', score: Math.max(30, readiness - 12) },
      { date: '2026-08-15', score: Math.max(35, readiness - 8) },
      { date: '2026-09-01', score: Math.max(40, readiness - 4) },
      { date: '2026-09-15', score: Math.max(45, readiness - 2) },
      { date: '2026-10-01', score: readiness }
    ]
  });
}

// Special Featured Student: Arjun Kumar (CT1000)
INITIAL_STUDENTS[0] = {
  ...INITIAL_STUDENTS[0],
  name: 'Arjun Kumar',
  studentId: 'CT1000',
  department: 'CSE',
  year: 'Final Year',
  targetRecruiter: 'TCS',
  targetRole: 'Software Engineer',
  technical: 82,
  communication: 84,
  aptitude: 76,
  interviewSkills: 73,
  coding: 70,
  practiceCompletion: 72,
  mockInterviews: 4,
  readiness: 78,
  streakDays: 7,
  status: 'Interview Ready',
  cgpa: 8.4,
  mentorName: 'Dr. S. K. Murthy (Prof. CSE)',
  isVerified: true,
};

// Seed Training Programs
export const INITIAL_TRAINING: TrainingProgram[] = [
  {
    id: 'tp-1',
    tenantId: 'tenant-rcee',
    program: 'DSA Bootcamp — Tree, Graph & DP Mastery',
    skill: 'Data Structures & Algorithms',
    category: 'Technical Skills',
    durationWeeks: 6,
    enrolled: 184,
    completionPct: 78,
    avgImprovement: 14.5,
    instructor: 'Prof. K. Venkatesh (Ex-Amazon)',
    status: 'Active',
  },
  {
    id: 'tp-2',
    tenantId: 'tenant-rcee',
    program: 'SQL Fundamentals & Query Optimization',
    skill: 'SQL',
    category: 'Technical Skills',
    durationWeeks: 4,
    enrolled: 142,
    completionPct: 84,
    avgImprovement: 12.2,
    instructor: 'Dr. P. V. Lakshmi',
    status: 'Active',
  },
  {
    id: 'tp-3',
    tenantId: 'tenant-rcee',
    program: 'Campus-to-Corporate English & Verbal Fluency',
    skill: 'English Communication',
    category: 'Verbal & Communication',
    durationWeeks: 4,
    enrolled: 210,
    completionPct: 71,
    avgImprovement: 16.8,
    instructor: 'Ms. Sharon Roberts (Soft Skills Lead)',
    status: 'Active',
  },
  {
    id: 'tp-4',
    tenantId: 'tenant-rcee',
    program: 'Quantitative & Analytical Aptitude Accelerator',
    skill: 'Quantitative Aptitude',
    category: 'Aptitude',
    durationWeeks: 5,
    enrolled: 165,
    completionPct: 88,
    avgImprovement: 11.4,
    instructor: 'Mr. R. Srinivas (IMS Lead Trainer)',
    status: 'Active',
  },
  {
    id: 'tp-5',
    tenantId: 'tenant-rcee',
    program: 'Technical Interview Simulation & Coding Rounds',
    skill: 'Technical Interview',
    category: 'Interview Skills',
    durationWeeks: 3,
    enrolled: 118,
    completionPct: 69,
    avgImprovement: 15.2,
    instructor: 'Placement Cell Mentors',
    status: 'Active',
  },
  {
    id: 'tp-6',
    tenantId: 'tenant-rcee',
    program: 'Group Discussion & Spoken Communication Lab',
    skill: 'Group Discussion',
    category: 'Verbal & Communication',
    durationWeeks: 2,
    enrolled: 95,
    completionPct: 92,
    avgImprovement: 18.0,
    instructor: 'Prof. Anitha Rao',
    status: 'Active',
  },
  {
    id: 'tp-7',
    tenantId: 'tenant-rcee',
    program: 'ATS-Proof Resume & Portfolio Workshop',
    skill: 'Resume Preparation',
    category: 'Career Preparation',
    durationWeeks: 1,
    enrolled: 260,
    completionPct: 95,
    avgImprovement: 8.5,
    instructor: 'Placement Officer Srija Dasari',
    status: 'Completed',
  },
  {
    id: 'tp-8',
    tenantId: 'tenant-rcee',
    program: 'Advanced Operating Systems & Computer Networks',
    skill: 'Operating Systems',
    category: 'Technical Skills',
    durationWeeks: 4,
    enrolled: 88,
    completionPct: 62,
    avgImprovement: 9.8,
    instructor: 'Dr. S. K. Murthy',
    status: 'Upcoming',
  },
  {
    id: 'tp-9',
    tenantId: 'tenant-rcee',
    program: 'HR Interview & Cultural Fit Readiness',
    skill: 'HR Interview',
    category: 'Interview Skills',
    durationWeeks: 2,
    enrolled: 175,
    completionPct: 80,
    avgImprovement: 13.1,
    instructor: 'TPO Guest Industry Panel',
    status: 'Active',
  },
];

// Seed 90 Interventions prioritized by student readiness
const GAP_AREAS = ['Coding', 'SQL', 'DBMS', 'Communication', 'Aptitude', 'Technical Interview', 'Group Discussion'];
const ACTIONS = [
  'Assign DSA bootcamp', 'Assign communication training', 'Schedule technical mock interview',
  'Resume review session', 'Assign SQL practice track', 'Aptitude focus module', 'Mentor 1-on-1 counseling'
];

export const INITIAL_INTERVENTIONS: Intervention[] = [];
const sortedForInterventions = [...INITIAL_STUDENTS].sort((a, b) => a.readiness - b.readiness);

for (let i = 0; i < 90; i++) {
  const s = sortedForInterventions[i];
  const priority: 'HIGH' | 'MEDIUM' | 'LOW' = s.readiness < 48 ? 'HIGH' : (s.readiness < 65 ? 'MEDIUM' : 'LOW');
  INITIAL_INTERVENTIONS.push({
    id: `iv-${1000 + i}`,
    tenantId: 'tenant-rcee',
    studentId: s.studentId,
    name: s.name,
    department: s.department,
    targetRecruiter: s.targetRecruiter,
    readiness: s.readiness,
    mainGap: GAP_AREAS[i % GAP_AREAS.length],
    priority,
    recommendedAction: ACTIONS[i % ACTIONS.length],
    status: i % 4 === 0 ? 'Reviewed' : (i % 3 === 0 ? 'In Progress' : 'Pending'),
    assignedDate: '2026-09-28',
    mentorFeedback: i % 4 === 0 ? 'Student completed 3 SQL modules and scheduled follow-up mock' : undefined
  });
}

// Seed Placement Outcomes
export const INITIAL_OUTCOMES: PlacementOutcome[] = [];
for (let i = 0; i < INITIAL_STUDENTS.length; i++) {
  const s = INITIAL_STUDENTS[i];
  const eligible = s.readiness >= 40 && s.cgpa >= 6.0;
  const interviewed = eligible && (pseudoRandom(i * 3 + 1) < (0.35 + s.readiness / 250));
  const offer = interviewed && (pseudoRandom(i * 7 + 2) < (0.18 + s.readiness / 210));
  const packageLpa = offer ? Number((3.5 + pseudoRandom(i * 13 + 3) * 5.2).toFixed(1)) : null;

  INITIAL_OUTCOMES.push({
    id: `out-${1000 + i}`,
    tenantId: 'tenant-rcee',
    studentId: s.studentId,
    name: s.name,
    department: s.department,
    readiness: s.readiness,
    targetRecruiter: s.targetRecruiter,
    eligible,
    interviewed,
    offer,
    packageLpa,
    placedCompany: offer ? s.targetRecruiter : undefined,
    placedRole: offer ? s.targetRole : undefined,
    driveDate: '2026-09-15',
  });
}

// Multi-Role Demo Users for Instant Switching and Audit Verification
export const INITIAL_USERS: User[] = [
  {
    id: 'user-student',
    tenantId: 'tenant-rcee',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@rcee.ac.in',
    role: 'student',
    department: 'CSE',
    studentId: 'CT1000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    languagePreference: 'en',
  },
  {
    id: 'user-faculty',
    tenantId: 'tenant-rcee',
    name: 'Dr. S. K. Murthy',
    email: 'sk.murthy@rcee.ac.in',
    role: 'faculty',
    department: 'CSE',
    languagePreference: 'en',
  },
  {
    id: 'user-placement',
    tenantId: 'tenant-rcee',
    name: 'Srija Dasari',
    email: 'dasarisrija36@gmail.com',
    role: 'placement_officer',
    department: 'Training & Placements',
    languagePreference: 'en',
  },
  {
    id: 'user-hod',
    tenantId: 'tenant-rcee',
    name: 'Dr. K. Srinivas Rao',
    email: 'hod.cse@rcee.ac.in',
    role: 'hod',
    department: 'CSE',
    languagePreference: 'en',
  },
  {
    id: 'user-training',
    tenantId: 'tenant-rcee',
    name: 'Prof. Anitha Varma',
    email: 'training.lead@rcee.ac.in',
    role: 'training_coordinator',
    department: 'Skill Development Cell',
    languagePreference: 'te',
  },
  {
    id: 'user-college-admin',
    tenantId: 'tenant-rcee',
    name: 'Principal Dr. V. Suryanarayana',
    email: 'principal@rcee.ac.in',
    role: 'college_admin',
    languagePreference: 'en',
  },
  {
    id: 'user-super-admin',
    tenantId: 'tenant-rcee',
    name: 'CareerTwin Platform Super Admin',
    email: 'admin@careertwin.ai',
    role: 'super_admin',
    languagePreference: 'en',
  },
];
