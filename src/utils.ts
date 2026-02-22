
export function updateStatus(msg, color) {
    const status = document.getElementById('status') as HTMLElement;
    
    status.innerText = msg
    status.style.color = color
}
