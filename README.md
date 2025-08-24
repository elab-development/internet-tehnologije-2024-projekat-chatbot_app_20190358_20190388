# Aurora AI – Full-Stack Web Aplikacija (React + Laravel)

**Aurora AI** je moderna full-stack aplikacija koja demonstrira role-based pristup, AI čat, generisanje slika, napredni model i administrativne panele. Backend je u **Laravelu** (Sanctum, REST API), a frontend u **Reactu** (MUI, Recharts, animacije, responzivan UI).

![Aurora AI Demo](./gif/auroraai.gif)

---

## Sadržaj
- [Funkcionalnosti](#funkcionalnosti)
- [Uloge korisnika](#uloge-korisnika)
- [Arhitektura](#arhitektura)
- [Instalacija i pokretanje](#instalacija-i-pokretanje)
  - [Backend (Laravel)](#backend-laravel)
  - [Frontend (React)](#frontend-react)
  - [Primer .env fajlova](#primer-env-fajlova)
- [Rute i API (skraćeni pregled)](#rute-i-api-skraceni-pregled)
- [Struktura projekta](#struktura-projekta)
- [Napomene o bezbednosti](#napomene-o-bezbednosti)
- [Licenca](#licenca)

---

## Funkcionalnosti

- 🔐 **Autentikacija** preko **Laravel Sanctum**: registracija, prijava, odjava; token se čuva u `sessionStorage`.
- 👤 **Role-based navigacija i dozvole**:
  - **Neulogovani korisnik**: vidi **Register** i **Login**.
  - **Regularni korisnik**: **Home**, **About Us**, **Chat**, **Subscription Plan**; po planu se otključavaju **Generate Image** (premium) i **Advanced Model** (pro).
  - **Admin**: **Admin Dashboard**, **Analytics**, **User Management** (poseban meni i rute).
- 💳 **Pretplate** (Free / Premium / Pro): izbor i vizuelna oznaka **Current plan**; zabrana ponovne pretplate na aktivni plan.
- 💬 **Chat**: istorija razgovora (pitanje/odgovor) se čuva u bazi; posebna ruta za **napredni model**.
- 🖼️ **Generisanje slika**: dostupno prema planu (premium/pro).
- 📊 **Analitika (admin)**: **Recharts** grafikoni + kartice suma (distribucija pretplata, broj admina, regulara, free/paid).
- 👥 **Upravljanje korisnicima (admin)**: tabela sa **paginacijom (4 po strani)**, **pretragom po imenu/emailu**, **sortiranjem**, **filterom po planu**, **brisanje** korisnika.
- 🔄 **Reset lozinke**: iz **Login** ekrana, *“Forgot password?”* otvara modal (public ruta `/api/reset-password` za demo svrhe).

---

## Uloge korisnika

### 1) Neulogovani korisnik (guest)
- Vidljiv samo **Register** i **Login**.
- Posle uspešne prijave:
  - Ako je **admin** → preusmerenje na **`/admin-dashboard`**
  - Inače → **`/home`**

### 2) Regularni korisnik
- Navigacija: **Home**, **About Us**, **Chat**, **Subscription Plan**.
- Ako plan = **Premium** → dodatno **Generate Image**.
- Ako plan = **Pro** → dodatno **Advanced Model**.

### 3) Admin
- Polazna stranica: **`/admin-dashboard`** (breadcrumbs skriven).
- Navigacija: **Home** (vodi na `/admin-dashboard`), **Analytics**, **User Management**.
- Alati: grafikoni, pregled korisnika (CRUD delete).

---

## Arhitektura

**Frontend**
- **React** + **React Router**, **MUI** (stilovi i komponente), **Recharts** (grafikoni).
- Dinamičan meni prema ulozi i planu; animirani naslovi (typewriter), “neon” gradijenti.
- Globalno stanje autentikacije i plana kroz `sessionStorage`.

**Backend**
- **Laravel** + **Sanctum**, REST API, **Eloquent** modeli: `User`, `Subscription`, `ChatHistory`.
- Resource sloj (`UserResource`, `SubscriptionResource`, …) za dosledne JSON odgovore.
- Rute za autentikaciju, pretplate, statistiku, istoriju četa, napredni model i administraciju.

---

## Instalacija i pokretanje

### Backend (Laravel)

**Preuslovi**: PHP 8.2+, Composer, MySQL/PostgreSQL (ili SQLite)

KOD U TEMRINALU
---------------------------

1. Klonirajte repozitorijum:
```bash
    git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-chatbot_app_20190358_20190388.git
```
2. Pokrenite backend:
```bash
   cd chatbot-backend
   composer install
   php artisan migrate:fresh --seed
   php artisan serve
```
    
3. Pokrenite frontend:
```bash
   cd chatbot-frontend
   npm install
   npm start
```
    
4.  Frontend pokrenut na: [http://localhost:3000](http://localhost:3000) Backend API pokrenut na: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
