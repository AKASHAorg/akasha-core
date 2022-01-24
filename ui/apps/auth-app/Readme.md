# Ethereum World Auth App

> Auth app for Ethereum World, it handles authentication, sign-in and sign-up.

## Table of contents

- [Background](#background)
- [Components](#components)
  - [Signup](#signup)
  - [Signin](#signin)
  - [Welcome Screen](#welcome)

## Background

The Auth App adds the authentication functionality to the Ethereum World. It handles signing in, and signing up with the welcome screen onboarding. It supports various ways of authentication, like a wallet connection via an extension or a mobile app (ie. Metamask), WalletConnect, OpenLogin etc.

## Components

The core components include:

### Signup

> [Signup](src/components/sign-up/index.tsx) is a series of steps taken to register your ethereum address in our systems. Every step has a detailed explanation on what is happening and why it is necessary.

### Signin

> [Signin](src/components/sign-in/index.tsx) is a series of steps which sign you in to an already existing account. Like the signup, each step is explained in detail.

### Welcome

> [Welcome](src/components/welcome/index.tsx) is a screen welcoming you to Ethereum World and offering you possibilities on what to do next, and how to go about doing it.
