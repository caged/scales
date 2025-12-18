# Scales 

This directory contains the source code for the Scales web application, built using Svelte and JavaScript. The app allows me to explore musical scales and chords interactively. It features chord diagrams, audio playback, and scale visualizations and is designed to help me understand music theory concepts better.

## Architecture

The app is structured as a SvelteKit project which is stored in the `src` directory and a frets library in src/lib/frets that handles rendering fret boards and musical notation.  The core of the app is build on top of the Tonal music theory library, which provides functions for generating scales, chords, and notes and can be found here: node_modules/tonal.

## Documentation 

The documentation for the tonal library can be found in subdirectories of the node_modules/@tonaljs.  Each package has its own documentation stored as a markdown file.  For example, the documentation for Chord can be found at node_modules/@tonaljs/chord/README.md.  Parse and understand these documents to learn about the available functions and features of each package.

The documentation for the Svelte 5 framework can be found at https://svelte.dev/docs/svelte/overview.  In the sidebar there are links to the various features of Svelte including components, stores, reactivity, and context.  Parse and understand these documents to learn how to build Svelte applications.

## Style Guidelines

* Always prefer built in features of the Tonal library over custom implementations or 3rd party libraries.
* Prefer local markdown documentation for the relevant packages stored in the directory node_modules.
* Use the vitest library for tests and prefer expect statements from vitest.
* Follow Svelte best practices for component structure, reactivity, and state management as outlined in the Svelte documentation.