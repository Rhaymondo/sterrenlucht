export interface PolicyContent {
  title: string
  body: React.ReactNode
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--foreground)]">
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
      {children}
    </p>
  )
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-4 list-disc pl-5 text-[14px] leading-relaxed text-[var(--muted)] space-y-1">
      {children}
    </ul>
  )
}

export const policies: Record<string, PolicyContent> = {
  'refund-policy': {
    title: 'Retourbeleid',
    body: (
      <>
        <P>
          Sterrenlucht-posters worden speciaal op maat gemaakt voor elke bestelling, waardoor omruilen niet mogelijk is.
          Controleer de bevestigingsdetails van je bestelling zorgvuldig. Je kunt binnen drie uur na je aankoop
          wijzigingen aanvragen.
        </P>
        <P>
          Wij streven ernaar bestellingen op tijd te leveren en aan onze kwaliteitsnormen te voldoen. Als een bestelling
          beschadigd aankomt of niet aan de verwachte kwaliteit voldoet, neem dan binnen één week na ontvangst contact
          met ons op via{' '}
          <a
            href="mailto:angelo@sterrenlucht.nl"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            angelo@sterrenlucht.nl
          </a>{' '}
          met je ordernummer. Wij lossen het op.
        </P>
      </>
    ),
  },

  'shipping-policy': {
    title: 'Verzendbeleid',
    body: (
      <>
        <H2>Verzendkosten</H2>
        <P>Voor gedrukte posters berekenen wij €4,95 verzendkosten. Digitale bestellingen worden gratis geleverd via e-mail.</P>

        <H2>Verwerkingstijd</H2>
        <P>
          Bestellingen worden verwerkt binnen 3 tot 4 werkdagen na betalingsbevestiging. Binnen drie uur na het plaatsen
          van je bestelling kun je nog wijzigingen aanvragen.
        </P>

        <H2>Verzending & tracking</H2>
        <P>
          Verzending in Nederland verloopt via PostNL. Zodra je pakket is opgehaald, ontvang je per e-mail een
          trackingnummer waarmee je de bezorging kunt volgen.
        </P>
      </>
    ),
  },

  'terms-of-service': {
    title: 'Algemene voorwaarden',
    body: (
      <>
        <P>
          Sterrenlucht is gevestigd op Heemraadserf 2, 3991 KA Houten, Nederland (KVK 92659209).
        </P>

        <H2>Toepasselijkheid</H2>
        <P>
          Deze voorwaarden zijn van toepassing op alle bestellingen die via sterrenlucht.nl worden geplaatst.
          De koopovereenkomst komt tot stand op het moment dat een klant het bestelformulier volledig heeft ingevuld
          en bevestigd.
        </P>

        <H2>Prijzen</H2>
        <P>
          Sterrenlucht behoudt zich het recht voor productprijzen aan te passen. Kortingscodes zijn uitsluitend
          bedoeld voor persoonlijk gebruik en mogen niet commercieel worden ingezet of worden gebruikt om
          geautomatiseerd verkeer te genereren.
        </P>

        <H2>Betaling</H2>
        <P>
          Betalen kan via iDEAL, Klarna of bankoverschrijving. Bij betaling per bankoverschrijving wordt de
          bestelling pas in behandeling genomen nadat het bedrag is bijgeschreven.
        </P>

        <H2>Levering</H2>
        <P>
          Verzending in Nederland verloopt via PostNL. Levertijden zijn indicatief en vereisen geen handtekening
          bij ontvangst.
        </P>

        <H2>Annulering & wijziging</H2>
        <P>
          Je kunt een bestelling zonder opgaaf van reden annuleren tot 10:00 uur CET op de dag volgend op het
          moment van bestellen. Wijzigingen aan productspecificaties zijn tot datzelfde tijdstip mogelijk.
        </P>

        <H2>Maatwerk & retour</H2>
        <P>
          Omdat alle producten op maat worden gemaakt, zijn retourzendingen niet mogelijk — tenzij het product
          bij aankomst een kwaliteitsgebrek vertoont.
        </P>

        <H2>Intellectueel eigendom</H2>
        <P>
          Alle content op deze website is auteursrechtelijk beschermd. Reproductie vereist schriftelijke
          toestemming van Sterrenlucht.
        </P>

        <H2>Toepasselijk recht</H2>
        <P>
          Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de
          bevoegde rechter in het arrondissement van Houten.
        </P>
      </>
    ),
  },

  'privacy-policy': {
    title: 'Privacybeleid',
    body: (
      <>
        <P>
          <strong>Laatst bijgewerkt: 14 oktober 2025</strong>
        </P>
        <P>
          In dit Privacybeleid wordt beschreven hoe Sterrenlucht (de 'Site', 'wij', 'ons' of 'onze') jouw persoonlijke
          gegevens verzamelt, gebruikt en doorgeeft wanneer je onze services bezoekt, gebruikt of een aankoop doet bij
          sterrenlucht.nl (de 'Site') of op een andere manier met ons communiceert over de Site (gezamenlijk de
          'Services'). Voor het doel van dit Privacybeleid verwijzen 'je' en 'jou(w)' naar jou als gebruiker van de
          Services, of je nu een klant, websitebezoeker of een andere persoon bent van wie we informatie hebben
          verzameld op grond van dit Privacybeleid.
        </P>
        <P>Lees dit Privacybeleid aandachtig door.</P>

        <H2>Wijzigingen in dit Privacybeleid</H2>
        <P>
          We kunnen dit Privacybeleid van tijd tot tijd bijwerken, onder meer om wijzigingen in onze werkwijzen weer te
          geven of om andere operationele, juridische of regelgevende redenen. We plaatsen het bijgewerkte
          Privacybeleid op de Site en passen de datum bij 'Laatst bijgewerkt' aan.
        </P>

        <H2>Welke persoonlijke gegevens we verzamelen</H2>
        <P>
          Welke soort persoonlijke gegevens we over jou verkrijgen, is afhankelijk van je interactie met onze Site en
          je gebruik van onze Services. De volgende categorieën zijn van toepassing:
        </P>

        <H2>Informatie die we rechtstreeks van jou verzamelen</H2>
        <UL>
          <li><strong>Contactgegevens</strong> — naam, adres, telefoonnummer en e-mailadres.</li>
          <li><strong>Bestelgegevens</strong> — naam, factuuradres, bezorgadres, betalingsbevestiging, e-mailadres en telefoonnummer.</li>
          <li><strong>Informatie over klantenondersteuning</strong> — informatie die je opneemt in communicatie met ons.</li>
        </UL>

        <H2>Informatie die we verzamelen over je gebruik</H2>
        <P>
          We kunnen automatisch bepaalde informatie verzamelen over je interactie met de Services ('Gebruiksgegevens'),
          waaronder apparaat- en browserinformatie, netwerkverbinding, IP-adres en andere interactiegegevens. Hiervoor
          kunnen we cookies en vergelijkbare technologieën gebruiken.
        </P>

        <H2>Informatie die we verkrijgen van derden</H2>
        <P>
          We kunnen informatie verkrijgen van serviceproviders die namens ons informatie verzamelen, zoals onze
          betalingsverwerker. Die verwerkt betalingsgegevens (bankrekening- of kaartgegevens, factuuradres) uitsluitend
          om je betaling te voltooien en je bestelling uit te voeren.
        </P>

        <H2>Hoe wij je persoonlijke gegevens gebruiken</H2>
        <UL>
          <li><strong>Levering van producten en services</strong> — betalingen verwerken, bestellingen uitvoeren, verzending regelen en je account beheren.</li>
          <li><strong>Marketing en communicatie</strong> — promotionele e-mails sturen (je kunt je te allen tijde afmelden via de afmeldlink in de e-mail).</li>
          <li><strong>Beveiliging en fraudepreventie</strong> — mogelijke frauduleuze of kwaadwillige activiteiten opsporen en onderzoeken.</li>
          <li><strong>Serviceverbetering</strong> — klantenondersteuning bieden en onze Services verbeteren.</li>
        </UL>

        <H2>Cookies</H2>
        <P>
          Net als veel andere websites gebruiken wij cookies op onze Site om de Site en onze Services te ondersteunen
          en te verbeteren, analyses uit te voeren en inzicht te krijgen in gebruikersinteractie. Je kunt cookies
          verwijderen of weigeren via je browserinstellingen. Houd er rekening mee dat dit een negatieve invloed kan
          hebben op je gebruikerservaring.
        </P>

        <H2>Hoe we persoonlijke gegevens bekendmaken</H2>
        <P>In bepaalde omstandigheden kunnen we je persoonlijke gegevens aan derden bekendmaken, zoals:</P>
        <UL>
          <li>Leveranciers en serviceproviders die namens ons diensten uitvoeren (betalingsverwerking, verzending, IT-beheer).</li>
          <li>Zakelijke en marketingpartners, die jouw gegevens gebruiken in overeenstemming met hun eigen privacyverklaringen.</li>
          <li>Partijen betrokken bij een zakelijke transactie zoals een fusie, of wanneer wettelijk verplicht.</li>
        </UL>

        <H2>Door gebruiker gegenereerde content</H2>
        <P>
          Als je content indient op openbare delen van de Services, is die content openbaar toegankelijk. Wij zijn niet
          verantwoordelijk voor de privacy of veiligheid van informatie die je openbaar deelt.
        </P>

        <H2>Websites en links van derden</H2>
        <P>
          Onze Site kan links bevatten naar websites van derden. Wij zijn niet verantwoordelijk voor de privacy of
          veiligheid van die sites en raden je aan hun privacybeleid te lezen.
        </P>

        <H2>Gegevens van kinderen</H2>
        <P>
          De Services zijn niet bedoeld voor gebruik door kinderen. Wij verzamelen niet bewust persoonlijke gegevens
          van personen jonger dan 16 jaar. Als je vermoedt dat een kind ons gegevens heeft verstrekt, kun je contact
          opnemen via onderstaand e-mailadres.
        </P>

        <H2>Beveiliging en bewaring</H2>
        <P>
          Geen enkele beveiligingsmaatregel is perfect of ondoordringbaar. We raden je aan geen gevoelige informatie
          via onveilige kanalen naar ons te sturen. Hoe lang we je gegevens bewaren, hangt af van factoren zoals
          accountbeheer, wettelijke verplichtingen en lopende geschillen.
        </P>

        <H2>Jouw rechten</H2>
        <P>Afhankelijk van waar je woont, kun je de volgende rechten hebben:</P>
        <UL>
          <li><strong>Recht op toegang</strong> — inzage in de persoonlijke gegevens die we over jou bewaren.</li>
          <li><strong>Recht om te verwijderen</strong> — verzoek tot verwijdering van jouw gegevens.</li>
          <li><strong>Recht op correctie</strong> — verzoek tot correctie van onjuiste gegevens.</li>
          <li><strong>Recht op dataportabiliteit</strong> — ontvangen van een kopie van jouw gegevens.</li>
          <li><strong>Recht om je af te melden</strong> — bezwaar tegen gebruik van jouw gegevens voor gerichte reclame.</li>
          <li><strong>Intrekking van toestemming</strong> — eerder gegeven toestemming intrekken.</li>
        </UL>
        <P>
          Je kunt deze rechten uitoefenen door contact met ons op te nemen via{' '}
          <a
            href="mailto:angelo@sterrenlucht.nl"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            angelo@sterrenlucht.nl
          </a>
          . Wij zullen niet discrimineren als je een van deze rechten uitoefent.
        </P>

        <H2>Klachten</H2>
        <P>
          Als je niet tevreden bent met onze reactie op een klacht, heb je het recht om je klacht in te dienen bij
          de Autoriteit Persoonsgegevens of een andere bevoegde toezichthoudende autoriteit.
        </P>

        <H2>Internationale gebruikers</H2>
        <P>
          Je persoonlijke gegevens kunnen worden overgedragen, opgeslagen en verwerkt buiten het land waarin je woont.
          Bij overdrachten buiten Europa vertrouwen wij op erkende mechanismen zoals de modelcontractbepalingen van de
          Europese Commissie.
        </P>

        <H2>Contact</H2>
        <P>
          Heb je vragen over ons privacybeleid of wil je een van je rechten uitoefenen? Neem dan contact met ons op
          via{' '}
          <a
            href="mailto:angelo@sterrenlucht.nl"
            className="underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            angelo@sterrenlucht.nl
          </a>{' '}
          of schrijf naar Heemraadserf 2, 3991 KA Houten, Nederland.
        </P>
        <P>
          Sterrenlucht is de verwerkingsverantwoordelijke voor je persoonlijke gegevens in het kader van de
          toepasselijke wetgeving inzake gegevensbescherming.
        </P>
      </>
    ),
  },
}
