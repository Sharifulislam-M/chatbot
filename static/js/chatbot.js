require("dotenv").config();
class LiveChatWidget {
  constructor() {
    this.apiKey = process.env.API_KEY; // put your API Key

    this.apiUrl = "https://api.openai.com/v1/chat/completions";
    this.init();
  }

  init() {
    this.createChatButton();
    this.createChatBox();
    this.addEventListeners();
  }

  createChatButton() {
    this.chatButton = document.createElement("div");
    this.chatButton.innerText = "💬 Chat with us";
    this.chatButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      padding: 10px 15px;
      border-radius: 25px;
      cursor: pointer;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    `;
    document.body.appendChild(this.chatButton);
  }

  createChatBox() {
    this.chatBox = document.createElement("div");
    this.chatBox.innerHTML = `
      <div style="background: #007bff; color: white; padding: 10px; text-align: center;">Chatbot</div>
      <div id="chatContent" style="padding: 10px; height: 200px; overflow-y: auto; background: white;"></div>
      <div style="display: flex; align-items: center; padding: 5px;">
        <input type="text" id="chatInput" placeholder="Type a message..." style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
        <button id="sendMessage" style="background: #007bff; border: none; color: white; padding: 8px; border-radius: 50%; cursor: pointer; margin-left: 5px;">
          ➤
        </button>
      </div>
      <button id="whatsappButton" style="width: 100%; padding: 10px; background: #25d366; color: white; border: none; cursor: pointer;">Chat on WhatsApp</button>
    `;
    this.chatBox.style.cssText = `
      display: none;
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 300px;
      border-radius: 5px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
      background: #f8f9fa;
    `;
    document.body.appendChild(this.chatBox);
  }

  addEventListeners() {
    this.chatButton.addEventListener("click", () => {
      this.chatBox.style.display =
        this.chatBox.style.display === "none" ? "block" : "none";
    });

    document.getElementById("sendMessage").addEventListener("click", () => {
      this.sendMessage();
    });

    document.getElementById("chatInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });

    document.getElementById("whatsappButton").addEventListener("click", () => {
      window.open("https://wa.me/01738122516", "_blank");
    });
  }

  sendMessage() {
    let chatInput = document.getElementById("chatInput");
    let chatContent = document.getElementById("chatContent");
    if (chatInput.value.trim() !== "") {
      let message = `<div style='text-align: right; margin: 5px; padding: 5px; background: #d1ecf1; border-radius: 5px;'>${chatInput.value}</div>`;
      chatContent.innerHTML += message;
      chatInput.value = "";
      this.getAIResponse(message);
    }
  }

  async getAIResponse(message) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
          max_tokens: 100,
        }),
      });
      const data = await response.json();
      console.log(data); // Debugging
      const aiReply =
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that.";
      setTimeout(() => {
        document.getElementById(
          "chatContent"
        ).innerHTML += `<div style='text-align: left; margin: 5px; padding: 5px; background: #f8d7da; border-radius: 5px;'>${aiReply}</div>`;
      }, 1000);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  }
}

new LiveChatWidget();
