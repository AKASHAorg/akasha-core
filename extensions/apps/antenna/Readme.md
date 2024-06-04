# AKASHA Integration App

> Implementation of the AKASHA Core

## Table of contents

- [Background](#background)
- [Components](#components)
    - [Feed-Page](#feed-page)
    - [Post-Page](#post-page)
    - [My-Feed-Page](#my-feed-page)
    - [Tag-Feed-Page](#tag-feed-page)
- [Services](#services)
- [Widgets](#widgets)
    - [Trending-widget](#trending-widget)

## Background

AKASHA Integration App (AKASHA World) is the foremost implementation of the AKASHA Core. It consists of components, services and widgets which are standalone elements interacting with each other to form a wholesome system.

## Components

The core components include:

### Feed page
> A scrollable list of entries.

### Post page
> A single entry with its comment(s) and available actions.

### My Feed page
> A scrollable curated list of entries, based on logged-in user's interests.

### Profile feed page
> A scrollable list of entries associated with a specific user profile.

### Tag feed page
> A scrollable list of entries associated with a specific tag.

 ## Services

These are methods that interact with, modify and/enrich data from the API or affect the overall behaviour of components. They include `Posting service`, `Routing service`
