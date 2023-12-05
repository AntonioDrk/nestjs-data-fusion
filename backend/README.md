# Backend
## Install
  Run ``pnpm install``
  If you don't have pnpm installed, use this [link](https://pnpm.io/installation).

## Config
For the backend to work, make sure you have a ``.env`` file (you can use [this](/.env.test) file as template) or environment variables set.
Set an environment variable ``JWT_SECRET`` to a secret key (do not share ANYWHERE ELSE this key)

## Test Suite
Run  ``pnpm run test:e2e`` in the terminal

## Starting Backend
Run  ``pnpm run start`` in the terminal

## Versions Used
  Built with with ``NodeJS`` version ``21.2.0``
  Package manager ``pnpm`` version ``8.9.2``
  Passwords hashed with ``argon2`` version ``0.31.2``