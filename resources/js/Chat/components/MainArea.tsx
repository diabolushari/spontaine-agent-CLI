import { useState, useEffect, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi"; // Loading icon
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
    type: "user" | "bot";
    text: string;
    suggestions?: string[];
}

export default function MainArea() {
    const [messages, setMessages] = useState<Message[]>([
        { type: "bot", text: "Hello! How can I assist you today?", suggestions: [] },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const socketRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://${window.location.hostname}:8080/ws?token=xocortx`);
        ws.onopen = () => console.log("✅ WebSocket Connected");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("📩 Received from server:", data);

                const botResponse = data?.response?.response || "⚠️ No valid response found.";
                const suggestedQuestions = data?.response?.suggested_questions || [];

                setMessages((prev) => [
                    ...prev,
                    { type: "bot", text: botResponse, suggestions: suggestedQuestions },
                ]);
            } catch (error) {
                console.error("❌ JSON Parse Error:", error);
                setMessages((prev) => [...prev, { type: "bot", text: "❌ Error processing response.", suggestions: [] }]);
            }
            setIsLoading(false); // Stop loading
        };

        ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
        ws.onclose = () => console.log("❌ WebSocket Disconnected");
        socketRef.current = ws;

        return () => ws.close();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = (presetMessage?: string) => {
        const messageToSend = presetMessage || input.trim();
        if (messageToSend === "" || !socketRef.current) return;

        setMessages((prev) => [...prev, { type: "user", text: messageToSend }]);
        setIsLoading(true); // Start loading effect
        socketRef.current.send(JSON.stringify({ message: messageToSend }));
        setInput("");
    };

    return (
        <main className="flex w-full items-center h-screen bg-gradient-to-r from-[#DEC9E2] to-[#B6C0CF] p-6">
            <div className="flex w-full">
                {/* Sidebar */}
                <aside className="flex flex-col gap-4 self-start w-1/5">
                    <button className="bg-[#D9D9D9] text-gray-700 px-6 py-3 rounded-full shadow-md text-left hover:bg-gray-400 transition-all">
                        SLA Improvement
                    </button>
                    <button className="bg-[#DCE9F2] text-blue-800 px-6 py-3 rounded-full shadow-md text-left hover:bg-blue-300 transition-all">
                        Billing Vs Collection
                    </button>
                </aside>

                <div className="border-r-2 border-white h-auto mx-6"></div>

                {/* Chat Section */}
                <section className="flex flex-col flex-3 px-6 py-6 space-y-4 h-[70vh] overflow-y-auto w-full">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`p-4 rounded-lg shadow-md max-w-[75%] w-fit break-words text-${msg.type === "user" ? "right" : "left"} ${msg.type === "user" ? "bg-[#F7F7E9]" : "bg-white"}`}>
                                {msg.type === "bot" ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                ) : (
                                    msg.text
                                )}

                                {(msg.suggestions ?? []).length > 0 && (
                                    <div className="flex flex-col mt-2">
                                        {msg.suggestions?.map((question, qIndex) => (
                                            <button
                                                key={qIndex}
                                                className="bg-gradient-to-r from-[#FA6B86]/50 via-[#CF5397]/50 to-[#448CBF]/50 p-2 rounded-lg shadow-md text-white mt-1"
                                                onClick={() => handleSendMessage(question)}
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading Effect */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="p-4 rounded-lg shadow-md max-w-[75%] w-fit bg-white text-gray-600 flex items-center gap-2">
                                <BiLoaderAlt className="animate-spin text-xl" />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </section>
            </div>

            {/* Input Bar */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl">
                <div className="bg-white flex items-center shadow-xl rounded-2xl px-4 py-2 w-full border border-gray-300">
                    <span className="font-bold text-gray-600 mr-2 text-sm">ASK</span>
                    <span className="bg-black text-white px-2 py-1 rounded-lg text-xs font-semibold mr-2">AI</span>
                    <input
                        type="text"
                        placeholder="Your message here."
                        className="flex-1 p-2 border-none focus:outline-none text-base bg-transparent w-[85%] break-words overflow-wrap"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button
                        className={`p-2 rounded-full shadow-md ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"} transition-all`}
                        onClick={() => handleSendMessage()}
                        disabled={isLoading}
                    >
                        {isLoading ? <BiLoaderAlt className="animate-spin text-white text-xl" /> : <AiOutlineSend size={18} className="text-white" />}
                    </button>
                </div>
            </div>
        </main>
    );
}
