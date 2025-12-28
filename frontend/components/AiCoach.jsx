import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Context } from "../context/context";

const AiCoach = () => {
  const [input, setinput] = useState("");
  const [messages, setmessages] = useState([]);
  const [loading, seloading] = useState(false);
  const { id,url } = useContext(Context);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (!id) return;

    async function getresponse() {
      const response = await axios.get(
        `${url}/getresponse/${id}`
      );
      
      try {
        const formatted = response.data.map((msg) => {
          const cleaned = msg.sender === 'ai' ?  msg.message.replace(/["{},]/g, "") : msg.message;
          return {
            [msg.sender]: cleaned
          }
          
          
        });
        setmessages(formatted);
      } catch (error) {
        console.log(error);
      }
    }

    getresponse();
  }, [id]);

  const sendinput = async () => {
  if (!input.trim()) return;

  const userInput = input;
  setmessages(prev => [...prev, { you: userInput }]);
console.log(userInput)
  setinput("");

  try {
    seloading(true);

    const result = await axios.post(`${url}/aicoach`, {
      input: userInput,
      id: id,
    });

    setmessages(prev => [...prev, { ai: result.data.message }]);

    seloading(false);
  } catch (err) {
    console.log(err);
    seloading(false);
  }
};

  return (
    <div className="flex pt-25 pb-2 justify-center items-center min-h-screen  px-4 text-white">
      <div className="w-full  h-[80vh]  border border-gray-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* CHAT AREA */}
        {messages.length !== 0 ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.you && (
                  <div className="flex justify-end">
                    <div className="bg-blue-900 px-4 py-2 rounded-xl max-w-[70%] text-sm">
                      {msg.you}
                    </div>
                  </div>
                )}

                {msg.ai && (
                  <div className="flex justify-start">
                    <div className="bg-violet-800 px-4 py-2 rounded-xl  max-w-[70%] text-sm">
                      {msg.ai}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-center py-4">
                <DotLottieReact
                  src="https://lottie.host/a8348043-86bd-43f0-8f04-54137a7e234e/JbKuIzqqgd.json"
                  loop
                  autoplay
                  style={{ width: 200 }}
                />
              </div>
            )}

            <div ref={endRef}></div>
          </div>
        ) : (
          <div className="flex w-full h-full justify-center items-center font-extrabold text-3xl">
            Let’s get started ⚡
          </div>
        )}

        <div className="p-4 border-t border-gray-800 bg-[#151515] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setinput(e.target.value)}
            placeholder="Ask your AI Coach..."
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendinput();
              }
            }}
          />

          <button
            onClick={sendinput}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition text-white cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCoach;

