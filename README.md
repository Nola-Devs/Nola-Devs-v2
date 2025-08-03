# Nola Devs

        _   ______  __    ___       ____
       / | / / __ \/ /   /   |     / __ \___ _   _______
      /  |/ / / / / /   / /| |    / / / / _ \ | / / ___/
     / /|  / /_/ / /___/ ___ |   / /_/ /  __/ |/ (__  )
    /_/ |_/\____/_____/_/  |_|  /_____/\___/|___/____/

- [Nola Devs](#nola-devs)
- [What is this?](#what-is-this)
- [Who is this for?](#who-is-this-for)
  - [Submit an event](#submit-an-event)
- [Contribute](#contribute)
- [Tech Stack](#tech-stack)
- [Set up](#set-up)
  - [Development Environment](#development-environment)
  - [Production Environment](#production-environment)
    - [API Keys you will need](#api-keys-you-will-need)
  - [API Key Instructions (where applicable):](#api-key-instructions-where-applicable)
    - [Google Calendar API Key](#google-calendar-api-key)
    - [Mapbox Public Key](#mapbox-public-key)
- [Other links](#other-links)

# What is this?

This is a website for Nola Devs, an organization made up of New Orleanian Software Developers.
It serves as a hub for many other local organizations and meetups.

This application hosts individual group sites, events, and contact information for New Orleans-based Software Development, Tech, Networking, Design... etc. groups.

MVP is currently live at this domain: [https://www.noladevs.org/](https://www.noladevs.org/).

# Who is this for?

The purpose of this app is to be a central hub for for the NOLA dev community

## Submit an event

Currently, all events are aggregated from Google Calendars belonging to established groups.

For example: the Below C Level is a group that has a Google Calendar. They add upcoming events to their calendar, then once a day from that calendar, we grab all the events that are happening in the next 30 days.

Add an event to your group's calendar and it will be listed on the landing page the next day.

If you have a new group you want to establish, please leave a message on the #general channel in the [community Slack](https://join.slack.com/t/nola/shared_invite/zt-33so6nl8m-qDq5rDFrMnw5eeXcERP7jA) or create an [issue](https://github.com/Nola-Devs/Nola-Devs-v2/issues) on the repository for the site. We will respond shortly after.

# Contribute

To contribute please follow the [contributing](./CONTRIBUTING.md) guide.

---

# Tech Stack

- [Svelte Simple Icons](https://github.com/icons-pack/svelte-simple-icons)
- [Simple Icons](https://simpleicons.org)
- [mongodb](https://www.mongodb.com/)

---

# Set up

## Development Environment

1. Install [mongodb v7.x.x Community Edition](https://www.mongodb.com/docs/manual/installation/) if not already installed locally.

   1. [Mac](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
      1. [Start the database](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/#run-mongodb-community-edition)
   2. [Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
      1. [Start the database](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition-as-a-windows-service)

2. Copy example env to get local up and running.

```sh
cp .env.example .env.local
```

**Note: On node >=17, you'll need to replace localhost with 0.0.0.0 ([src](https://stackoverflow.com/questions/46523321/mongoerror-connect-econnrefused-127-0-0-127017))**

4. Install Dependencies and seed Database

```sh
npm i
npm run seed
```

5. Start app. It will run the web app in a _development_ node environment, meaning that it will not load any external resources which may require secrets (API Keys, etc).

```sh
npm run dev
```

1. You now should be up and running to start developing 🥸

## Production Environment

### API Keys you will need

| name                  | env key                  | env value                                                                                                                                              |
| --------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Google Calendar API   | `CAL`                    | [Follow these steps](#google-calendar-api-key)                                                                                                         |
| Discord Webhook URL   | `DISCORD`                | Apply for [Contributor Access](https://discord.com/channels/1117944495099613254/1166366239652847687/1166367256356335636) if you don't have it already. |
| Mapbox Public API Key | `PUBLIC_MAPBOX`          | [Follow these steps](#mapbox-public-key)                                                                                                               |
| Cron Secret           | `CRON_SECERT`            | This is an arbitary value, For local testing set and use in Postman or other API testing tool                                                          |
| mongodb name          | `DB_NAME`                | `noladevs`                                                                                                                                             |
| mongodb URL           | `MONGODB_URI`            | `mongodb://localhost:27017`                                                                                                                            |
| Discord Webhook URL   | `DISCORD_WEBHOOK_URL`    | A webhook Channel URL                                                                                                                                  |
| Ding Dong Endpoint    | `PUBLIC_DINGDONG_HOST`   | Endpoint handling Ding Dong requests                                                                                                                   |
| Ding Dong Phrase      | `PUBLIC_DINGDONG_PHRASE` | Used in POSTs to Ding Dong endpoint                                                                                                                    |

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

[Docs](https://cloud.google.com/docs/authentication/api-keys)

Basic Abridged Guide:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project (call it anything you want)
3. Navigate to API -> Library
4. Search for Google Calendar API -> Enable it.
5. Go to "Credentials", click "Create Credentials".
6. Click API Key, fill out all of the required fields.
7. Now put that API Key into your `.env.local` as CALENDAR_KEY

### Mapbox Public Key

Basic Abridged Guide:

1. Head over to [Mapbox](https://www.mapbox.com/)
2. Make an account
3. Use a Public key

> [!NOTE]
> if your api key doesn't start with `pk` it isn't the right one
