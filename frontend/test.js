const { jsPDF } = await import("jspdf");

async function getBase64FromUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function generatePDF(questions) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Generated Exam Paper", 105, y, { align: "center" });

  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  for (const [index, q] of questions.entries()) {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    // wrap question text
    const splitText = doc.splitTextToSize(`${index + 1}. ${q.questionText}`, 180);
    doc.text(splitText, 10, y);
    y += splitText.length * 6 + 4;

    // add image if exists
    if (q.picture) {
      try {
        const imgData = await getBase64FromUrl(q.picture);
        doc.addImage(imgData, "PNG", 10, y, 80, 60);
        y += 65;
      } catch (err) {
        doc.text("[Image not available]", 10, y);
        y += 8;
      }
    }

    // add options
    q.options.forEach((opt) => {
      doc.text(opt, 14, y);
      y += 6;
    });

    y += 8; // extra spacing after each question
  }

  doc.save("Generated_Exam.pdf");
}

// Example call
let questions= [
    {
        "_id": "68e64dfcdb854ffc039ecc0a",
        "questionText": "Let A ∈ M_n(C) be a normal matrix. Consider the following statements: I. If all the eigenvalues of A are real, then A is Hermitian. II. If all the eigenvalues of A have absolute value 1, then A is unitary. Which one of the following is correct?",
        "picture": null,
        "options": [
            "A) Both I and II are TRUE",
            "B) I is TRUE and II is FALSE",
            "C) I is FALSE and II is TRUE",
            "D) Both I and II are FALSE"
        ],
        "answer": "A",
        "score": 1,
        "questionType": "MCQ",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2024
        },
        "chapter": "Linear Algebra",
        "topic": "Normal, Hermitian and Unitary Matrices",
        "difficultyLvl": "Medium",
        "__v": 0
    },
    {
        "_id": "68e64dfcdb854ffc039ecc26",
        "questionText": "Let r : [0,1] → R² be a continuously differentiable path from (0,2) to (3,0) and let F : R² → R² be defined by F(x,y) = (1−2y, 1−2x). The line integral of F along r, ∫ F · dr, is equal to (round off to TWO decimal places).",
        "picture": null,
        "options": [],
        "answer": "0.99 to 1.01",
        "score": 2,
        "questionType": "NAT",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2024
        },
        "chapter": "Calculus",
        "topic": "Line Integrals",
        "difficultyLvl": "Medium",
        "__v": 0
    },
    {
        "_id": "68e547c21d86f6f3cb106d02",
        "questionText": "Consider the following Linear Programming Problem P:\nMinimize 3x1 + 4x2\nsubject to x1 − x2 ≤ 1,\nx1 + x2 ≥ 3,\nx1 ≥ 0, x2 ≥ 0.\nThe optimal value of the problem P is _____________.",
        "picture": null,
        "options": [],
        "answer": "10",
        "score": 1,
        "questionType": "NAT",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2023
        },
        "chapter": "Linear Programming",
        "topic": "Optimization",
        "difficultyLvl": "Medium",
        "__v": 0
    },
    {
        "_id": "68e547c21d86f6f3cb106cf7",
        "questionText": "Let T : ℝ³ → ℝ³ be a linear transformation satisfying T(1, 0, 0) = (0, 1, 1), T(1, 1, 0) = (1, 0, 1) and T(1, 1, 1) = (1, 1, 2). Then",
        "picture": null,
        "options": [
            "A) T is one-one but T is NOT onto",
            "B) T is one-one and onto",
            "C) T is NEITHER one-one NOR onto",
            "D) T is NOT one-one but T is onto"
        ],
        "answer": "C",
        "score": 1,
        "questionType": "MCQ",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2023
        },
        "chapter": "Linear Transformations",
        "topic": "Linear Algebra",
        "difficultyLvl": "Medium",
        "__v": 0
    },
    {
        "_id": "68e547c21d86f6f3cb106d1a",
        "questionText": "Let Ω be the disk 𝑥² + 𝑦² < 4 in ℝ² with boundary 𝜕Ω. If 𝑢(𝑥, 𝑦) is the solution of the Dirichlet problem \n 𝜕²𝑢/𝜕𝑥² + 𝜕²𝑢/𝜕𝑦² = 0, (𝑥, 𝑦) ∈ Ω,\n 𝑢(𝑥, 𝑦) = 1 + 2 𝑥², (𝑥, 𝑦) ∈ 𝜕Ω,\nthen the value of 𝑢(0,1) is _____________.",
        "picture": null,
        "options": [],
        "answer": "4",
        "score": 2,
        "questionType": "NAT",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2023
        },
        "chapter": "Partial Differential Equations",
        "topic": "Dirichlet Problem and Harmonic Functions",
        "difficultyLvl": "Medium",
        "__v": 0
    },
    {
        "_id": "68e64dfcdb854ffc039ecc1c",
        "questionText": "Let X be the normed space (R^2, ||·||), where ||(x,y)|| = |x| + |y|, (x,y) ∈ R^2. Let S = {(x,0) : x ∈ R} and f : S → R be given by f((x,0)) = 2x for all x ∈ R. Recall that a Hahn–Banach extension of f to X is a continuous linear functional F on X such that F|_S = f and ||F|| = ||f||, where ||F|| and ||f|| are the norms of F and f on X and S, respectively. Which of the following is/are true?\n(A) F(x,y) = 2x + 3y is a Hahn–Banach extension of f to X\n(B) F(x,y) = 2x + y is a Hahn–Banach extension of f to X\n(C) f admits infinitely many Hahn–Banach extensions to X\n(D) f admits exactly two distinct Hahn–Banach extensions to X",
        "picture": null,
        "options": [
            "A) F(x,y) = 2x + 3y is a Hahn–Banach extension of f to X",
            "B) F(x,y) = 2x + y is a Hahn–Banach extension of f to X",
            "C) f admits infinitely many Hahn–Banach extensions to X",
            "D) f admits exactly two distinct Hahn–Banach extensions to X"
        ],
        "answer": "B,C",
        "score": 2,
        "questionType": "MSQ",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2024
        },
        "chapter": "Functional Analysis",
        "topic": "Hahn–Banach Theorem",
        "difficultyLvl": "Medium",
        "__v": 0
    },
    {
        "_id": "68e547c21d86f6f3cb106cf8",
        "questionText": "Let 𝔻 = { z ∈ ℂ : |z| < 1} and f: 𝔻 → ℂ be defined by f(z) = z – 25z³/5! + z⁵/7! − z⁷/9! + z⁹/11!. Consider the following statements: P: f has three zeros (counting multiplicity) in 𝔻. Q: f has one zero in 𝕌 = { z ∈ ℂ : 1/2 < |z| < 1}. Then",
        "picture": "http://res.cloudinary.com/dooaabxbs/image/upload/v1759840937/ukitrhowmednuenrcahd.png",
        "options": [
            "A) P is TRUE but Q is FALSE",
            "B) P is FALSE but Q is TRUE",
            "C) both P and Q are TRUE",
            "D) both P and Q are FALSE"
        ],
        "answer": "A",
        "score": 1,
        "questionType": "MCQ",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2023
        },
        "chapter": "Zeros of Functions",
        "topic": "Complex Analysis",
        "difficultyLvl": "Hard",
        "__v": 0
    },
    {
        "_id": "68e64dfcdb854ffc039ecc04",
        "questionText": "Consider the following limit lim_{ε→0} ∫_0^∞ e^{−x/ε} cos(3x) + x^2 + x + 4 dx. Which one of the following is correct?",
        "picture": "http://res.cloudinary.com/dooaabxbs/image/upload/v1759922807/fumrqi2fjr254pw8gk13.png",
        "options": [
            "A) The limit does not exist",
            "B) The limit exists and is equal to 0",
            "C) The limit exists and is equal to 3",
            "D) The limit exists and is equal to π"
        ],
        "answer": "C",
        "score": 1,
        "questionType": "MCQ",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2024
        },
        "chapter": "Calculus",
        "topic": "Limits and Integrals",
        "difficultyLvl": "Medium",
        "__v": 0
    },
    {
        "_id": "68e64dfcdb854ffc039ecc17",
        "questionText": "Consider the initial value problem (IVP): y' = e^(−y^2) + 1, y(0) = 0.\nI. IVP has a unique solution on R.\nII. Every solution of IVP is bounded on its maximal interval of existence.\nWhich one of the following is correct?",
        "picture": null,
        "options": [
            "A) Both I and II are TRUE",
            "B) I is TRUE and II is FALSE",
            "C) I is FALSE and II is TRUE",
            "D) Both I and II are FALSE"
        ],
        "answer": "B",
        "score": 2,
        "questionType": "MCQ",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2024
        },
        "chapter": "Ordinary Differential Equations",
        "topic": "Initial Value Problems",
        "difficultyLvl": "Medium",
        "__v": 0
    },
    {
        "_id": "68e547c21d86f6f3cb106ceb",
        "questionText": "The village was nestled in a green spot, _______ the ocean and the hills.",
        "picture": null,
        "options": [
            "A) through",
            "B) in",
            "C) at",
            "D) between"
        ],
        "answer": "D",
        "score": 1,
        "questionType": "MCQ",
        "exam": {
            "category": "GATE",
            "branch": "Mathematics (MA)",
            "year": 2023
        },
        "chapter": "General Aptitude(GA)",
        "topic": "English Grammar",
        "difficultyLvl": "Easy",
        "__v": 0
    }
]
generatePDF(questions);
