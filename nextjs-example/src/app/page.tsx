import PricingToggle from "@/components/pricing-toggle";
import NewsletterForm from "@/components/newsletter-form";
import testimonials from "@/data/testimonials.json";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  company: string;
}

// Questo è un Server Component: gira solo sul server.
// In un progetto reale, il fetch avverrebbe verso un'API esterna.
export default function LandingPage() {
  return (
    <main>
      <section className="hero">
        <h1>Il nostro prodotto</h1>
        <p>La soluzione più veloce per il tuo team.</p>
      </section>

      <section className="features">
        <h2>Funzionalità principali</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Velocità</h3>
            <p>Performance ottimizzate per ogni dispositivo, con tempi di caricamento sotto il secondo.</p>
          </div>
          <div className="feature-card">
            <h3>Sicurezza</h3>
            <p>Crittografia end-to-end e conformità GDPR inclusa in ogni piano.</p>
          </div>
          <div className="feature-card">
            <h3>Scalabilità</h3>
            <p>Dalla startup all&apos;enterprise, cresce con te senza compromessi.</p>
          </div>
        </div>
      </section>

      <section className="pricing">
        <h2>Prezzi chiari, senza sorprese</h2>
        {/* PricingToggle è un Client Component: viene idratato automaticamente */}
        <PricingToggle />
      </section>

      {/* Le testimonianze vengono da un Server Component: HTML puro, niente JS */}
      <section className="testimonials">
        <h2>Cosa dicono di noi</h2>
        {(testimonials as Testimonial[]).map((t) => (
          <blockquote key={t.id}>
            <p>{t.quote}</p>
            <cite>— {t.author}, {t.company}</cite>
          </blockquote>
        ))}
      </section>

      <section className="newsletter">
        <h2>Resta aggiornato</h2>
        {/* NewsletterForm è un Client Component */}
        <NewsletterForm />
      </section>
    </main>
  );
}
