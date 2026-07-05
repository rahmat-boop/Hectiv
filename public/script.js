const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const newChat = document.getElementById("new-chat");

let conversation = [];

// =========================
// Scroll ke bawah
// =========================

function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// =========================
// Bubble Chat
// =========================

function createMessage(role, text) {

    // hilangkan welcome pertama
    const welcome = document.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }

    const message = document.createElement("div");
    message.className = `message ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";

    avatar.innerHTML = role === "user"
        ? "👤"
        : "🤖";

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    bubble.innerHTML = text.replace(/\n/g, "<br>");

    message.appendChild(avatar);
    message.appendChild(bubble);

    chatBox.appendChild(message);

    scrollBottom();

    return message;
}

// =========================
// Loading
// =========================

function createLoading() {

    const message = document.createElement("div");

    message.className = "message bot";

    message.innerHTML = `
        <div class="avatar">🤖</div>

        <div class="bubble">

            <div class="typing">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>
    `;

    chatBox.appendChild(message);

    scrollBottom();

    return message;

}

// =========================
// Kirim Pesan
// =========================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    createMessage("user", text);

    conversation.push({
        role: "user",
        text: text
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

        loading.remove();

        if (!response.ok) {

            createMessage("bot", "❌ Server Error");

            return;

        }

        const data = await response.json();

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

        loading.remove();

        createMessage(

            "bot",

            "Failed to get response from server."

        );

        console.error(err);

    }

});

// =========================
// New Chat
// =========================

newChat.onclick = () => {

    conversation = [];

    chatBox.innerHTML = `

        <div class="welcome">

            <div class="welcome-icon">

                🤖

            </div>

            <h1>Hello 👋</h1>

            <p>

                I'm your AI Assistant.<br>

                Ask me anything.

            </p>

        </div>

    `;

}