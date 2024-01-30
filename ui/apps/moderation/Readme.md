# Vibes App

> Vibes for AKASHA World
## Table of contents

- [Table of contents](#table-of-contents)
- [Background](#background)
- [Components](#components)
  - [Dashboard](#dashboard)
  - [Transparency Log](#transparency-log)
  - [Error Cards](#error-cards)

## Background

Vibes app adds moderation-related functionalities of reporting/moderating offensive/abusive contents and maintaining a log of moderated items, to the AKASHA World. It consists of components, services and widgets which are standalone elements interacting with each other to form a wholesome system.

## Components

The core components include:

### Dashboard
> The Dashboard consists of the [General](src/components/dashboard/tabs/general), [Activity](src/components/dashboard/tabs/activity), (and [Applications](src/components/dashboard/tabs/applications), if admin) tabs.

### Transparency Log
> The Transparency Log is a scrollable list  of moderated (kept/delisted) entries only. Its route is unrestricted and requires no authentication.

### Error Cards
> The [No-Items-Found](src/components/error-cards/no-items-found.tsx) component is rendered on a given page if no  matching items are found.
