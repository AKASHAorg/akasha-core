# AKASHA integration app

> Implementation of AWF

## Table of contents

- [Background](#background)
- [Components](#components)
    - [Feed-Page](#feed-page)
    - [Post-Page](#post-page)
    - [Tag-Feed-Page](#tag-feed-page)
- [Services](#services)
- [Widgets](#widgets)
    - [Trending-widget](#trending-widget)

## Background

Akasha Integration App (Ethereum World) is the foremost implementation of the Akasha World Framework. It consists of components, services and widgets which are standalone elements interacting with each other to form a wholesome system.

## Components

The core components include:

> ### Feed page
> A scrollable list of entries. 

> ### Post page
> A single entry with its comment(s).

> ### Tag feed page
> A scrollable list of entries associated with a specific tag.

## Services

These are methods that interact with, modify and/enrich data from the API or affect the overall behaviour of components. They include `Posting service`, `Routing service`

## Widgets
Standalone elements that are conditionally rendered on the widget area of the app based on the active route. A sample widget include:

> ### Trending widget
> Displays the trending tags.