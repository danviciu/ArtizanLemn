type InfoCard = {
  title: string;
  points: string[];
};

const infoCards: InfoCard[] = [
  {
    title: "Ce ne poti trimite",
    points: [
      "Fotografii de inspiratie sau piese similare.",
      "Schite rapide, chiar si in varianta de lucru.",
      "Dimensiuni aproximative si fotografii ale spatiului.",
      "Preferinte de esenta, textura si finisaj.",
    ],
  },
  {
    title: "Cum analizam cererea",
    points: [
      "Citim contextul proiectului, nu doar campurile standard.",
      "Verificam fezabilitatea tehnica si proportiile.",
      "Pregatim o directie clara pentru pasii urmatori.",
    ],
  },
  {
    title: "Ce urmeaza dupa trimitere",
    points: [
      "Revenim in mod normal in 1-2 zile lucratoare.",
      "Stabilim detaliile lipsa prin discutie directa.",
      "Construim propunerea in functie de spatiul tau.",
    ],
  },
];

export function InfoPanel() {
  return (
    <aside className="space-y-5">
      {infoCards.map((card) => (
        <article key={card.title} className="luxury-card p-6">
          <h2 className="text-3xl">{card.title}</h2>
          <ul className="mt-4 space-y-2 text-sm text-wood-700">
            {card.points.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
        </article>
      ))}

      <article className="luxury-card border-wood-900/20 bg-wood-950 p-6 text-sand-50">
        <h2 className="text-3xl text-sand-50">Nota importanta</h2>
        <p className="mt-3 text-sm text-sand-100/90">
          Dimensiunile aproximative sunt suficiente pentru inceput. Ajustarile
          finale se fac dupa analiza si discutie aplicata.
        </p>
      </article>
    </aside>
  );
}
