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
            bubble.innerText = "The Mentor is still weaving... Please wait for the download.";
            return;
        }
    }    

    // Visual feedback that the Mentor is "thinking"
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
The recycled air in the Oakland café hummed, a predictable drone punctuated by the clatter of ceramic and the low murmur of morning conversations. Ethan, nursing a lukewarm matcha latte, traced a finger across the glossy page of The Economist. The date, he noted with a familiar pang, was February 22, 2026. The headline, stark and uncompromising, read: "The Great Firewall of Democracy: Harris Doubles Down on Digital Containment."

He adjusted his glasses, a habit he’d picked up during the tense COVID years, and dove into the analysis. The article detailed President Harris's recent State of the Union address, where she had, predictably, doubled down on the "generational struggle" against Beijing. "No nation," the piece quoted her, "will out-innovate America, nor will any autocratic regime dictate the terms of the 21st-century digital commons."

Ethan sighed, a soft exhalation that no one else in the bustling café would notice. He understood the logic, intellectually. His graduate work in AI ethics had shown him the stark differences in data governance, the diverging paths of surveillance and privacy. He knew the arguments for "de-risking," for technological sovereignty, for pushing back against IP theft.

But knowing didn't make it feel any less constricting.

The article went on to praise the administration's swift action against a recent "Beijing-linked cyberattack" on critical infrastructure, swiftly followed by new sanctions targeting Chinese tech giants and stricter export controls on advanced AI chips. Ethan’s eyes drifted to a small sidebar: "The New Loyalty Test: Scrutiny Intensifies for Dual-Use Research."

He thought of his cousin, Mei, a brilliant materials scientist at Stanford. A few months ago, she’d been quietly pulled from a major government grant, cited only as "potential conflict of interest due to extensive familial ties abroad." Mei, born and raised in Cupertino, had been devastated. She had no political affiliations, no nefarious intent, just grandparents in Shenzhen whom she visited every other year.

Ethan knew, too, that the anti-Asian hate he’d seen during the pandemic had largely receded from public discourse. The Harris administration had been unequivocal in condemning xenophobia, in strengthening federal protections. He felt safe walking these streets, felt like the government was, at least outwardly, on his side. Yet, this "institutional Cold War" felt like a slow, insidious chill.

He scrolled through his phone, an unconscious habit, pausing on an old photo. It was from his last trip to Shanghai, 2019. His 外婆/waipo (maternal grandmother) was beaming, holding a steaming bowl of 小笼包/xiaolongbao (juicy bun). He remembered the chaotic energy of the city, the impossible rush of humanity, the smell of street food, the feeling of being utterly anonymous yet utterly connected to something ancient.

Now, a trip back felt like navigating a minefield. His travel agent had warned him of increased scrutiny at customs, of potential delays in visa processing, of needing to "declare any and all digital devices." It wasn't about being denied entry, but about the unspoken assumption that every Chinese American was a potential vector, a soft target for influence or information.

He imagined the government's internal memos, the carefully crafted policies. Combat the CCP, not the Chinese people. A noble distinction, perhaps. But for him, sitting in this café, reading the sterile prose of The Economist, the line felt impossibly blurred. The Cold War wasn't just in the headlines or the halls of power; it was in the quiet scrutiny, the unasked questions, the subtle chill that seeped into the very fabric of his identity. He was American, yes. But in 2026, under President Harris's firm hand, being Chinese American felt less like a bridge and more like living on a border.

He closed the magazine, the glossy cover reflecting his own slightly troubled gaze. He picked up his phone and typed a message to Mei: Want to grab dinner tonight? My treat. No politics, just good food. He knew, instinctively, that tonight, they would just talk about anything else. Anything but the news.
`

export async function clickBubble1() {
    console.log("clickBubble1")
    await writeResponseToBubble('thought-bubble-1', response1)
    const bubble2 = document.getElementById("thought-bubble-2") as HTMLDivElement;
    bubble2!.style.display = "block"
    bubble2.scrollIntoView({ behavior: 'smooth' });
}