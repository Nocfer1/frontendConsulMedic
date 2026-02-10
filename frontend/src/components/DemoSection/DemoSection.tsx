import React from 'react';
import { Container } from 'react-bootstrap';
import './DemoSection.css';

const DemoSection = () => {
    return (
        <section className="demo-section">
            <Container>
                <h2 className="text-center mb-5" data-aos="fade-up">
                    Proceso de transcripción médica
                </h2>
                <div className="demo-container" data-aos="zoom-in">
                    <div className="demo-wrapper">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="demo-video"
                        >
                            <source src="/demo-video.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default DemoSection;