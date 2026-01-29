# Wild Fitness - Laura Ramírez | Entrenadora Personal & Guia de Muntanya

![Wild Fitness](https://img.shields.io/badge/Mountain-Training-2D5016?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-4CAF50?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web-D84315?style=for-the-badge)

## 🏔️ Sobre el Projecte

**Wild Fitness** és la plataforma web professional de Laura Ramírez, entrenadora personal independent especialitzada en entrenament de força funcional i trail running. Certificada oficialment pel Govern de Catalunya (ROPEC 062645).

## 👤 Sobre Laura Ramírez

Laura Ramírez és entrenadora personal independent i guia de muntanya certificada. Amb formació oficial homologada pel Govern de Catalunya, està especialitzada en entrenament de força funcional i trail running.

**Certificacions Oficials:**
- ROPEC 062645 (Registre Oficial de Professionals de l'Esport de Catalunya)
- Certificat de Professionalitat - Govern de Catalunya
- Guia Baixa i Mitjana Muntanya
- Entrenadora Funcional

## ✨ Característiques

- **🎨 Disseny UX Millorat**: Experiència d'usuari intuïtiva i visualment agradable
- **📱 Disseny Responsive**: Optimitzat per a tots els dispositius (mòbil, tauleta, escriptori)
- **⚡ Rendiment Optimitzat**: Càrrega ràpida amb animacions fluides
- **🎭 Microinteraccions**: Feedback visual en cada interacció de l'usuari
- **♿ Accessibilitat WCAG 2.1**: Navegació per teclat i lectors de pantalla
- **📧 Formulari Intel·ligent**: Validació en temps real amb icones visuals
- **🎯 Animacions Suaus**: Transicions CSS i JavaScript optimitzades
- **🔄 Estats de Càrrega**: Estats de càrrega clars en formularis i botons
- **💾 Gestió de Clients**: Emmagatzematge automàtic a Formspree o Google Sheets
- **🎨 Paleta Turquesa**: Colors moderns i professionals
- **🏷️ Badges de Credibilitat**: ROPEC, 50+ alumnes, contingut exclusiu
- **📊 SEO Optimitzat**: Configurat per a màxima visibilitat en cercadors

## 🎯 Millores de UX Implementades

### 🖱️ Interactivitat
- **Efectes Ripple**: Animació d'ona en botons al fer clic
- **Estats Hover**: Resposta visual immediata en tots els elements interactius
- **Scroll Suau**: Navegació fluida entre seccions
- **Header Dinàmic**: S'amaga/mostra automàticament al fer scroll

### ✅ Formulari de Contacte
- **Validació en Temps Real**: Feedback instantani mentre escrius
- **Icones de Validació**: Checkmarks verds i X vermelles
- **Comptador de Caràcters**: Per al camp de missatge
- **Estat de Càrrega**: Spinner animat en enviar
- **Efecte Confetti**: Celebració en enviar amb èxit
- **Missatges Animats**: Èxit i error amb animacions

### 🎨 Animacions
- **Parallax Subtil**: Imatge de l'hero amb zoom suau
- **Fade In Up**: Les seccions apareixen al fer scroll
- **Badge Bounce**: Els badges reboten subtilment
- **Button Pulse**: El botó principal polsa per cridar l'atenció
- **Smooth Transitions**: Totes les transicions són fluides (cubic-bezier)

### ♿ Accessibilitat
- **Navegació per Teclat**: Tab, Enter, Escape funcionen correctament
- **Focus Visible**: Borda clar en elements enfocats
- **ARIA Labels**: Etiquetes per a lectors de pantalla
- **Contrast WCAG 2.1**: Tots els textos compleixen el nivell AA
- **Skip Links**: Saltar al contingut principal

### 📱 Responsive
- **Mobile First**: Dissenyat primer per a mòbil
- **Touch Friendly**: Botons grans i espaiats
- **Viewport Optimitzat**: Funciona en pantalles des de 320px
- **Imatges Adaptatives**: S'ajusten a la mida de la pantalla

## 🚀 Tecnologies

- **HTML5**: Estructura semàntica i accessible
- **CSS3**: Disseny modern amb variables CSS i flexbox/grid
- **JavaScript Vanilla**: Sense dependències, codi net i eficient
- **Google Fonts**: Tipografies Montserrat i Open Sans
- **Vercel**: Hosting professional amb funcions serverless

## 📂 Estructura del Projecte

```
wild-fitness/
├── index.html          # Pàgina principal
├── blog.html           # Pàgina de blog
├── styles.css          # Estils CSS
├── script.js           # JavaScript
├── CNAME              # Configuració de domini personalitzat
├── CONFIGURACION-FORMULARIO-CONTACTO.md  # Guia de configuració del formulari
└── README.md          # Documentació
```

## 🌐 Desplegament

**Plataforma:** Vercel
**Domini:** wild-fitness.com

El lloc es desplega automàticament a Vercel quan es fa push a la branca principal. Vercel proporciona:
- ✅ Desplegaments automàtics des de Git
- ✅ Funcions serverless (API per a enviament d'emails)
- ✅ SSL automàtic i CDN global
- ✅ Preview deployments per a cada PR

**📖 Guia completa:** Veure [`DESPLIEGUE-VERCEL.md`](DESPLIEGUE-VERCEL.md)

### Configuració DNS (Cloudflare)

Registres DNS necessaris:
```
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
CNAME www wild-fitness.com
```

### SSL/TLS (Cloudflare)

- **Encryption Mode**: Full (strict)
- **Always Use HTTPS**: Activat
- **TLS Version**: 1.2+
- **HSTS**: Habilitat

## 🎨 Paleta de Colors

- **Primary Teal**: `#2d7d7d` (Verd blavós profund)
- **Secondary Turquoise**: `#3fb5b5` (Turquesa brillant)
- **Accent Light**: `#5fcaca` (Turquesa clar)
- **Overlay**: `rgba(45, 125, 125, 0.75)` (Capa turquesa)
- **Text**: `#1e293b` (Negre principal)
- **Background**: `#f0f9f9` (Gris-turquesa molt clar)

## 📱 Seccions

1. **Hero Section**: Impacte visual amb imatge de muntanya i overlay turquesa
2. **Badges de Credibilitat**: Certificació ROPEC, 50+ alumnes, contingut exclusiu
3. **Botons d'Acció**: Prova Gratuïta i WhatsApp directe
4. **Característiques**: 4 característiques principals del servei
5. **Programes**: 3 nivells d'entrenament amb preus
6. **Sobre Mi**: Història de l'entrenadora i certificacions
7. **Testimonis**: 3 històries reals de clients
8. **Galeria**: Imatges d'entrenament
9. **Blog Preview**: Últims articles del blog
10. **📧 Formulari de Contacte Complet**: Amb gestió de dades externa
11. **CTA**: Crida a l'acció per a consulta gratuïta
12. **Peu de pàgina**: Links, contacte i legal

## 🔧 Personalització

### 📧 Configurar el Formulari de Contacte

Veure [`CONFIGURACION-FORMULARIO-CONTACTO.md`](CONFIGURACION-FORMULARIO-CONTACTO.md) per a instruccions detallades sobre com configurar l'enviament de formularis a Google Sheets o Formspree.

---
Desenvolupat amb ❤️ per Wild Fitness
