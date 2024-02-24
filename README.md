# Nola Devs

        _   ______  __    ___       ____
       / | / / __ \/ /   /   |     / __ \___ _   _______
      /  |/ / / / / /   / /| |    / / / / _ \ | / / ___/
     / /|  / /_/ / /___/ ___ |   / /_/ /  __/ |/ (__  )
    /_/ |_/\____/_____/_/  |_|  /_____/\___/|___/____/

# What is this?

This is a website for Nola Devs, an organization made up of New Orleanian Software Developers.
It serves as a hub for many other local organizations and meetups.

This application hosts individual group sites, events, and contact information for New Orleans-based Software Development, Tech, Networking, Design... etc. groups.

MVP is currently live at this domain: [https://www.noladevs.org/](https://www.noladevs.org/).

# Who is this for?

The purpose of this app is to be a central hub for for the NOLA dev community

---

## Tech Stack

- [Svelte Simple Icons](https://github.com/icons-pack/svelte-simple-icons)
- [Simple Icons](https://simpleicons.org)
- [mongodb](https://www.mongodb.com/)

---

# Set up

## Development Environment

1. Install [mongodb](https://www.mongodb.com/docs/manual/installation/) if not already installed locally.
2. Copy example env to get local up and running.

```sh
cp .env.example .env.local
```

4. Install dependencies and start app

```sh
npm i
npm run dev
```

5. This will run the web app under a _development_ node environment, meaning that it will not load any external resources which may require secrets (API Keys, etc).
6. You now should be up and running to start developing 🥸

## Production Environment

### API Keys you will need

- Google Calendar API
  - [Follow these steps](https://github.com/Nola-Devs/Nola-Devs-v2?tab=readme-ov-file#google-calendar-api-key)
- Discord Webhook URL
  - Apply for Contributor Access to [this channel](https://discord.com/channels/1117944495099613254/1166366239652847687/1166367256356335636) if you don't have it already.
  - Copy the pinned URL for your `.env`
- Mapbox Public API Key
  - [Follow these steps](https://github.com/Nola-Devs/Nola-Devs-v2?tab=readme-ov-file#mapbox-public-key)
- Cron Secret
  - _Coming soon..._
- DB Name
  - `noladevs`
- DB Connection URL
  - _Coming soon..._

Make sure you have created the above keys with provided values or your own where indicated.
Once you have both created (copy `.env.example`) and added to your `.env.local` file (or any other equivalent environment variable system), you can actually deploy it. (_instructions in hyperlinks_)

Instead of just running in the development environment, now the site will be built and then served (which is how it would run on Vercel).

To run the production environment, simply run these commands (and have environment variables populated).

```sh
npm i
npm run build
npm run preview
```

## API Key Instructions (where applicable):

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

1. Head over to Mapbox
2. Make an account
3. Use a Public key

- if your api key doesnt start with pk it isn't the right one

---

## [Contribute](./CONTRIBUTING.md)

Join our [Discord](https://discord.gg/Hea5n85VEv)

### Contribution Protocol:

_we use a [forkless/trunk feature-branch hybrid git workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)_

- 🌟 Star the repository 😁
- 📌 Clone down the organization's repo as your `origin` ("the trunk" | "the org repo" | "org remote" | "origin")
- 📌 Find a "Feature" from our [Project Board](https://github.com/orgs/Nola-Devs/projects/1) that you would like to work on
  - Inside that "Feature Board" will be "Tickets" (Issues) to pick up. If you have a suggestion open a [new Issue](https://github.com/Nola-Devs/Nola-Devs-v2/issues/new/choose) with the Issue Template provided
  - Assign yourself to the ticket and move it into the "In Progress" lane inside it's respective "Feature Board"
  - Create a branch directly from that ticket's full view on GitHub<sup>see diagram 1.0 - 1.2</sup>
- 📌 Fetch from `origin main` (paste what you copied) in your IDE and checkout your new feature-branch which should share the same name as the issuing ticket
- 📌 Use [Semantic Commit-Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) for feature development
- 📌 Push your feature-branch to the trunk remote `git push origin feature/ticket-branch`
- 📌 PR to main for Code Review
  - We will review <= 48 hours
- 🎇 Merge your approved PR branch to main or revise and repeat

### Footnotes:

diagram<sup>1.0</sup>
![image](https://github.com/Nola-Devs/Nola-Devs-v2/assets/92059005/2e40f7b5-e109-4062-b323-96228da620bd)

diagram<sup>1.1</sup>
![image](https://github.com/Nola-Devs/Nola-Devs-v2/assets/92059005/012294aa-41c0-4a0e-aa19-1ea287045eb5)

diagram<sup>1.2</sup>
![image](https://github.com/Nola-Devs/Nola-Devs-v2/assets/92059005/9ebcf2a7-ef65-43ff-8cf4-193af1a6239b)
