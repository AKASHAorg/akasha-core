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

> ### Content List
> A scrollable list of entries.

> ### Content Tab
> Switch like component that controls the view between pending and moderated items.

> ### Prompt Authentication
> Blocks access to the moderation app for unauthenticated users.

> ### Prompt Authorization
> Blocks access to the moderation app for unauthorized users.

## Services

These are methods that interact with, modify and/enrich data from the API or affect the overall behaviour of components. They include `Posting service`, `Routing service`
