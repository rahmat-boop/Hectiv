document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("chat-form");
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const newChatBtn = document.getElementById("new-chat");

    let conversation = [];

    // ================================
    // Scroll otomatis
    // ================================
    function scrollBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ================================
    // Membuat Bubble Chat
    // ================================
    function createMessage(role, text) {

        const message = document.createElement("div");
        message.className = `message ${role}`;

        const icon = document.createElement("div");
        icon.className = "icon";

        icon.textContent = role === "user"
            ? "👤"
            : "🤖";

        const bubble = document.createElement("div");
        bubble.className = "bubble";

        bubble.innerHTML = `
            <h4>${role === "user" ? "You" : "AI Assistant"}</h4>
            <p>${text}</p>
        `;

        message.appendChild(icon);
        message.appendChild(bubble);

        chatBox.appendChild(message);

        scrollBottom();

        return message;

    }

    // ================================
    // Loading Animation
    // ================================
    function createLoading() {

        const loading = document.createElement("div");
        loading.className = "message bot";

        loading.innerHTML = `
            <div class="icon">🤖</div>

            <div class="bubble">

                <h4>AI Assistant</h4>

                <div class="loading">

                    <div></div>
                    <div></div>
                    <div></div>

                </div>

            </div>
        `;

        chatBox.appendChild(loading);

        scrollBottom();

        return loading;

    }

    // ================================
    // Submit
    // ================================
    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const userMessage = input.value.trim();

        if (!userMessage) return;

        createMessage("user", userMessage);

        conversation.push({
            role: "user",
            text: userMessage
        });

        input.value = "";

        input.focus();

        const loading = createLoading();

        try {

            const response = await fetch("/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    conversation
                })

            });

            if (!response.ok) {

                throw new Error("Server Error");

            }

            const data = await response.json();

            loading.remove();

            if (data.result) {

                createMessage("bot", data.result);

                conversation.push({

                    role: "model",

                    text: data.result

                });

            }

            else {

                createMessage(
                    "bot",
                    "Sorry, no response received."
                );

            }

        }

        catch (err) {

            console.error(err);

            loading.remove();

            createMessage(

                "bot",

                "Failed to get response from server."

            );

        }

    });

    // ================================
    // New Chat
    // ================================
    newChatBtn.addEventListener("click", () => {

        conversation = [];

        chatBox.innerHTML = `

        <div class="message bot">

            <div class="icon">🤖</div>

            <div class="bubble">

                <h4>AI Assistant</h4>

                <p>

                Hello 👋<br><br>

                I'm your AI assistant powered by Google Gemini.

                Ask me anything!

                </p>

            </div>

        </div>

        `;

    });

});