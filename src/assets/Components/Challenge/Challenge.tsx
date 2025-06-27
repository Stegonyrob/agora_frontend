import React, { useEffect, useState } from "react";
import styles from "./Challenge.module.scss";

type ChallengeType = 'math' | 'logic' | 'visual' | 'context';

type Challenge = {
    question: string;
    answer: string;
    type: ChallengeType;
    options?: string[];
    visualData?: {
        colors?: string[];
        shapes?: string[];
        targetColor?: string;
        targetShape?: string;
    };
};

const generateMathChallenge = (): Challenge => {
    const operations = [
        { op: '+', symbol: '+' },
        { op: '-', symbol: '-' },
        { op: '*', symbol: '×' },
        { op: '/', symbol: '÷' }
    ];

    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation.op) {
        case '+':
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 20) + 10;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 9) + 2;
            num2 = Math.floor(Math.random() * 9) + 2;
            answer = num1 * num2;
            break;
        case '/':
            answer = Math.floor(Math.random() * 12) + 2;
            num2 = Math.floor(Math.random() * 8) + 2;
            num1 = answer * num2;
            break;
        default:
            num1 = 5; num2 = 3; answer = 8;
    }

    return {
        question: `¿Cuánto es ${num1} ${operation.symbol} ${num2}?`,
        answer: answer.toString(),
        type: 'math'
    };
};

const generateLogicChallenge = (): Challenge => {
    const logicChallenges = [
        {
            question: "Si hoy es miércoles, ¿qué día será en 3 días?",
            answer: "sábado"
        },
        {
            question: "¿Cuántas letras tiene la palabra 'EDUCACIÓN'?",
            answer: "9"
        },
        {
            question: "¿Qué viene después en la secuencia: 2, 4, 6, 8, ...?",
            answer: "10"
        },
        {
            question: "Si un gato tiene 4 patas, ¿cuántas patas tienen 3 gatos?",
            answer: "12"
        },
        {
            question: "¿Cuál es el color que resulta de mezclar azul y amarillo?",
            answer: "verde"
        },
        {
            question: "¿En qué mes del año hay 28 días?",
            answer: "febrero"
        }
    ];

    const challenge = logicChallenges[Math.floor(Math.random() * logicChallenges.length)];
    return {
        ...challenge,
        type: 'logic'
    };
};

const generateVisualChallenge = (): Challenge => {
    const colors = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠'];
    const colorNames = ['rojo', 'verde', 'azul', 'amarillo', 'morado', 'naranja'];

    const targetIndex = Math.floor(Math.random() * colors.length);
    const targetColor = colors[targetIndex];
    const targetName = colorNames[targetIndex];

    // Crear una secuencia con el color objetivo
    const sequence = [];
    const sequenceLength = Math.floor(Math.random() * 3) + 4; // 4-6 colores
    const targetPosition = Math.floor(Math.random() * sequenceLength);

    for (let i = 0; i < sequenceLength; i++) {
        if (i === targetPosition) {
            sequence.push(targetColor);
        } else {
            let randomColor;
            do {
                randomColor = colors[Math.floor(Math.random() * colors.length)];
            } while (randomColor === targetColor);
            sequence.push(randomColor);
        }
    }

    return {
        question: `¿En qué posición está el círculo ${targetName}? ${sequence.join(' ')} (responde con número: 1, 2, 3...)`,
        answer: (targetPosition + 1).toString(),
        type: 'visual',
        visualData: {
            colors: sequence,
            targetColor: targetName
        }
    };
};

const generateContextChallenge = (): Challenge => {
    const contextChallenges = [
        {
            question: "Completa: 'Ágora' es un centro educativo de...",
            answer: "aprendizaje"
        },
        {
            question: "¿Qué palabra rima con 'educación'?",
            answer: "formación"
        },
        {
            question: "Si estás en un formulario de registro, probablemente quieres crear una...",
            answer: "cuenta"
        }
    ];

    const challenge = contextChallenges[Math.floor(Math.random() * contextChallenges.length)];
    return {
        ...challenge,
        type: 'context'
    };
};

const generateChallenge = (): Challenge => {
    const challengeTypes: ChallengeType[] = ['math', 'logic', 'visual', 'context'];
    const randomType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

    switch (randomType) {
        case 'math':
            return generateMathChallenge();
        case 'logic':
            return generateLogicChallenge();
        case 'visual':
            return generateVisualChallenge();
        case 'context':
            return generateContextChallenge();
        default:
            return generateMathChallenge();
    }
};

interface HumanChallengeProps {
    onVerify: (isCorrect: boolean) => void;
}

const HumanChallenge: React.FC<HumanChallengeProps> = ({ onVerify }) => {
    const [challenge, setChallenge] = useState<Challenge>(generateChallenge());
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); // 60 segundos
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        setChallenge(generateChallenge());
        setAnswer("");
        setError("");
        setAttempts(0);
        setTimeLeft(60);
        setIsTimerActive(true);
        setIsLocked(false);
    }, []);

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isTimerActive && timeLeft > 0 && !isLocked) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setError("Tiempo agotado. Genera un nuevo desafío.");
            setIsLocked(true);
            onVerify(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive, timeLeft, isLocked, onVerify]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLocked) return;
        const newAnswer = e.target.value;
        setAnswer(newAnswer);
        setError("");

        // Validación en tiempo real para números
        if (challenge.type === 'math' && newAnswer.trim() !== '') {
            const userNum = parseFloat(newAnswer.trim());
            const correctNum = parseFloat(challenge.answer.trim());

            if (!isNaN(userNum) && !isNaN(correctNum) && userNum === correctNum) {
                // Respuesta correcta detectada
                onVerify(true);
                setIsTimerActive(false);
                setError("✅ ¡Correcto!");
            }
        }
    };

    const regenerateChallenge = () => {
        setChallenge(generateChallenge());
        setAnswer("");
        setError("");
        setAttempts(0);
        setTimeLeft(60);
        setIsTimerActive(true);
        setIsLocked(false);
        onVerify(false);
    }; const handleBlur = () => {
        if (isLocked || timeLeft === 0) return;

        const userAnswer = answer.trim().toLowerCase();
        const correctAnswer = challenge.answer.trim().toLowerCase();

        // Debug temporal - remover después
        console.log('Debug Challenge:', {
            userAnswer: `"${userAnswer}"`,
            correctAnswer: `"${correctAnswer}"`,
            question: challenge.question,
            match: userAnswer === correctAnswer
        });

        // Validación más robusta
        const isCorrect = userAnswer === correctAnswer ||
            answer.trim() === challenge.answer.trim() ||
            parseFloat(userAnswer) === parseFloat(correctAnswer);

        if (isCorrect) {
            onVerify(true);
            setError("");
            setIsTimerActive(false);
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            onVerify(false);

            if (newAttempts >= 3) {
                setError("Demasiados intentos fallidos. Genera un nuevo desafío.");
                setIsLocked(true);
            } else {
                setError(`Respuesta incorrecta. Tu respuesta: "${answer.trim()}", Correcta: "${challenge.answer}". Intentos restantes: ${3 - newAttempts}`);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.challengeContainer}>
            <div className={styles.challengeHeader}>
                <label htmlFor="challengeInput" className={styles.challengeLabel}>
                    🤖 Verificación Humana
                </label>
                <div className={styles.challengeInfo}>
                    <span className={`${styles.timer} ${timeLeft <= 10 ? styles.timerUrgent : ''}`}>
                        ⏱️ {formatTime(timeLeft)}
                    </span>
                    <span className={styles.attempts}>
                        💡 Intentos: {attempts}/3
                    </span>
                </div>
            </div>

            <div className={styles.questionContainer}>
                <p className={styles.question}>{challenge.question}</p>
                {challenge.type === 'visual' && challenge.visualData && (
                    <div className={styles.visualHint}>
                        <small>Cuenta desde la izquierda (posición 1, 2, 3...)</small>
                    </div>
                )}
            </div>

            <input
                id="challengeInput"
                type="text"
                value={answer}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.challengeInput} ${isLocked ? styles.inputLocked : ''}`}
                placeholder={isLocked ? "Bloqueado - Genera nuevo desafío" : "Escribe tu respuesta aquí..."}
                disabled={isLocked || timeLeft === 0}
                required
            />

            {error && (
                <div className={`${styles.errorMessage} ${error.startsWith('✅') ? styles.successMessage : ''}`}>
                    {error.startsWith('✅') ? error : `❌ ${error}`}
                </div>
            )}

            {(isLocked || timeLeft === 0) && (
                <button
                    type="button"
                    onClick={regenerateChallenge}
                    className={styles.regenerateButton}
                >
                    🔄 Generar Nuevo Desafío
                </button>
            )}

            <div className={styles.challengeFooter}>
                <small className={styles.hint}>
                    💡 Tip: {challenge.type === 'math' && 'Calcula paso a paso'}
                    {challenge.type === 'logic' && 'Piensa lógicamente'}
                    {challenge.type === 'visual' && 'Observa los colores cuidadosamente'}
                    {challenge.type === 'context' && 'Considera el contexto educativo'}
                </small>
            </div>
        </div>
    );
};

export default HumanChallenge;