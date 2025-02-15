document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const chatbotIcon = document.querySelector(".chatbot-icon");
    const chatContainer = document.querySelector(".chat-container");
    const closeChat = document.getElementById("close-chat");

    chatbotIcon.addEventListener("click", function () {
        chatContainer.style.display = chatContainer.style.display === "none" || chatContainer.style.display === "" ? "flex" : "none";
    });

    closeChat.addEventListener("click", function () {
        chatContainer.style.display = "none";
    });

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    async function sendMessage() {
        let message = userInput.value.trim();
        if (!message) return;

        addMessage("user", message);
        userInput.value = "";

        try {
            addTypingIndicator();

            let response = await fetch("/api/chatbot/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message }),
            });

            let data = await response.json();
            removeTypingIndicator();
            typeMessage("bot", data.response);
        } catch (error) {
            removeTypingIndicator();
            typeMessage("bot", "⚠️ Error fetching response.");
        }
    }

    function addMessage(sender, text) {
        let msgDiv = document.createElement("div");
        msgDiv.classList.add(sender === "user" ? "user-message" : "bot-message", "fade-in");
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function typeMessage(sender, text) {
        let msgDiv = document.createElement("div");
        msgDiv.classList.add(sender === "user" ? "user-message" : "bot-message", "fade-in");
        chatBox.appendChild(msgDiv);

        let index = 0;
        function type() {
            if (index < text.length) {
                msgDiv.textContent += text.charAt(index);
                index++;
                setTimeout(type, 30);
            }
        }
        type();
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addTypingIndicator() {
        let typingDiv = document.createElement("div");
        typingDiv.classList.add("bot-message", "typing-indicator");
        typingDiv.innerHTML = "⏳ Bot is typing...";
        typingDiv.id = "typing-indicator";
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTypingIndicator() {
        let typingDiv = document.getElementById("typing-indicator");
        if (typingDiv) typingDiv.remove();
    }
});
