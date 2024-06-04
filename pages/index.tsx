import React, { useState } from 'react';

const ChatComponent: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return; // 空のメッセージは送信しない

    setLoading(true);

    const userMessage = { role: 'user', content: prompt };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    console.log('Current messages:', newMessages.slice(-5)); // 最新の5件を表示
    setPrompt('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, messages: newMessages.slice(-5) }), // 最新の5件のみ送信
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error fetching the response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Error fetching response from ChatGPT' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Chat with GPT</h1>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{message.role === 'user' ? 'You' : 'GPT'}:</strong> {message.content}
          </div>
        ))}
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        style={{ width: '100%', height: '50px' }}
      />
      <button onClick={handleSubmit} style={{ width: '100%', padding: '10px' }} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  );
};

export default ChatComponent;
