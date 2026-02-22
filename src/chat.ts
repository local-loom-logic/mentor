import { FILENAME } from "./model-details";
import { isModelLocallyAvailable } from "./model-storage";


// 2. The Typewriter Effect
async function typeWriter(text: string, element: HTMLElement, overwrite: boolean) {
    if (overwrite) {
        element.innerHTML = ""; // Clear existing thought
    }
    let i = 0;
    const speed = 40; // milliseconds per character

    return new Promise((resolve) => {
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve(true);
            }
        }
        type();
    });
}


export async function clickBubble() {
    const bubble = document.getElementById('thought-bubble') as HTMLDivElement;
    const exists = await isModelLocallyAvailable(FILENAME)
    if (!exists) {
        bubble.innerText = "The Mentor is still weaving... Please wait for the download.";
        return;
    }

    // Visual feedback that the Mentor is "thinking"
    bubble.style.opacity = "0.6";
    // bubble.innerText = "Consulting local logic...";

    try {
        const originalQuestion = "How do I navigate my complex, inter-generational identity in a shifting geopolitical landscape?"
        // Example prompt based on your question
        const prompt = `As a mentor, give a short, wise response to: ${originalQuestion}`;
        
        // This is where you call your actual model (e.g., WebLLM)
        // const reply = await engine.chat.completions.create({ 
        //    messages: [{ role: "user", content: prompt }] 
        // });
        // const responseText = reply.choices[0].message.content;

        const responseText = "\n" + "Navigation requires a sturdy anchor in your own values, even as the tides of history pull at your roots. Your identity is not a conflict to be solved, but a loom to be woven.";

        bubble.style.opacity = "1";
        await typeWriter(responseText, bubble, false);
        
    } catch (err) {
        bubble.innerText = "The local logic encountered an error. Ensure WebGPU is enabled.";
    }
}
