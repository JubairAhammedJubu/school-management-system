export type AssignmentStatus = "pending" | "submitted" | "graded";

export interface AssignmentRecord {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  assignedDate: string;
  status: AssignmentStatus;
  grade?: string;
  maxMarks: string;
  description: string;
  instructions: string[];
}

export const assignments: AssignmentRecord[] = [
  {
    id: "algebra-problem-set-4",
    title: "Algebra Problem Set 4",
    subject: "Mathematics",
    teacher: "Mr. David Cohen",
    dueDate: "Aug 27, 2026",
    assignedDate: "Aug 20, 2026",
    status: "pending",
    maxMarks: "20",
    description:
      "Solve the quadratic equations covered in Chapter 4 and show your working for each step. Focus on factoring and the quadratic formula.",
    instructions: [
      "Attempt all 10 questions in the worksheet.",
      "Show complete working for full marks.",
      "Submit as a single PDF file.",
    ],
  },
  {
    id: "lab-report-photosynthesis",
    title: "Lab Report: Photosynthesis",
    subject: "Biology",
    teacher: "Ms. Priya Nair",
    dueDate: "Aug 29, 2026",
    assignedDate: "Aug 22, 2026",
    status: "pending",
    maxMarks: "25",
    description:
      "Write a lab report based on last week's photosynthesis experiment, including your hypothesis, method, results, and conclusion.",
    instructions: [
      "Include a labeled diagram of your experimental setup.",
      "Report should be 500-800 words.",
      "Reference at least one external source.",
    ],
  },
  {
    id: "essay-industrial-revolution",
    title: "Essay: Industrial Revolution",
    subject: "History",
    teacher: "Mr. Samuel Otieno",
    dueDate: "Aug 31, 2026",
    assignedDate: "Aug 21, 2026",
    status: "pending",
    maxMarks: "30",
    description:
      "Write an essay analyzing the social and economic impact of the Industrial Revolution on urban populations in 19th-century Europe.",
    instructions: [
      "Minimum 1000 words, typed and double-spaced.",
      "Cite at least three sources in a bibliography.",
      "Submit through the assignment upload portal.",
    ],
  },
  {
    id: "grammar-worksheet-3",
    title: "Grammar Worksheet 3",
    subject: "English",
    teacher: "Mrs. Alina Torres",
    dueDate: "Aug 20, 2026",
    assignedDate: "Aug 14, 2026",
    status: "submitted",
    maxMarks: "15",
    description:
      "Complete the worksheet on subject-verb agreement and punctuation covered in this week's grammar unit.",
    instructions: [
      "Answer all questions directly on the worksheet.",
      "Double-check punctuation in the bonus section.",
    ],
  },
  {
    id: "newtons-laws-quiz-prep",
    title: "Newton's Laws Quiz Prep",
    subject: "Physics",
    teacher: "Dr. Michael Chen",
    dueDate: "Aug 15, 2026",
    assignedDate: "Aug 8, 2026",
    status: "graded",
    grade: "18/20",
    maxMarks: "20",
    description:
      "Practice problem set covering Newton's three laws of motion, in preparation for next week's quiz.",
    instructions: [
      "Complete all practice problems before the quiz.",
      "Review worked examples from class notes.",
    ],
  },
  {
    id: "recursion-practice-set",
    title: "Recursion Practice Set",
    subject: "Computer Science",
    teacher: "Ms. Hannah Lee",
    dueDate: "Aug 12, 2026",
    assignedDate: "Aug 5, 2026",
    status: "graded",
    grade: "20/20",
    maxMarks: "20",
    description:
      "Implement and trace through five recursive functions, including factorial, Fibonacci, and a custom recursive search function.",
    instructions: [
      "Submit source code with comments explaining the base case and recursive case.",
      "Include a short write-up of the time complexity for each function.",
    ],
  },
];

export function getAssignmentById(id: string): AssignmentRecord | undefined {
  return assignments.find((a) => a.id === id);
}