# Auth0 Progressive Profiling Demo

Progressive profiling is a way to gather information from your users while keeping the initial sign-up efforts low. Rather than requesting all the necessary information at once progressive profilings allows you to enrich the user profile gradually over time.

This App provides a generich UI to request data from your users. Using the [Auth0 Progressive profiling Action](https://github.com/felixcolaci/auth0-progressive-profiling-action) it can be integrated quickly into your Auth0 sign-in workflow. Refer to the other repository for a detailed configuration instruction.

## Features Supported

- Different Input Types (text, number, email, phone, color, select)
  - not supported at the moment: radio, checkboxes
- Multi-Page Forms: By providing nested configuration attributes it is possible to support a multi page form workflow.
- Theming
  - Custom Headline, Subheadline, Logo
  - Custom Background Color
- generic callback: The application redirects the browser back to the auth0 tenant based on the issuer included in the session token when accessing the page.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:


```bash
# start netlify functions first
netfliy function:serve

# start web app
npm run dev


# or start the server and open the app in a new browser tab
npm run dev -- --open
```
