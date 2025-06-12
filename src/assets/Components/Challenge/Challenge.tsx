import React, { useEffect, useState } from "react";

type Challenge = {
    question: string;
    answer: string;
};

const generateChallenge = (): Challenge => {
    const challenges: Challenge[] = [
        { question: "¿Cuánto es 3 + 5?", answer: "8" },
        { question: "¿Cuánto es 10 - 4?", answer: "6" },
        { question: "¿Cuál es la primera letra de la palabra 'Ágora'?", answer: "a" },
        { question: "¿Cuánto es 2 x 3?", answer: "6" },
        { question: "¿Cuánto es 12 dividido entre 4?", answer: "3" },
        { question: "¿Qué día viene después de lunes?", answer: "martes" },
        { question: "¿Cuánto es 7 + 2?", answer: "9" },
        { question: "¿Cuánto es 5 - 3?", answer: "2" },
    ];
    return challenges[Math.floor(Math.random() * challenges.length)];
};

interface HumanChallengeProps {
    onVerify: (isCorrect: boolean) => void;
}

const HumanChallenge: React.FC<HumanChallengeProps> = ({ onVerify }) => {
    const [challenge, setChallenge] = useState<Challenge>(generateChallenge());
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setChallenge(generateChallenge());
        setAnswer("");
        setError("");
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value);
        setError("");
    };

    const handleBlur = () => {
        if (
            answer.trim().toLowerCase() ===
            challenge.answer.trim().toLowerCase()
        ) {
            onVerify(true);
            setError("");
        } else {
            onVerify(false);
            setError("Incorrect answer.");
        }
    };

    return (
        <div>
            <label>
                {challenge.question}
                <input
                    type="text"
                    value={answer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                />
            </label>
            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
};

export default HumanChallenge;