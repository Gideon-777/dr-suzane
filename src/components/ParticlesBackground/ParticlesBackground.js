// src/components/ParticlesBackground/ParticlesBackground.js
import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fpsLimit: 60,
                interactivity: {
                    detectsOn: "window",
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "grab",
                            parallax: {
                                enable: true,
                                force: 60,
                                smooth: 10
                            }
                        },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 200,
                            links: {
                                opacity: 0.5,
                                color: "#4a90e2"
                            }
                        },
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 100,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: ["#99f2c8", "#1f4037"],
                    },
                    links: {
                        color: "#1f4037",
                        distance: 150,
                        enable: true,
                        opacity: 0.2,
                        width: 1,
                        triangles: {
                            enable: false,
                            opacity: 0.1
                        }
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                          enable: false,
                          rotateX: 600,
                          rotateY: 1200
                        }
                      },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                            factor: 1000
                        },
                        value: 50,
                        limit: 0,
                    },
                    opacity: {
                        value: 0.8,
                        random: false,
                        animation: {
                            enable: true,
                            speed: 5,
                            minimumValue: 0.1,
                            sync: false
                        }
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 3 },
                        animation: {
                            enable: true,
                            speed: 2,
                            minimumValue: 0.5,
                            sync: false
                        }
                    },
                },
                detectRetina: true,
                smooth: true,
                background: {
                    color: "#f0f8ff",
                    opacity: 1,
                },
                responsive: [
                    {
                        maxWidth: 768,
                        options: {
                            particles: {
                                number: {
                                    value: 50
                                }
                            }
                        }
                    }
                ]
            }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "auto"
            }}
        />
    );
};

export default ParticlesBackground;
