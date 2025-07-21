import React from 'react';

const features = [
    {        title: "Rapidez en consultas",
        description: "Reduce el tiempo y mejora la eficiencia en tus consultas médicas.",
        icon: "bi-speedometer2",
    },
    {
        title: "Transcripción automática",
        description: "Convierte audio de una consulta médica a texto de forma fácil y rápida.",
        icon: "bi-mic",
    },
    {
        title: "Resúmenes instantáneos",
        description: "Obtén un resumen inteligente de cada consulta para tu historial.",
        icon: "bi-lightbulb",
    },
];

const Features = () => (
    <section className="py-5">
        <div className="container">
            <div className="row">
                {features.map((feat, idx) => (
                    <div className="col-md-4 text-center mb-4" key={idx}>
                        <i className={`bi ${feat.icon} display-4 mb-3 text-primary`}></i>
                        <h5>{feat.title}</h5>
                        <p>{feat.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Features;
