// TextFirework.ts
export const createTextFirework = (text: string, x: number, y: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Small canvas to grab pixel data from text
    canvas.width = 400;
    canvas.height = 100;
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const particles = [];
    
    // Sample every 4th pixel for performance
    const step = 4;
    for (let py = 0; py < canvas.height; py += step) {
        for (let px = 0; px < canvas.width; px += step) {
            const index = (py * canvas.width + px) * 4;
            // If alpha > 128, it's part of the text
            if (imgData[index + 3] > 128) {
                // Determine direction vector from center of text to this pixel
                const dx = px - canvas.width / 2;
                const dy = py - canvas.height / 2;
                
                // Colors suitable for birthday
                const colors = ['#f48fb1', '#f06292', '#ffffff', '#ffb6c1', '#ffd700'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                particles.push({
                    x: window.innerWidth * x, 
                    y: window.innerHeight * y,
                    vx: dx * 0.15 + (Math.random() - 0.5) * 2, // explode outward but maintain shape
                    vy: dy * 0.15 + (Math.random() - 0.5) * 2 - 5, // add some upward momentum
                    color: color,
                    life: 1,
                    size: Math.random() * 3 + 2,
                    decay: Math.random() * 0.015 + 0.015,
                    gravity: 0.1,
                    // target coordinates for forming text
                    targetX: window.innerWidth * 0.5 + dx * 2.5,
                    targetY: window.innerHeight * 0.3 + dy * 2.5
                });
            }
        }
    }
    
    return particles;
};
