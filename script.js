// Preloader
window.addEventListener('load', function() {
    setTimeout(function() {
        document.querySelector('.preloader').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.preloader').style.display = 'none';
        }, 500);
    }, 1500);

    // Try to play music on page load
    const bgMusic = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause');

    // Function to play music
    const playMusic = function() {
        if (bgMusic.paused) {
            bgMusic.play()
                .then(() => {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(error => {
                    console.log("Auto-play prevented by browser:", error);
                });
        }
    };

    // Try to play on load
    setTimeout(playMusic, 2000);

    // Play on first click anywhere
    document.body.addEventListener('click', function onFirstClick() {
        playMusic();
        document.body.removeEventListener('click', onFirstClick);
    }, { once: true });

    // Play on first scroll
    window.addEventListener('scroll', function onFirstScroll() {
        playMusic();
        window.removeEventListener('scroll', onFirstScroll);
    }, { once: true });
});

// Progress Bar
window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

    document.querySelector('.progress-bar').style.width = scrollPercentage + '%';

    // Show/hide fixed nav
    if (scrollTop > windowHeight * 0.8) {
        document.querySelector('.fixed-nav').classList.add('visible');
    } else {
        document.querySelector('.fixed-nav').classList.remove('visible');
    }
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.custom-cursor-follower');

document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Delayed follower
    setTimeout(function() {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

document.addEventListener('mousedown', function() {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', function() {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Elements that should change cursor
const interactiveElements = document.querySelectorAll('a, button, .gallery-photo, .hero-photo, .scroll-indicator');

interactiveElements.forEach(function(element) {
    element.addEventListener('mouseenter', function() {
        cursor.style.width = '30px';
        cursor.style.height = '30px';
        cursor.style.backgroundColor = 'var(--secondary-color)';
        cursorFollower.style.width = '50px';
        cursorFollower.style.height = '50px';
        cursorFollower.style.borderColor = 'var(--primary-color)';
    });

    element.addEventListener('mouseleave', function() {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'var(--primary-color)';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
        cursorFollower.style.borderColor = 'var(--secondary-color)';
    });
});

// Audio controls
const bgMusic = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause');
const muteUnmuteBtn = document.getElementById('mute-unmute');

playPauseBtn.addEventListener('click', function() {
    if (bgMusic.paused) {
        bgMusic.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        bgMusic.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

muteUnmuteBtn.addEventListener('click', function() {
    if (bgMusic.muted) {
        bgMusic.muted = false;
        muteUnmuteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        bgMusic.muted = true;
        muteUnmuteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// Scroll indicator click event
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Hero Photo Flip only on Desktop Hover
document.addEventListener('DOMContentLoaded', function() {
    const heroPhotoContainer = document.querySelector('.hero-photo-container');

    if (window.matchMedia("(hover: hover)").matches) {
        heroPhotoContainer.addEventListener('mouseenter', function() {
            heroPhotoContainer.classList.add('flipped');
        });
        heroPhotoContainer.addEventListener('mouseleave', function() {
            heroPhotoContainer.classList.remove('flipped');
        });
    }
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    gsap.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.5
    });

    // Intersection Observer for gallery items
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                galleryObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.gallery-item').forEach(item => {
        galleryObserver.observe(item);
    });

    // Gallery item animations
    gsap.utils.toArray('.gallery-item').forEach(function(item, index) {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none'
            },
            delay: index * 0.2
        });
    });

    // Final message animations
    gsap.to('.birthday-wishes', {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.birthday-wishes',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
        }
    });

    gsap.to('.romantic-wish', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        scrollTrigger: {
            trigger: '.romantic-wish',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
        }
    });
});

// Particles.js
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 50,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#ff1f5a", "#05ffa1", "#7209b7"]
            },
            "shape": {
                "type": ["circle", "triangle", "star"],
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ff1f5a",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.5
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
});

// Three.js 3D Heart Model
document.addEventListener('DOMContentLoaded', function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    const heartModelContainer = document.getElementById('heart-model');
    if (heartModelContainer) {
        heartModelContainer.appendChild(renderer.domElement);
    } else {
        console.error("Element with ID 'heart-model' not found.");
        return;
    }

    // Create heart shape
    const heartShape = new THREE.Shape();

    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -1, -1, -2, -2, -2);
    heartShape.bezierCurveTo(-4, -2, -4, 0, -4, 2);
    heartShape.bezierCurveTo(-4, 4, -2, 4, 0, 6);
    heartShape.bezierCurveTo(2, 4, 4, 4, 4, 2);
    heartShape.bezierCurveTo(4, 0, 4, -2, 2, -2);
    heartShape.bezierCurveTo(1, -2, 0, -1, 0, 0);

    const extrudeSettings = {
        depth: 1,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.5,
        bevelThickness: 0.5
    };

    // Create heart material with glow effect
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            "color": { value: new THREE.Color(0xff1f5a) },
            "time": { value: 0 },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float time;
            varying vec2 vUv;

            void main() {
                float intensity = 0.8 + 0.2 * sin(time);
                gl_FragColor = vec4(color * intensity, 1.0);
            }
        `,
        side: THREE.DoubleSide
    });

    // Create heart geometry and mesh
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const heart = new THREE.Mesh(heartGeometry, glowMaterial);

    // Center the heart
    heart.scale.set(0.8, 0.8, 0.8);
    heart.position.set(0, 0, 0);
    heart.rotation.set(0, 0, 0);

    scene.add(heart);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 15;

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);

        // Update time uniform for glow effect
        time += 0.05;
        glowMaterial.uniforms.time.value = time;

        // Rotate heart
        heart.rotation.y += 0.01;
        heart.rotation.x = Math.sin(time * 0.3) * 0.2;

        // Pulsing effect
        const scale = 0.8 + Math.sin(time * 0.5) * 0.05;
        heart.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});

// Hero Canvas Background
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.error("Element with ID 'hero-canvas' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Resize canvas on window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Stars
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = `rgba(${255}, ${255}, ${255}, ${Math.random()})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push(new Star());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(7, 0, 15, 1)');
        gradient.addColorStop(1, 'rgba(25, 5, 40, 1)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw and update stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});

// Create fireflies effect
document.addEventListener('DOMContentLoaded', function() {
    const firefliesContainer = document.getElementById('fireflies-container');
    const finalMessage = document.querySelector('.final-message');

    if (!firefliesContainer || !finalMessage) {
        console.error("Required elements for fireflies effect not found.");
        return;
    }

    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');

        // Random position
        const top = Math.random() * finalMessage.offsetHeight;
        const left = Math.random() * finalMessage.offsetWidth;

        firefly.style.top = top + 'px';
        firefly.style.left = left + 'px';

        // Animation
        const duration = 3 + Math.random() * 5;

        gsap.to(firefly, {
            opacity: 0.8,
            duration: duration / 2,
            onComplete: function() {
                gsap.to(firefly, {
                    opacity: 0,
                    duration: duration / 2,
                    onComplete: function() {
                        firefly.remove();
                        createFirefly();
                    }
                });
            }
        });

        // Movement
        gsap.to(firefly, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            duration: duration,
            ease: "sine.inOut"
        });

        firefliesContainer.appendChild(firefly);
    }

    // Create initial fireflies
    for (let i = 0; i < 30; i++) {
        setTimeout(createFirefly, i * 100);
    }
});

// Floating elements animation
document.addEventListener('DOMContentLoaded', function() {
    const floatingElements = document.querySelectorAll('.floating-element');

    floatingElements.forEach(element => {
        const delay = Math.random() * 15;
        const duration = 15 + Math.random() * 10;

        element.style.animationDelay = delay + 's';
        element.style.animationDuration = duration + 's';
    });
});

// Disable right-click and inspect
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});

// Disable dragging for images
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
});

// Tilt.js initialization for 3D card effects
document.addEventListener('DOMContentLoaded', function() {
    VanillaTilt.init(document.querySelectorAll('.gallery-photo'), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
    });

    VanillaTilt.init(document.querySelectorAll('.hero-photo'), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });
});

// Keep a dummy requestAnimationFrame loop to prevent heavy throttling
function keepAlive() {
    requestAnimationFrame(keepAlive);
}
keepAlive();