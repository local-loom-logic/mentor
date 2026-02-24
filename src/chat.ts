import { enableGemma, FILENAME } from "./model-details";
import { isModelLocallyAvailable } from "./model-storage";


// 2. The Typewriter Effect
async function typeWriter(text: string, element: HTMLElement, overwrite: boolean) {
    if (overwrite) {
        element.innerHTML = ""; // Clear existing thought
    }
    let i = 0;
    const speed = 5; // milliseconds per character

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

export async function writeResponseToBubble(bubbleId, response) {
    const bubble = document.getElementById(bubbleId) as HTMLDivElement;
    bubble.classList.add("locked")
    if (enableGemma) {
        const exists = await isModelLocallyAvailable(FILENAME)
        if (!exists) {
            bubble.innerText = "The Mosaic is still weaving... Please wait for the download.";
            return;
        }
    }    

    // Visual feedback that the Mosaic is "thinking"
    bubble.style.opacity = "0.6";
    // bubble.innerText = "Consulting local logic...";

    try {
        const responseText = "\n" + response;

        bubble.style.opacity = "1";
        await typeWriter(responseText, bubble, false);
        
    } catch (err) {
        bubble.innerText = "The local logic encountered an error. Ensure WebGPU is enabled.";
    }
}

const response1 = `
The library was a tomb of silent logic, but for Ethan, the air felt thick with a friction he couldn't name. He sat across from Mei, their laptops humming like two small engines in a vast, cold hangar. Between them lay a discarded copy of a geopolitical quarterly, its cover depicting a digital globe fracturing into two distinct, jagged halves.

Ethan leaned over, staring at a map of the Pacific. A bold, crimson line had been drawn through the South China Sea, labeled simply: Decoupling Zone.

The text below it was clinical, written by someone who viewed the world as a game of Go. It spoke of "supply chain resilience," "strategic autonomy," and "the necessary pruning of cultural exchange." To the author, these were variables in a grand calculation for 2026.

But to Ethan, the crimson line looked like a surgical incision.

"I feel like I'm being divided by zero," he whispered, sliding the journal toward Mei.

Mei didn't look up immediately. She was staring at her own reflection in the darkened window, where the library lights made her look like a ghost haunting the campus. "It’s the cognitive tax, Ethan," she said softly. "The more they talk about 'de-risking,' the more I feel like I'm the risk. My family, my language, the way I think—it’s all being categorized as a liability."

She traced the crimson line on the page with her fingernail. "On one side of this line, I’m a 'model minority' whose loyalty is under a microscope. On the other side, I’m a 'sea turtle' who has been tainted by the West. There is no 'Us' on this map. There is only 'Side A' and 'Side B.' We are just the noise in the data."

Ethan looked back at the map. The author of the article would never know that this "strategic pivot" felt like a physical tearing in a student’s chest. The "High Achiever" in him wanted to find a way to "win" at this new reality, to optimize his identity for the era of suspicion. But the Sovereign part of him knew that the only way to survive was to stop being a variable.

He closed the journal. The sound was a sharp thud in the silence of the stacks.

"We aren't on their map," Ethan said, his voice gaining a sudden, quiet clarity. "So we have to draw our own."
`

export async function clickBubble1() {
    console.log("clickBubble1")
    await writeResponseToBubble('thought-bubble-1', response1)
    const bubble2 = document.getElementById("thought-bubble-2") as HTMLDivElement;
    bubble2!.style.display = "block"
    bubble2.scrollIntoView({ behavior: 'smooth' });
}