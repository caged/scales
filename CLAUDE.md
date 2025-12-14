# Scales 

This directory contains the source code for the Scales web application, built using Svelte and TypeScript. The app allows me to explore musical scales and chords interactively. It features chord diagrams, audio playback, and scale visualizations and is designed to help me understand music theory concepts better.

## Architecture

The app is structured as a Svelte project which is stored in the `src/app` directory and a frets library in src/frets that handles rendering fretboards and musical notation.  The core of the app is build on top of the Tonal music theory library, which provides functions for generating scales, chords, and notes and can be found here: node_modules/tonal.

## Documentation 

The documentation for the tonal library can be found in subdirectories of the node_modules/@tonaljs.  Each package has its own documentation stored as a markdown file.  For example, the documentation for Chord can be found at node_modules/@tonaljs/chord/README.md

## Style Guidelines

* Always prefer built in features of the Tonal library over custom implementations or 3rd party libraries.