# Nola Dev's Site

## What Is This?

This is a website for Nola Devs, an organization made up of New Orleanian Software Developers.
It serves as a hub for many other local organizations and meetups.

MVP is currently live at this domain: [https://www.noladevs.org/](https://www.noladevs.org/).

## What Is This For?

This application hosts individual group sites, events, and contact information for New Orleans-based Software Development, Tech, Networking, Design... ect. groups.

---

### Tech Stach Reference

- [Svelte Simple Icons](https://github.com/icons-pack/svelte-simple-icons)
- [Simple Icons](https://simpleicons.org)

---

## Setup Development Environment

Just install all of the dependencies in any NPM-equivalent package manager, and then run the dev script.

This will run the web app under a "development" node environment, meaning that it will not load any external resources which may require secrets (API Keys, etc).

```
npm i
npm run dev
```

## Setup Production Environment

Make sure you have both your Google Calendar API Key and your Discord Webhook URL.
Once you have both created (copy `.env.example`) and added to your `.env.local` file (or any other equivalent environment variable system), you can actually deploy it.

Instead of just running in the development environment, now the site is built and than served (which is how it would run on Vercel).

To run the production environment, simply run these commands (and have environment variables populated).

```
npm i
npm run build
npm run preview
```

### Google Calendar API Key

Basic Abridged Guide:

1. Go to Google Cloud Console
2. Create new project (call it anything you want)
3. Navigate to API -> Library
4. Search for Google Calendar API -> Enable it.
5. Go to "Credentials", click "Create Credentials".
6. Click API Key, fill out all of the required fields.
7. Now put that API Key into your `.env.local` as CALENDAR_KEY

### Mapbox Public Key

1. Head over to Maxbox
2. Make an account
3. Use a Public key

- if your api key doesnt start with pk it isn't the right one

4.

---

## Contribute

Join our [Discord](https://discord.gg/Hea5n85VEv)

This project is open-source, however, pull and merge requests will be limited to developers limited to the geographic region of Greater New Orleans and surrounding areas. If you reside in or around NOLA please feel free to add whatever supporting information or custom styling you feel would benefit our local community's represenation.

If you reside in or around NOLA consider this community website a deployed sandbox environment. PRs will be scrutinized by one of the four original Contributors: @austinchaet @codingMustache @colinwilliams91 @HeyImKyle

### Contribution Protocol:

_we have transitioned away from [a forking git workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow) to a [forkless/trunk feature-branch hybrid git workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)_

- ~~Star and Fork the repository~~
- Clone down the organization's repo as your `origin` ("the trunk" | "the org repo" | "org remote" | "origin")
- Create or pick up a "ticket" from our [GitHub Issues](https://github.com/Nola-Devs/Nola-Dev-Site/issues)
  - Create a branch directly from that ticket's full view on GitHub
- Fetch from `origin main` in your IDE and checkout your new feature-branch which should share the same name as the issuing ticket
- Use [Semantic Commit-Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) for feature development
- Push your feature-branch to the trunk remote `git push origin feature/ticket-branch`
- PR to main for Code Review
  - We will review <= 48 hours
- Merge your approved PR branch to main or revise and repeat

_if your code has linting errors please run `npm run lint -- --fix` :)_
