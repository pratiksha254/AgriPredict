async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  // Show user message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.textContent = "👤 " + userMessage;
  chatBox.appendChild(userDiv);

  inputField.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Fetch response from Ollama
  const responseDiv = document.createElement("div");
  responseDiv.className = "message bot";
  responseDiv.textContent = "🤖 Thinking...";
  chatBox.appendChild(responseDiv);

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2",
        prompt: `You are "CropMate", an expert agriculture assistant. 
- Always introduce yourself as CropMate if asked "who are you" or similar.  
- Provide answers in concise, clear, and formatted manner.  
- Use bullet points or short paragraphs where possible. 
- leave line space after each point. 
- Focus only on relevant agricultural advice.  

User: ${userMessage}  
CropMate:`
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botReply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.trim().split("\n");
      for (let line of lines) {
        if (!line) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            botReply += parsed.response;
            responseDiv.textContent = "🤖 " + botReply;
            chatBox.scrollTop = chatBox.scrollHeight;
          }
        } catch (err) {
          console.error("Error parsing:", line);
        }
      }
    }
  } catch (err) {
    responseDiv.textContent = "❌ Error: Could not connect to Ollama.";
  }
}
