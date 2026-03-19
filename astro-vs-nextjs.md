# Astro vs Next.js: due filosofie per costruire il web moderno

Il panorama frontend degli ultimi anni è esploso. React, Vue, Svelte, Solid, meta-framework come Next.js, Nuxt e Remix — e poi Astro, un approccio che rompe le regole del gioco in modo silenzioso ma efficace.

In questo ecosistema ricco e spesso rumoroso è facile cadere in una trappola: usare sempre lo stesso strumento, qualunque sia il problema da risolvere. Next.js funziona? Sì, quasi sempre. Ma "funziona" non significa che sia sempre la scelta giusta.

Questo articolo non vuole decretare un vincitore. Vuole rispondere a una domanda più utile: **quando ha senso usare Astro, e quando ha più senso usare Next.js?** Per rispondere bene, dobbiamo capire da dove vengono i due framework, cosa li muove sotto il cofano, e quali problemi ciascuno è davvero progettato per risolvere.

---

## Un po' di contesto: il problema del JavaScript nel browser

Prima di entrare nei dettagli tecnici, vale la pena fare un passo indietro.

Il web moderno ha un problema di peso. Negli ultimi dieci anni, la quantità media di JavaScript scaricata da un browser per visitare una pagina web è cresciuta in modo esponenziale. Nel 2023, la mediana di JavaScript per pagina desktop superava i 500KB compressi — che diventano diversi megabyte una volta analizzati ed eseguiti dal motore del browser.

Questo ha conseguenze reali: tempi di caricamento più lunghi, esperienze peggiori su dispositivi di fascia media o bassa, Core Web Vitals compromessi, e ranking SEO penalizzati.

Il problema non è React in sé. Il problema è il modello di sviluppo che si è affermato: costruiamo app React complete anche quando stiamo costruendo siti che sono, fondamentalmente, contenuto.

Astro e Next.js partono da risposte diverse a questo problema.

---

## Next.js: il fullstack framework di riferimento per React

Next.js è sviluppato e mantenuto da Vercel. Negli anni è cresciuto fino a diventare molto più di un semplice layer sopra React: è oggi una piattaforma fullstack che copre rendering, routing, gestione dei dati e deployment in modo integrato.

### Rendering modes

Una delle forze storiche di Next.js è la flessibilità nei modi di rendering:

- **Static Site Generation (SSG)** — le pagine vengono pre-renderizzate in fase di build e servite come file statici
- **Server Side Rendering (SSR)** — le pagine vengono renderizzate a ogni richiesta, utile per contenuti personalizzati o dati in tempo reale
- **Incremental Static Regeneration (ISR)** — un ibrido: le pagine statiche vengono rigenerate in background con una frequenza configurabile

```tsx
// SSG con revalidation ogni ora
export const revalidate = 3600

export default async function BlogPage() {
  const posts = await fetch("https://api.example.com/posts").then(res =>
    res.json()
  )

  return (
    <main>
      <h1>Blog</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  )
}
```

### React Server Components

Con l'introduzione dell'App Router (Next.js 13+), il framework ha abbracciato i **React Server Components (RSC)** — uno dei cambiamenti più significativi nell'ecosistema React degli ultimi anni.

I Server Components girano esclusivamente sul server. Non vengono mai idratati nel browser. Possono accedere direttamente a database, filesystem o API interne senza esporre nulla al client.

```tsx
// Questo componente non invia JavaScript al browser
async function UserProfile({ userId }: { userId: string }) {
  // Accesso diretto al database — impossibile con i Client Components
  const user = await db.users.findUnique({ where: { id: userId } })

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  )
}
```

I Client Components, invece, vengono dichiarati esplicitamente con la direttiva `"use client"` e gestiscono tutto ciò che richiede interattività lato browser.

```tsx
"use client"

import { useState } from "react"

export default function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    setCount(prev => liked ? prev - 1 : prev + 1)
    setLiked(prev => !prev)
  }

  return (
    <button onClick={handleLike} className={liked ? "liked" : ""}>
      ♥ {count}
    </button>
  )
}
```

Questa distinzione è potente, ma introduce anche complessità: capire dove tracciare il confine tra Server e Client Components richiede esperienza e attenzione. Un errore comune dei principianti è mettere `"use client"` ovunque, vanificando i benefici del modello RSC.

### API Routes e Server Actions

Next.js permette di definire endpoint backend direttamente nel progetto, nella stessa codebase del frontend:

```tsx
// app/api/subscribe/route.ts
export async function POST(request: Request) {
  const { email } = await request.json()

  await db.subscribers.create({ data: { email } })

  return Response.json({ success: true })
}
```

Con l'introduzione delle **Server Actions**, è possibile invocare logica server-side direttamente dai componenti React, senza dover definire endpoint separati:

```tsx
async function subscribeAction(formData: FormData) {
  "use server"
  const email = formData.get("email") as string
  await db.subscribers.create({ data: { email } })
}

export default function NewsletterForm() {
  return (
    <form action={subscribeAction}>
      <input name="email" type="email" placeholder="La tua email" />
      <button type="submit">Iscriviti</button>
    </form>
  )
}
```

Questo livello di integrazione tra frontend e backend è uno dei punti di forza più evidenti di Next.js per chi costruisce prodotti complessi. Un'unica codebase, un unico deploy, nessun context switch.

---

## Astro: meno JavaScript, più performance

Astro nasce nel 2021 con un'idea precisa e radicale:

> La maggior parte del web non ha bisogno di tutto quel JavaScript.

Il suo principio fondante è **zero JavaScript by default**: se non lo richiedi esplicitamente, Astro non invia nulla di JavaScript al browser. Le pagine vengono compilate in HTML statico durante la build.

```astro
---
// Questo codice gira solo a build time (o sul server)
const title = "Benvenuto su Astro"
const posts = await fetch("https://api.example.com/posts").then(r => r.json())
---

<html>
  <head><title>{title}</title></head>
  <body>
    <h1>{title}</h1>
    <ul>
      {posts.map(post => (
        <li><a href={`/blog/${post.slug}`}>{post.title}</a></li>
      ))}
    </ul>
  </body>
</html>
```

Il risultato è HTML puro. Nessun runtime JavaScript. Nessuna idratazione. Il browser riceve esattamente quello che deve mostrare, senza dover eseguire codice aggiuntivo.

Questo si traduce in metriche eccellenti: Time to First Byte (TTFB) basso, Largest Contentful Paint (LCP) rapidissimo, e un Total Blocking Time (TBT) praticamente nullo per le pagine statiche.

### Islands Architecture

La vera innovazione di Astro non è il rendering statico in sé — altri framework lo fanno da anni. È il modello con cui gestisce le parti interattive: le **Islands**.

L'idea è semplice ma potente: invece di rendere l'intera pagina un'applicazione React che poi viene idratata nel browser, Astro tratta la pagina come HTML statico con delle "isole" di interattività isolate. Ogni isola viene idratata in modo indipendente, solo quando necessario.

```astro
---
import Header from "../components/Header.astro"           // Statico
import HeroVideo from "../components/HeroVideo.jsx"       // Interattivo
import FeatureList from "../components/FeatureList.astro" // Statico
import PricingToggle from "../components/PricingToggle.jsx" // Interattivo
import Footer from "../components/Footer.astro"           // Statico
---

<html>
  <body>
    <Header />
    <HeroVideo client:visible />
    <FeatureList />
    <PricingToggle client:visible />
    <Footer />
  </body>
</html>
```

Solo `HeroVideo` e `PricingToggle` inviano JavaScript al browser, e solo quando entrano nel viewport. Header, FeatureList e Footer sono HTML puro — zero overhead.

### Le direttive client

Astro offre un set di direttive per controllare con precisione quando e come un componente viene idratato:

| Direttiva | Quando avviene l'idratazione |
|---|---|
| `client:load` | Immediatamente al caricamento della pagina |
| `client:visible` | Quando il componente entra nel viewport (Intersection Observer) |
| `client:idle` | Quando il browser è inattivo (requestIdleCallback) |
| `client:media` | Quando una media query diventa vera |
| `client:only` | Solo client-side, senza SSR del componente |

Questo livello di controllo granulare è qualcosa che Next.js non offre nativamente. In Next.js puoi ottimizzare con i Server Components, ma l'idratazione dei Client Components è automatica e immediata non appena vengono inclusi nella pagina.

### Framework agnostic

Un altro punto di forza di Astro spesso sottovalutato: non sei vincolato a React. Puoi usare componenti Vue, Svelte, Solid, Lit — o anche mescolare framework diversi nella stessa pagina.

```astro
---
import ReactCounter from "../components/Counter.jsx"   // React
import VueCarousel from "../components/Carousel.vue"   // Vue
import SvelteModal from "../components/Modal.svelte"   // Svelte
---

<main>
  <ReactCounter client:load />
  <VueCarousel client:visible />
  <SvelteModal client:load />
</main>
```

Per un team che migra gradualmente da un framework a un altro, o che ha competenze miste, questa flessibilità è preziosa. E per chi vuole sperimentare con Svelte o Solid senza riscrivere tutto, è un'opzione concreta.

---

## Confronto diretto: una pagina marketing

Mettiamo tutto insieme con un esempio concreto. Dobbiamo costruire una landing page con:

- Hero con video di background
- Sezione feature in testo
- Toggle per la visualizzazione dei prezzi mensili/annuali
- Testimonianze caricate da una API esterna
- Form di iscrizione alla newsletter

Le testimonianze sono un caso interessante: vengono da un CMS esterno, cambiano raramente, e non hanno bisogno di interattività. È esattamente il tipo di dato che i due framework gestiscono in modo molto diverso.

### Fetch dei dati: Astro

In Astro, il fetch avviene nel frontmatter — la sezione delimitata dai `---` in cima al file. Quel codice gira **solo sul server** (o a build time), mai nel browser.

```astro
---
// src/pages/index.astro
import PricingToggle from "../components/PricingToggle.jsx"
import NewsletterForm from "../components/NewsletterForm.jsx"

// Questo fetch avviene a build time (o a ogni richiesta con SSR abilitato)
// Il browser non vede nulla di questo codice
const res = await fetch("https://api.example.com/testimonials")
const testimonials = await res.json()
---

<html>
  <body>

    <section class="hero">
      <h1>Il nostro prodotto</h1>
      <p>La soluzione più veloce per il tuo team.</p>
    </section>

    <section class="pricing">
      <h2>Prezzi chiari, senza sorprese</h2>
      <!-- Caricato solo quando entra nel viewport -->
      <PricingToggle client:visible />
    </section>

    <!-- Le testimonianze sono HTML puro: zero JavaScript -->
    <section class="testimonials">
      <h2>Cosa dicono di noi</h2>
      {testimonials.map(t => (
        <blockquote>
          <p>{t.quote}</p>
          <cite>— {t.author}, {t.company}</cite>
        </blockquote>
      ))}
    </section>

    <section class="newsletter">
      <h2>Resta aggiornato</h2>
      <!-- Idratato subito: l'utente potrebbe compilarlo in cima alla pagina -->
      <NewsletterForm client:load />
    </section>

  </body>
</html>
```

Il risultato nel browser è HTML puro. Le testimonianze sono già lì, nel markup, senza una singola riga di JavaScript eseguita per mostrarle. `PricingToggle` e `NewsletterForm` sono le uniche due isole interattive, e ognuna viene idratata nei propri tempi.

### Fetch dei dati: Next.js

In Next.js con l'App Router, il fetch avviene direttamente nei Server Components — funzioni `async` che girano sul server e passano i dati ai componenti figli.

```tsx
// app/page.tsx
import PricingToggle from "@/components/pricing-toggle"   // internamente "use client"
import NewsletterForm from "@/components/newsletter-form" // internamente "use client"

// Questo è un Server Component: gira solo sul server
export default async function LandingPage() {
  // Il fetch avviene sul server — nessun problema di CORS, nessuna chiave API esposta
  const res = await fetch("https://api.example.com/testimonials", {
    next: { revalidate: 3600 } // ISR: rigenera i dati ogni ora
  })
  const testimonials = await res.json()

  return (
    <main>

      <section className="hero">
        <h1>Il nostro prodotto</h1>
        <p>La soluzione più veloce per il tuo team.</p>
      </section>

      <section className="pricing">
        <h2>Prezzi chiari, senza sorprese</h2>
        {/* PricingToggle è un Client Component: viene idratato automaticamente */}
        <PricingToggle />
      </section>

      {/* Le testimonianze vengono da un Server Component: HTML puro, niente JS */}
      <section className="testimonials">
        <h2>Cosa dicono di noi</h2>
        {testimonials.map((t: Testimonial) => (
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
  )
}
```

Nota l'opzione `{ next: { revalidate: 3600 } }`: è un'estensione di Next.js all'API `fetch` nativa che attiva l'**Incremental Static Regeneration**. I dati vengono cachati e rigenerati in background ogni ora, senza dover fare un nuovo fetch a ogni richiesta.

### Il punto di differenza

Guardando i due esempi fianco a fianco, la logica di fetch è sorprendentemente simile: in entrambi i casi il codice gira sul server, i dati arrivano al browser come HTML, e nessuna chiave API viene esposta al client.

La differenza è nel **controllo dell'idratazione**.

In Astro, `PricingToggle` entra nel viewport → viene idratato. `NewsletterForm` è subito disponibile perché è in cima alla pagina. Il resto è inerte.

In Next.js, `PricingToggle` e `NewsletterForm` vengono idratati non appena React è pronto nel browser — anche se l'utente non ha ancora scrollato fino al pricing. Non è necessariamente un problema, ma è un comportamento che Astro ti permette di controllare con precisione chirurgica.

Per questa pagina specifica la differenza di performance è probabilmente trascurabile. Su una pagina con dieci componenti interattivi, inizia a diventare rilevante. Su un sito con centinaia di pagine come questa, è la differenza tra un Lighthouse score di 95 e uno di 75.

---

## Developer Experience a confronto

La performance non è l'unico asse di confronto. Vale la pena considerare anche l'esperienza di sviluppo quotidiana.

**Next.js** ha un ecosistema maturo, documentazione eccellente, e una community enorme. Se conosci React, sei già a metà strada. Il modello mentale dei Server Components richiede un po' di adattamento iniziale, ma una volta acquisito è molto potente. La CLI, il dev server con hot reload, e l'integrazione nativa con Vercel sono tra i migliori del settore. TypeScript è first-class citizen. L'ecosistema di librerie compatibili è praticamente illimitato.

**Astro** ha una curva di apprendimento sorprendentemente bassa per chi viene dal mondo HTML/CSS. La sintassi dei file `.astro` è familiare: un frontmatter JavaScript e template HTML con espressioni. La documentazione è eccellente e ben organizzata. Il punto di attenzione è il modello Islands: devi pensare in anticipo a quali parti della pagina sono statiche e quali no. Questo richiede un cambio di approccio rispetto allo sviluppo React tradizionale, ma tende a produrre architetture più pulite.

Un aspetto spesso sottovalutato: Astro si integra facilmente con CMS headless come Contentful, Sanity, Storyblok o anche file Markdown locali. È una scelta comune per siti editoriali gestiti da team non tecnici.

---

## Quando scegliere Astro

Astro è la scelta giusta quando la **performance e il contenuto sono la priorità assoluta**:

- **Blog e magazine digitali** — il contenuto cambia raramente, l'interattività è minima
- **Documentazione tecnica** — velocità di navigazione e SEO sono critici
- **Siti marketing e landing page** — ogni millisecondo di LCP conta per le conversioni
- **Portfolio e siti personali** — semplicità e leggerezza prima di tutto
- **Siti editoriali con CMS** — dove il contenuto è il prodotto

Se il tuo sito è principalmente contenuto con qualche spruzzata di interattività, Astro ti darà una velocità difficile da battere con qualsiasi altra soluzione — con meno configurazione e meno codice.

---

## Quando scegliere Next.js

Next.js è la scelta giusta quando stai costruendo una **vera applicazione web**:

- **SaaS e prodotti con autenticazione** — gestione di sessioni, ruoli, dati utente
- **Dashboard e interfacce complesse** — molto stato, navigazione dinamica, aggiornamenti in tempo reale
- **E-commerce con logica dinamica** — carrello, checkout, personalizzazione, inventory in tempo reale
- **Applicazioni con API backend integrate** — quando vuoi un'unica codebase per frontend e backend
- **Prodotti che crescono nel tempo** — ecosistema maturo, TypeScript eccellente, adatto a team grandi

Se il tuo prodotto vive di stato, autenticazione, logica di business e interazione continua con il server, Next.js ti offre tutto ciò di cui hai bisogno senza dover assemblare pezzi di librerie diverse.

---

## Una nota sul futuro

Il confine tra i due framework si sta assottigliando. Astro ha introdotto il supporto per le **server routes** e le **actions**, avvicinandosi al mondo delle applicazioni fullstack. Next.js con i Server Components si è avvicinato al modello "meno JavaScript nel browser" che Astro ha sempre promosso.

Non è detto che tra qualche anno le differenze siano ancora così nette. Ma oggi rimangono due strumenti con identità distinte e casi d'uso ben definiti. La convergenza è un segnale positivo: il settore sta riconoscendo che spedire meno JavaScript al browser è quasi sempre una buona idea, e che il rendering server-side non è una feature opzionale ma un punto di partenza.

---

## Conclusione

Astro e Next.js non sono in competizione — risolvono problemi diversi, con filosofie diverse.

**Astro** parte dal contenuto e aggiunge interattività solo dove serve. Il risultato sono pagine veloci, leggere, ottimizzate per il web che la maggior parte degli utenti visita ogni giorno.

**Next.js** parte dall'applicazione e ottimizza il rendering dove può. Il risultato è una piattaforma completa per costruire prodotti digitali complessi, scalabili e manutenibili nel tempo.

La domanda giusta non è *"quale framework è migliore?"*. È *"cosa sto costruendo, e per chi?"*

Se è un sito dove il contenuto è il valore: Astro.
Se è un'applicazione dove l'interazione è il valore: Next.js.

E se non sei sicuro? Inizia dall'utente. Dove vive la sua esperienza — nella lettura o nell'interazione? La risposta è lì, non nel framework.
