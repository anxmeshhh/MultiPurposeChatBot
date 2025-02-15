document.addEventListener("DOMContentLoaded", function () {
    console.log("Chatbot script loaded!");

    const chatbotIcon = document.getElementById("chatbot-icon");
    const chatbotContainer = document.getElementById("chatbot-container");
    const closeChat = document.getElementById("close-chat");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // ✅ Toggle Chatbot Visibility
    chatbotIcon.addEventListener("click", function () {
        chatbotContainer.classList.toggle("chatbot-visible");
        console.log("Chatbot toggled!");
    });

    closeChat.addEventListener("click", function () {
        chatbotContainer.classList.remove("chatbot-visible");
        console.log("Chatbot closed!");
    });

    // ✅ Function to Send Messages
    function sendMessage() {
        let message = userInput.value.trim();
        if (!message) return;

        addMessage("user", message);
        userInput.value = "";
        addTypingIndicator();

        // ✅ Send message to Django backend
        fetch("api/chatbot/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(),
            },
            body: JSON.stringify({ message: message }),
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                removeTypingIndicator();
                if (data.response) {
                    typeMessage("bot", data.response);
                } else {
                    typeMessage("bot", "⚠️ No response received!");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                removeTypingIndicator();
                typeMessage("bot", "⚠️ Sorry, something went wrong. Please try again.");
            });
    }

    // ✅ Send message on button click
    sendBtn.addEventListener("click", sendMessage);

    // ✅ Send message on Enter key press
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    // ✅ Function to Add Messages to Chatbox
    function addMessage(sender, text) {
        let msgDiv = document.createElement("div");
        msgDiv.classList.add(sender === "user" ? "user-message" : "bot-message", "fade-in");
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        scrollToBottom();
    }

    // ✅ Function to Type Out Bot Messages (Typing Effect)
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
        scrollToBottom();
    }

    // ✅ Function to Add Typing Indicator
    function addTypingIndicator() {
        if (!document.getElementById("typing-indicator")) {
            let typingDiv = document.createElement("div");
            typingDiv.classList.add("bot-message", "typing-indicator");
            typingDiv.innerHTML = "⏳ Bot is typing...";
            typingDiv.id = "typing-indicator";
            chatBox.appendChild(typingDiv);
            scrollToBottom();
        }
    }

    // ✅ Function to Remove Typing Indicator
    function removeTypingIndicator() {
        let typingDiv = document.getElementById("typing-indicator");
        if (typingDiv) typingDiv.remove();
    }

    // ✅ Function to Get CSRF Token
    function getCSRFToken() {
        let cookieValue = null;
        document.cookie.split("; ").forEach((cookie) => {
            let [name, value] = cookie.split("=");
            if (name === "csrftoken") cookieValue = value;
        });
        return cookieValue;
    }

    // ✅ Auto-scroll to Bottom
    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
