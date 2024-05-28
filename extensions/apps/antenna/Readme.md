# Antenna App

> The Antenna app displays a list of beams and reflections in a feed-like manner sorted in chronological order.

## Table of contents
- [Components](#components)
    - [Global-Antenna-Page](#global-antenna-page)
    - [Beam-Page](#beam-page)
    - [Reflection-Page](#reflection-page)
    - [My-Antenna-Page](#my-antenna-page)
    - [Profile-Feed-Page](#profile-feed-page)
    - [Tag-Feed-Page](#tag-feed-page)
- [Extensions](#extensions)
    - [Beam Editor](#beam-editor)
    - [Image Block](#image-block)
    - [Slate Block](#slate-block)

## Components

The core components include:

### Global antenna page
> A scrollable list of beams published in your world. By default, the antenna doesn't broadcast NSFW beams. To view NSFW beams in your global antenna, switch on the NSFW setting inside your [Settings App](../settings/Readme.md).

### Beam page
> A single beam entry with all its reflections and reflects to those reflections. Here you can reflect on a beam and express your thoughts freely.

### Reflection page
> A single reflection entry with all its reflects. Clicking on any reflection on a beam page leads you to the reflection's page.

### My antenna page
> A curated list of beams, based on a logged-in user's interests. See no content here? Start subscribing to some popular topics in the Latest Topics widget on the right-hand side of the desktop screen. 

### Profile feed page
> A scrollable list of beams published by a specific user profile. To view a profile feed page, navigate to a user's profile and click on the number of beams they have published.

### Tag feed page
> A scrollable list of beams associated with a specific tag. A beam is discoverable through a specific tag or multiple tags if a creator adds those relevant tags the moment they publish it.

## Extensions

### Beam editor
> An extension that renders an editor in the UI and handles the block creation and beam publishing process.

### Image block
> An image block can be of two functionalities depending on the context:
- To handle image uploading during the beam creation process.
- To display images inside a beam for normal viewing.

### Slate block
> An extension that uses the `slate-react` library under the hook to support richtext editing. A Slate text block is the default text block that Akasha World supports.
