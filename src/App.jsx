import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "./supabaseClient";
import Cookies from "js-cookie";

export default function App() {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hovered, setHovered] = useState(null);

  // Verifica cookie ao montar
  useEffect(() => {
    const alreadyVoted = Cookies.get("alreadyVoted");
    if (alreadyVoted) {
      const [votedName, votedGender] = alreadyVoted.split("|");
      setName(votedName);
      setSelected(votedGender);
      setSubmitted(true);
    }
  }, []);

  // Envia voto
  const handleVote = async (gender) => {
    if (!name.trim()) return alert("Digite seu nome primeiro!");
    if (Cookies.get("alreadyVoted")) return alert("Você já votou!");

    const { error } = await supabase.from("votes").insert([{ name, gender }]);
    if (error) return alert("Erro ao votar. Tente novamente.");

    Cookies.set("alreadyVoted", `${name}|${gender}`, { expires: 365 });
    setSelected(gender);
    setSubmitted(true);
  };

  // Confete pós‑voto
  useEffect(() => {
    if (submitted)
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
  }, [submitted]);

  // Calcular dias restantes até sábado
  const getDaysLeft = () => {
    const today = new Date();
    const saturday = new Date();
    const dayOfWeek = today.getDay(); // 0 = domingo, 6 = sábado
    const daysToSaturday = (6 - dayOfWeek + 7) % 7;
    saturday.setDate(today.getDate() + daysToSaturday);
    const diff = Math.ceil((saturday - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysLeft = getDaysLeft();

  const isLastDay = daysLeft === 1;

  return (
    <div className="h-screen w-screen font-sans flex flex-col sm:flex-row overflow-hidden">
      {/* Tela de votação */}
      {!submitted && (
        <>
          {/* MENINO */}
          <div
            className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
              hovered === "male"
                ? "bg-gradient-to-br from-blue-600 to-blue-800"
                : "bg-gradient-to-br from-blue-400 to-blue-500"
            }`}
            onMouseEnter={() => setHovered("male")}
            onMouseLeave={() => setHovered(null)}
          >
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="w-10/12 max-w-xs text-white text-2xl font-bold px-6 py-4 bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xl ring-2 ring-white/40"
              onClick={() => handleVote("male")}
            >
              ACHO QUE É MENINO 💙
            </motion.button>
          </div>

          {/* MENINA */}
          <div
            className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
              hovered === "female"
                ? "bg-gradient-to-br from-pink-600 to-pink-800"
                : "bg-gradient-to-br from-pink-400 to-pink-500"
            }`}
            onMouseEnter={() => setHovered("female")}
            onMouseLeave={() => setHovered(null)}
          >
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="w-10/12 max-w-xs text-white text-2xl font-bold px-6 py-4 bg-pink-700 hover:bg-pink-800 rounded-xl shadow-xl ring-2 ring-white/40"
              onClick={() => handleVote("female")}
            >
              ACHO QUE É MENINA 💖
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed bottom-4 inset-x-0 mx-auto w-fit px-6 py-2 rounded-full shadow-lg text-sm sm:text-base font-semibold text-white bg-gray-900/90 backdrop-blur-md ${
              isLastDay ? "animate-pulse" : ""
            }`}
          >
            ⏳ Faltam <span className="font-bold">{daysLeft}</span>{" "}
            {daysLeft === 1 ? "dia" : "dias"} para revelar o segredo!
          </motion.div>

          {/* INPUT NOME */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-full px-4 z-20"
          >
            <input
              className={`mx-auto block w-full max-w-sm px-4 py-3 text-lg text-center rounded-lg border shadow-md focus:ring-4 outline-none transition ${
                hovered === "male"
                  ? "focus:ring-blue-300"
                  : hovered === "female"
                  ? "focus:ring-pink-300"
                  : "focus:ring-gray-300"
              }`}
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </motion.div>
        </>
      )}

      {/* Tela de agradecimento */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={`flex-1 flex items-center justify-center text-white text-4xl font-bold text-center px-4 ${
            selected === "male" ? "bg-blue-700" : "bg-pink-700"
          }`}
        >
          Obrigado por votar, {name.split(" ")[0] || "convidado"}!
        </motion.div>
      )}
    </div>
  );
}
