# noladevs eventbot

The eventbot is the Slack app that lets meetup organizers add and cancel events on noladevs.org
without touching the site. It is a slash command (`/event`) backed by two endpoints in this repo:

| Endpoint                     | Handles                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `/api/slack/eventbot/init`   | The `/event` slash command. Opens the Eventbot menu modal. |
| `/api/slack/eventbot/submit` | Every button click and modal submission from that menu.    |

The app manifest lives in [slackbot-config.json](./slackbot-config.json). Everything else lives in
`src/lib/utils/eventbot/`:

| file             | Holds                                                              |
| ---------------- | ------------------------------------------------------------------ |
| `blocks.ts`      | Block Kit for both forms and the announcement                      |
| `modals.ts`      | Opening and rebuilding those forms, and the button/select handlers |
| `submissions.ts` | What happens when a form is submitted, including posting to Slack  |
| `helpers.ts`     | Select options, reading modal values, listing an event's messages  |
| `audit.ts`       | The `eventbot-notifications` log                                   |
| `channels.ts`    | Which channels the bot can post in                                 |

Every successful create and cancel is also posted to a channel named `eventbot-notifications`,
recording who performed the action, the before/after values of the event, and — for a cancellation —
the reason given.

## Announcing an event

The create form ends with where the announcement goes, then the announcement itself.

**Post In** picks the single channel the announcement is posted to. It has no default and no
fallback: leave it empty and the event is saved to the site without being announced anywhere.
Picking a channel reveals the two fields under it, **Repost In** and **Announcement Message**.

**Repost In** takes any number of other channels, each of which gets a permalink to that one
announcement rather than a copy of it — so a later edit only has to touch one message. The channel
chosen under **Post In** is filtered out of the list, since it already has the announcement itself.

Both selectors only list channels the bot has been invited to, so invite it anywhere you want to be
able to announce. `eventbot-notifications` is left out of both, since it already receives the full
audit entry for the event.

## Cancelling an event

Cancelling deletes the event from the database and posts the audit entry. There is no separate
"event cancelled" announcement — instead, **Slack posts** offers to delete the announcement and
every repost that went with it. That checkbox only appears when the selected event actually has
posts behind it, and it is ticked by default; unticking it leaves them up.

Only messages the bot recorded when it posted them can be removed, so anything announced before
this tracking existed has to be deleted by hand.

---

## Setup

If you're working on the Slack app (thank you brave soul 🙏), there are a few extra steps. The
[Slack CLI](https://docs.slack.dev/tools/slack-cli/) does most of the work, using
`slackbot-config.json` as the app manifest.

Install the CLI:

```sh
# macOS / Linux
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash

# Windows (PowerShell)
irm https://downloads.slack-edge.com/slack-cli/install-windows.ps1 | iex
```

Then, from the root of this repo:

1. Authenticate against the workspace you want to develop in:

   ```sh
   slack login      # prints a /slackauthticket command to run in your workspace
   slack auth list  # confirms which workspaces you are authenticated against
   ```

   Use the shared dev workspace `nola-devs-test` at
   [nola-devs-dev.slack.com](https://nola-devs-dev.slack.com) (ask in the community Slack for an
   invite), or create your own at [slack.com/create](https://slack.com/create) if you would rather
   be fully sandboxed.

2. Start the app.

   ```sh
   npm run dev
   ```

3. In a separate terminal, start a public tunnel to the app.

   ```sh
   npx cloudflared tunnel --url http://localhost:5173/
   ```

   Put the tunnel URL in `CLOUDFLARE_URL` in your `.env.local`, with no trailing slash or path:

   ```sh
   CLOUDFLARE_URL='https://....trycloudflare.com'
   ```

   (Quick tunnels get a new hostname every launch, so whenever you restart `cloudflare`, make sure you **re-run steps 3 & 4** in their entirety.)

4. Create and install the app from the manifest:

   ```sh
   slack install
   ```

   Select `local`

   Pick the workspace when prompted. Re-run this any time you change `slackbot-config.json` or restart `cloudflare` — new
   scopes only take effect after a reinstall.

5. Grab the bot token and put it in `SLACK_BOT_TOKEN` in your `.env.local`, then restart
   `npm run dev` so it gets picked up:

   ```sh
   slack app settings   # opens your app in the browser
   ```

   In that page, go to **OAuth & Permissions** in the sidebar and copy the **Bot User OAuth Token**
   (it starts with `xoxb-`).

6. In the shared workspace, name your app something identifiable (for example `eventbot-<yourname>`)
   so it is clear whose bot is posting.
7. If you are using your own workspace, create a channel named `eventbot-notifications` and invite the bot to it
   (`/invite @noladevs eventbot` from inside the slack channel).
8. Run the `/event` slash command in your workspace, take it for a spin.

If you would rather not use the CLI, print the resolved manifest and paste it into
[api.slack.com/apps](https://api.slack.com/apps) via **Create New App** → **From a manifest**,
switching the format toggle to JSON:

```sh
node src/lib/scripts/slack-manifest.js
```

> How the manifest gets its URLs: `.slack/hooks.json` points the CLI's `get-manifest` hook at
> `src/lib/scripts/slack-manifest.js`, which reads `slackbot-config.json` and substitutes any
> `${VARIABLE}` from `.env.local` or the environment. The trailing `#` in that hook is deliberate —
> the CLI appends a `--source=<dir>` argument to every hook command, and the comment keeps it from
> being read as a script argument.

---

## Testing

### Through Slack

The full loop, once the setup above is done. Create an event with `/event` → **Create**, then
confirm three things happen:

- the announcement is posted in the channel picked under **Post In**
- each **Repost In** channel gets a permalink that Slack unfurls into a preview of that announcement
- an audit entry appears in `#eventbot-notifications` with your name, `Before: _none_`, and the new
  event's fields under `After`
- the event shows up on the site's events page

Then `/event` → **Cancel**, pick that event, and confirm four things:

- the **Slack posts** checkbox appears with the right count, and leaving it ticked removes the
  announcement and every repost
- the matching audit entry appears in `#eventbot-notifications` with `After: _none_` and your reason
- no cancellation message is posted to any channel
- the event is gone from the site

Slack failures never surface in the modal — they are caught and logged — so keep an eye on the
`npm run dev` terminal. A missing scope or an uninvited bot shows up there as
`Audit log skipped: #eventbot-notifications not found or bot is not a member.`

### Without Slack

Modal submissions (`view_submission`) do not need a real `trigger_id`, so they can be driven with
`curl` against a local dev server. No tunnel, no Slack app. The Slack API calls fail and are
swallowed by the error handling, but the database writes and the returned modal JSON are all
verifiable this way.

The seed data contains no upcoming events, so insert one first:

```sh
docker exec noladevs-mongo mongosh noladevs --quiet --eval '
db.events.insertOne({
  groupName: "Test Group", groupSlug: "test-group", meetupName: "Cancel Me",
  description: "test", start: new Date(Date.now()+864e5), end: new Date(Date.now()+9e7),
  location: { name: "Somewhere", city: "New Orleans", state: "LA", slug: "somewhere" },
  eventSlug: "cancel-me", createdAt: new Date()
})'
```

Then submit a cancellation for it:

```sh
EVENT_ID=$(docker exec noladevs-mongo mongosh noladevs --quiet \
  --eval 'db.events.findOne({eventSlug:"cancel-me"})._id.toString()')

curl -s -X POST http://localhost:5173/api/slack/eventbot/submit \
  --data-urlencode "payload={
    \"type\": \"view_submission\",
    \"user\": { \"id\": \"U_TESTUSER\" },
    \"view\": {
      \"callback_id\": \"cancel_event_modal\",
      \"private_metadata\": \"{\\\"user_id\\\":\\\"U_TESTUSER\\\"}\",
      \"state\": { \"values\": {
        \"event_section_block\": { \"event_select\": { \"selected_option\": { \"value\": \"${EVENT_ID}\" } } },
        \"cancel_reason_block\": { \"cancel_reason_input\": { \"value\": \"testing\" } },
        \"cancel_confirm_block\": { \"cancel_confirm_input\": { \"selected_options\": [{ \"value\": \"confirm_cancel\" }] } }
      } }
    }
  }"
```

What to look for:

- the response is the `Event Cancelled` modal, and the document is gone from Mongo
- adding `\"cancel_cleanup_block\": { \"cancel_cleanup_input\": { \"selected_options\": [{ \"value\": \"delete_posts\" }] } }`
  to `state.values` is what asks for the announcement and reposts to be deleted; without it they are
  left alone
- running it a second time returns the `Event Not Found` modal instead of erroring
- dropping the `cancel_confirm_block` values returns the modal with the validation warning

The same approach works for the create flow by swapping in `create_event_modal` as the
`callback_id` and filling `state.values` with the block and action ids from
`buildCreateEventModalBlocks`.
