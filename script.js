document.addEventListener('DOMContentLoaded', () => {
    const heartButton = document.getElementById('heartButton');
    const mainContent = document.getElementById('mainContent');
    const floatingHearts = document.querySelector('.floating-hearts');
    
    // Função para criar corações flutuantes
    function createFloatingHearts() {
        const colors = ['#ff80ab', '#ff4081', '#f8bbd0', '#f06292'];
        
        for (let i = 0; i < 40; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            
            const size = Math.random() * 30 + 10;
            const x = Math.random() * 100;
            const duration = Math.random() * 15 + 5;
            const delay = Math.random() * 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            heart.style.cssText = `
                position: absolute;
                left: ${x}%;
                bottom: -100px;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                transform: rotate(45deg);
                opacity: 0;
                animation: floatUp ${duration}s ease-in infinite ${delay}s;
                z-index: -1;
            `;
            
            // Criar os pseudo-elementos em CSS
            const before = document.createElement('div');
            before.style.cssText = `
                content: '';
                width: 100%;
                height: 100%;
                background-color: ${color};
                border-radius: 50%;
                position: absolute;
                top: -50%;
                left: 0;
            `;
            
            const after = document.createElement('div');
            after.style.cssText = `
                content: '';
                width: 100%;
                height: 100%;
                background-color: ${color};
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: -50%;
            `;
            
            heart.appendChild(before);
            heart.appendChild(after);
            floatingHearts.appendChild(heart);
        }
        
        // Adicionar animação keyframes para floatUp
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes floatUp {
                0% {
                    transform: translateY(0) rotate(45deg) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(-100vh) rotate(45deg) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Animação para revelar o conteúdo
    function revealContent() {
        heartButton.style.transform = 'translate(-50%, -50%) scale(0.5)';
        heartButton.style.opacity = '0';
        
        setTimeout(() => {
            heartButton.style.display = 'none';
            mainContent.style.display = 'flex';
            
            // Animações com GSAP
            gsap.to(mainContent, {
                opacity: 1,
                duration: 1,
                ease: 'power2.out'
            });
            
            // Animar os elementos do conteúdo
            gsap.from('.header', {
                y: -50,
                opacity: 0,
                duration: 1.2,
                ease: 'back.out(1.7)'
            });
            
            gsap.from('.card', {
                scale: 0.8,
                opacity: 0,
                duration: 1.3,
                delay: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });
            
            gsap.from('.photo-frame', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                delay: 0.8,
                ease: 'back.out(1.5)'
            });
            
            gsap.from('.poem', {
                scale: 0.9,
                opacity: 0,
                duration: 1.2,
                delay: 1.5,
                ease: 'power2.out'
            });
            
            // Adicionar efeito de brilho nos cartões
            const cards = document.querySelectorAll('.card, .photo-frame');
            cards.forEach(card => {
                // Vamos preservar o conteúdo original e depois adicionar o brilho
                const originalContent = card.innerHTML;
                card.innerHTML = originalContent + '<div class="card-shine"></div>';
                
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const shine = card.querySelector('.card-shine');
                    shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    const shine = card.querySelector('.card-shine');
                    shine.style.background = 'none';
                });
            });
            
            // Adicionar brilho separadamente para o poema para evitar interferência com o texto
            const poem = document.querySelector('.poem');
            poem.appendChild(document.createElement('div')).className = 'card-shine';
            
            poem.addEventListener('mousemove', (e) => {
                const rect = poem.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const shine = poem.querySelector('.card-shine');
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`;
            });
            
            poem.addEventListener('mouseleave', () => {
                const shine = poem.querySelector('.card-shine');
                shine.style.background = 'none';
            });
            
            // Adicionar estilos para o efeito de brilho
            const shineStyle = document.createElement('style');
            shineStyle.textContent = `
                .card-shine {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 10;
                    border-radius: inherit;
                }
            `;
            document.head.appendChild(shineStyle);
            
            // Criar os corações flutuantes
            createFloatingHearts();
            
            // Adicionar efeito de digitação para o poema
            const poemLines = document.querySelectorAll('.poem p');
            poemLines.forEach((line, index) => {
                const text = line.textContent;
                line.textContent = '';
                line.style.opacity = '1';
                
                setTimeout(() => {
                    let currentText = '';
                    let currentIndex = 0;
                    
                    const typeInterval = setInterval(() => {
                        if (currentIndex < text.length) {
                            currentText += text[currentIndex];
                            line.textContent = currentText;
                            currentIndex++;
                        } else {
                            clearInterval(typeInterval);
                        }
                    }, 50);
                }, 2000 + (index * 500));
            });
            
        }, 600);
    }
    
    // Adicionando os ouvintes de eventos
    heartButton.addEventListener('click', revealContent);
    
    // Animação inicial para o botão de coração
    gsap.from(heartButton, {
        scale: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.3)',
        onComplete: () => {
            gsap.to('.click-text', {
                opacity: 1,
                duration: 1
            });
        }
    });
    
    // Efeito de brilho no coração
    const createHeartShine = () => {
        const heartIcon = document.querySelector('.heart-icon');
        const shine = document.createElement('div');
        shine.className = 'heart-shine';
        
        shine.style.cssText = `
            position: absolute;
            width: 150%;
            height: 150%;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            pointer-events: none;
            opacity: 0;
            top: -25%;
            left: -25%;
        `;
        
        heartIcon.style.position = 'relative';
        heartIcon.style.overflow = 'hidden';
        heartIcon.appendChild(shine);
        
        gsap.to(shine, {
            opacity: 0.7,
            duration: 1.5,
            repeat: -1,
            yoyo: true
        });
    };
    
    createHeartShine();
}); 