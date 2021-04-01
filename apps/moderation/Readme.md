# ETHEREUM WORLD APP moderation

> Moderation app for Ethereum World
## Table of contents

- [Background](#background)
- [Components](#components)
    - [Content-List](#content-list)
    - [Content-Tab](#content-tab)
    - [Prompt-Authentication](#prompt-authentication)
    - [Prompt-Authorization](#prompt-authorization)
- [Services](#services)

## Background

Moderation App is integrated into the Ethereum World to assist in reporting and moderating offensive contents. It consists of components, services and widgets which are standalone elements interacting with each other to form a wholesome system.

## Components

The core components include:

### Content List
A scrollable list of entries. [view](./src/components/content-list.tsx) 

### Content Tab
Switch like component that controls the view between pending and moderated items. [view](./src/components/content-tab.tsx)

### Prompt Authentication
Blocks access to the moderation app for unauthenticated users. [view](./src/components/prompt-authentication.tsx)

### Prompt Authorization
Blocks access to the moderation app for unauthorized users. [view](./src/components/prompt-authorization.tsx)

## Services

These are methods that interact with, modify and/enrich data from the API or affect the overall behaviour of components. They include [Posting service](./src/services/posting-service.ts), [Routing service](./src/services/routing-service.ts)
