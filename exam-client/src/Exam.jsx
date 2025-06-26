import React, { useState } from "react";
import axios from "axios";

const ExamPage = () => {
  const [studentName, setStudentName] = useState("");
  const [parentNo, setParentNo] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "What is H2O?",
      options: ["Hydrogen", "Oxygen", "Water", "Helium"],
      selected: "",
      correct: "Water",
    },
    {
      question: "Who discovered gravity?",
      options: ["Einstein", "Newton", "Tesla", "Edison"],
      selected: "",
      correct: "Newton",
    },
  ]);

  const handleOptionSelect = (index, option) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].selected = option;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    const payload = {
      examName: "Weekly Science Test",
      studentName,
      parentNo,
      questions,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/send-result", payload);
      alert("Result sent to parent's WhatsApp!");
    } catch (err) {
      console.error(err);
      alert("Failed to send result.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Exam</h2>
      <input
        type="text"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Parent WhatsApp (+91...)"
        value={parentNo}
        onChange={(e) => setParentNo(e.target.value)}
      />
      <br /><br />

      {questions.map((q, index) => (
        <div key={index}>
          <p>
            <b>{index + 1}. {q.question}</b>
          </p>
          {q.options.map((opt) => (
            <label key={opt} style={{ marginRight: "20px" }}>
              <input
                type="radio"
                name={`q${index}`}
                value={opt}
                checked={q.selected === opt}
                onChange={() => handleOptionSelect(index, opt)}
              />
              {opt}
            </label>
          ))}
          <hr />
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Exam</button>
    </div>
  );
};

export default ExamPage;
