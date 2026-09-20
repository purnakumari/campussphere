# CampusSphere: AI Student Success & Peer Study Hub

A glassmorphic dark-mode dashboard that helps students understand their notes, find classmates to learn from, and see where their study time goes.

**Live demo:** https://<your-username>.github.io/campussphere/

## Features

- **AI notes summarizer:** paste lecture notes and get key points, key concepts, and self-test questions. Choose the length (brief, standard, detailed) and format (bullets or paragraph), then copy the result or save it to your library.
- **Peer skill exchange:** find classmates by trading skills. Each peer gets a match score from what they can teach you and what you can teach them. Live search, category filters, an availability toggle, sorting, profile view, and session requests.
- **Study analytics:** a stacked bar chart and doughnut chart update instantly when you log a session or finish a focus timer. Includes weekly goal tracking, best day, top subject, and daily average.
- **Persistent data:** progress is saved in the browser with localStorage.

## How the summarizer works

The summarizer runs entirely in the browser with no API calls, so your notes never leave the page. It splits notes into sentences, removes stopwords, applies a light stemmer, scores each sentence by normalized term frequency with a boost for the first and last sentences, and returns the top sentences in their original order.

## How peer matching works

Each peer has a "can teach" list and a "wants to learn" list. The match score rewards peers who teach what you want (weighted highest), peers who want what you teach, and peers who are currently available. Peers matching in both directions are marked as a mutual match.

## Tech stack

HTML5, CSS3, vanilla JavaScript (ES6+), Tailwind CSS (CDN), Chart.js 4, Font Awesome 6, Google Fonts (Sora, DM Sans). No build step and no dependencies to install.

## Run locally

1. Clone or download this repository.
2. Open the folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**, or just double-click `index.html`.

An internet connection is needed for the CDN-hosted libraries.

## Project structure

```
campussphere/
├── index.html
├── script.js
└── README.md
```

## Future work

- Optional LLM-powered summaries
- Backend and accounts for real peer matching
- Calendar sync for scheduled study sessions

## Author

<SAMPARTHI PURNA KUMARI>, <DADI INSTITUTE OF ENGINEERING AND TECHNOLOGY>