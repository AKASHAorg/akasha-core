# Ethereum World App Moderation

> Moderation app for Ethereum World
## Table of contents

- [Background](#background)
- [Components](#components)
    - [Dashboard](#dashboard)
    - [Transparency Log](#transparency-log)
    - [Error Pages](#error-pages)

- [Services](#services)

## Background

Moderation App adds moderation-related functionalities of reporting/moderating offensive/abusive contents and maintaining a log of moderated items, to the Ethereum World. It consists of components, services and widgets which are standalone elements interacting with each other to form a wholesome system.

## Components

The core components include:

### Dashboard
> The [Dashboard](src/components/dashboard/index.tsx) is a scrollable list of pending or moderated (kept/delisted) entries and allows moderators to moderate or review decisions.
The actively displayed list is controlled by the [Content Tab](src/components/dashboard/content-tab/index.tsx) component

> Each entry in the list is rendered by [Content Card](src/components/dashboard/content-card/index.tsx) component. In each Content Card, an [Entry Data Card](src/components/dashboard/content-card/entry-data-card.tsx) component renders an `EntryCard` or `ProfileCard` depending on the specified `itemType` (post, reply, account).

> Each card also has [Explanations Box](src/components/dashboard/content-card/explanations-box.tsx) which when toggled, loads all flags for an entry

### Transparency Log
> The [Transparency Log](src/components/transparency-log/index.tsx) is a scrollable list  of moderated (kept/delisted) entries only. Its route is unrestricted and requires no authentication.

### Error Pages
> The [Prompt Authentication](src/components/error-pages/prompt-authentication.tsx) component is shown if the user trying to access the `Dashboard` is not authenticated.

> The [Prompt Authorization](src/components/error-pages/prompt-authorization.tsx) component is shown if the user trying to access the `Dashboard` is authenticated but not an authorized Ethereum World Moderator.

> The [Render Not Found](src/components/error-pages/render-not-found.tsx) component is utilised in the `Dashboard` lists if no  matching items are found.

## Services

These are methods that interact with, modify and/enrich data from the API or affect the overall behaviour of components. They include `Posting service`, `Routing service`
