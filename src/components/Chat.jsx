import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";

function mergeMessages(current, incoming) {
  const unique = new Map(current.map((message) => [message._id, message]));
  for (const message of incoming) unique.set(message._id, message);
  return Array.from(unique.values()).sort((a, b) => a._id.localeCompare(b._id));
}

function Conversation({ targetUserId, userId }) {
  const socketRef = useRef(null);
  const bottom = useRef(null);
  const draftId = useRef(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Connecting…");
  const [error, setError] = useState("");
  const [more, setMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const socket = createSocketConnection(targetUserId);
    socketRef.current = socket;
    socket.on("connect", () => {
      const connectionId = socket.id;
      setStatus("");
      setError("");
      setMessages([]);
      setMore(false);
      socket.timeout(15000).emit("history", null, (err, result) => {
        if (!socket.connected || socket.id !== connectionId) return;
        if (err || result.error) return setError(result?.error || "History timed out. Reopen this chat to retry.");
        setMessages((current) => mergeMessages(current, result.messages));
        setMore(result.more);
      });
    });
    socket.on("messageReceived", (message) => {
      setMessages((current) => mergeMessages(current, [message]));
    });
    socket.on("connect_error", (err) => {
      setStatus(socket.active ? "Reconnecting…" : err.message);
    });
    socket.on("disconnect", (reason) => {
      setStatus(reason === "io server disconnect" ? "Session ended. Log in again to chat." : "Reconnecting…");
    });
    socket.connect();
    return () => {
      socketRef.current = null;
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [targetUserId, userId]);

  const newestId = messages.at(-1)?._id;
  useEffect(() => {
    if (newestId) bottom.current?.scrollIntoView({ block: "nearest" });
  }, [newestId]);

  function loadOlder() {
    const socket = socketRef.current;
    if (!socket?.connected || loadingOlder) return;
    const connectionId = socket.id;
    setLoadingOlder(true);
    socket.timeout(15000).emit("history", messages[0]._id, (err, result) => {
      setLoadingOlder(false);
      if (socket.id !== connectionId) return;
      if (err || result.error) return setError(result?.error || "Could not load older messages.");
      setMessages((current) => mergeMessages(current, result.messages));
      setMore(result.more);
    });
  }

  function send(event) {
    event.preventDefault();
    const socket = socketRef.current;
    if (!socket?.connected || sending || !draft.trim()) return;
    setSending(true);
    setError("");
    draftId.current ??= crypto.randomUUID();
    socket.timeout(15000).emit("sendMessage", { text: draft.trim(), clientId: draftId.current }, (err, result) => {
      setSending(false);
      if (err || result.error) return setError(result?.error || "Delivery unconfirmed. Retry to confirm.");
      setMessages((current) => mergeMessages(current, [result.message]));
      setDraft("");
      draftId.current = null;
    });
  }

  return (
    <section className="mx-auto my-5 flex h-[70vh] w-11/12 max-w-3xl flex-col rounded-lg border border-base-300 bg-base-100">
      <header className="border-b border-base-300 p-4">
        <h1 className="text-xl font-bold">Chat</h1>
        {status && <p role="status">{status}</p>}
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {more && <button className="btn btn-sm" disabled={loadingOlder || !!status} onClick={loadOlder}>Load earlier messages</button>}
        {messages.map((message) => (
          <div key={message._id} className={"chat " + (message.senderId === userId ? "chat-end" : "chat-start")}>
            <div className="chat-header">{message.senderName}</div>
            <div className="chat-bubble whitespace-pre-wrap break-words">{message.text}</div>
            <time className="chat-footer text-xs opacity-70" dateTime={message.createdAt}>
              {new Date(message.createdAt).toLocaleString()}
            </time>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      {error && <p role="alert" className="px-4 text-error">{error}</p>}
      <form onSubmit={send} className="flex gap-2 border-t border-base-300 p-4">
        <input aria-label="Message" placeholder="Write a message" maxLength={2000} disabled={sending}
          value={draft} onChange={(event) => { setDraft(event.target.value); draftId.current = null; }}
          className="input input-bordered min-w-0 flex-1" />
        <button className="btn btn-primary" disabled={!!status || sending || !draft.trim()}>Send</button>
      </form>
    </section>
  );
}

export default function Chat() {
  const { targetUserId } = useParams();
  const userId = useSelector((store) => store.user?._id);
  if (!userId) return null;
  return <Conversation key={userId + targetUserId} userId={userId} targetUserId={targetUserId} />;
}
