import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import CountUp from "react-countup";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const PASSWORD = "familia123";

export default function AdminPanel() {
  const [input, setInput] = useState("");
  const [logged, setLogged] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [chosen, setChosen] = useState(null);

  const handleLogin = () => {
    if (input === PASSWORD) {
      setLogged(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (logged) {
      supabase
        .from("votes")
        .select("*")
        .order("created_at", { ascending: true })
        .then(({ data, error }) => {
          if (!error) setVotes(data);
        });
    }
  }, [logged]);

  const maleVotes = votes.filter((v) => v.gender === "male");
  const femaleVotes = votes.filter((v) => v.gender === "female");

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-br from-blue-100 to-pink-100 p-4 overflow-y-auto">
      {!logged ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Painel de Admin
            </h2>
            <input
              type="password"
              placeholder="Digite a senha"
              className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Entrar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
            Resumo da Votação
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6">
            <div className="bg-blue-100 p-4 rounded-xl shadow">
              <h3 className="text-xl font-bold text-blue-700">Menino 💙</h3>
              <div className="mt-2 max-h-48 overflow-y-auto pr-2">
                <ul className="list-disc list-inside">
                  {maleVotes.map((v, i) => (
                    <li key={i}>{v.name}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-2 font-semibold">
                {" "}
                Total: <CountUp end={maleVotes.length} duration={1.5} />{" "}
              </p>
            </div>
            <div className="bg-pink-100 p-4 rounded-xl shadow">
              <h3 className="text-xl font-bold text-pink-700">Menina 💖</h3>
              <div className="mt-2 max-h-48 overflow-y-auto pr-2">
                <ul className="list-disc list-inside">
                  {femaleVotes.map((v, i) => (
                    <li key={i}>{v.name}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-2 font-semibold">
                {" "}
                Total: <CountUp end={femaleVotes.length} duration={1.5} />{" "}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setChosen("male")}
              className={`px-4 py-2 rounded-full font-bold text-white shadow-md transition ${
                chosen === "male"
                  ? "bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              É MENINO 💙
            </button>
            <button
              onClick={() => setChosen("female")}
              className={`px-4 py-2 rounded-full font-bold text-white shadow-md transition ${
                chosen === "female"
                  ? "bg-pink-700"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              É MENINA 💖
            </button>
          </div>

          <button
            onClick={() => setReveal(true)}
            disabled={!chosen}
            className={`block mx-auto mt-2 px-6 py-3 rounded-full shadow-lg text-white transition ${
              chosen
                ? "bg-gradient-to-r from-blue-400 to-pink-400 hover:brightness-110"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Liberar Resultado
          </button>
          <div className="mt-6 w-full max-w-xs mx-auto h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Menino 💙", value: maleVotes.length },
                    { name: "Menina 💖", value: femaleVotes.length },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  <Cell fill="#3B82F6" /> {/* Azul */}
                  <Cell fill="#EC4899" /> {/* Rosa */}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {reveal && chosen && (
            <div className="mt-6 text-center text-2xl font-bold text-green-600">
              🎉 Resultado liberado: É{" "}
              {chosen === "male" ? "MENINO 💙" : "MENINA 💖"}!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
