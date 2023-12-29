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

## To Run:

### Setup Development Environment

Just install all of the dependencies in any NPM-equivalent package manager, and then run the dev script.

This will run the web app under a "development" node environment, meaning that it will not load any external resources which may require secrets (API Keys, etc).

```ts
npm i
npm run dev
```

### Setup Production Environment

_API Keys you will need_

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

```ts
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

1. Head over to Maxbox
2. Make an account
3. Use a Public key

- if your api key doesnt start with pk it isn't the right one

---

## Contribute

Join our [Discord](https://discord.gg/Hea5n85VEv)

This project is open-source, however, pull and merge requests will be limited to developers limited to the geographic region of Greater New Orleans and surrounding areas. If you reside in or around NOLA please feel free to add whatever supporting information or custom styling you feel would benefit our local community's represenation.

If you reside in or around NOLA consider this community website a deployed sandbox environment. PRs will be scrutinized by one of the four original Contributors: @austinchaet @codingMustache @colinwilliams91 @HeyImKyle

### Contribution Protocol:

_we use a [forkless/trunk feature-branch hybrid git workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)_

- Star the repository :)
- Clone down the organization's repo as your `origin` ("the trunk" | "the org repo" | "org remote" | "origin")
- Create or pick up a "ticket" from our [GitHub Issues](https://github.com/Nola-Devs/Nola-Dev-Site/issues)
  - Create a branch directly from that ticket's full view on GitHub<sup>see diagram 1.0 - 1.2</sup>
- Fetch from `origin main` (paste what you copied) in your IDE and checkout your new feature-branch which should share the same name as the issuing ticket
- Use [Semantic Commit-Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) for feature development
- Push your feature-branch to the trunk remote `git push origin feature/ticket-branch`
- PR to main for Code Review
  - We will review <= 48 hours
- Merge your approved PR branch to main or revise and repeat

_if your code has linting errors please run `npm run lint -- --fix` :)_

### Footnotes:

diagram<sup>1.0</sup>
![image](https://github.com/Nola-Devs/Nola-Devs-v2/assets/92059005/2e40f7b5-e109-4062-b323-96228da620bd)

diagram<sup>1.1</sup>
![image](https://github.com/Nola-Devs/Nola-Devs-v2/assets/92059005/012294aa-41c0-4a0e-aa19-1ea287045eb5)

diagram<sup>1.2</sup>
![image](https://github.com/Nola-Devs/Nola-Devs-v2/assets/92059005/9ebcf2a7-ef65-43ff-8cf4-193af1a6239b)
