## Questionnaire-Renderer

![build](https://github.com/molit-institute/questionnaire-renderer/workflows/Build/badge.svg)
![publish](https://github.com/molit-institute/questionnaire-renderer/workflows/Publish/badge.svg)
![npm version](https://img.shields.io/npm/v/@molit/questionnaire-renderer.svg)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@molit/questionnaire-renderer)
![npm license](https://img.shields.io/npm/l/@molit/questionnaire-renderer.svg)

### About

The questionnaire-renderer is a component developed to render FHIR questionnaires. It was developed by the MOLIT Insitut gGmbH using the Stencil framework

### Installation

Using npm:

```bash
npm i @molit/questionnaire-renderer
```

### Usage

Using npm:

Import the component in the main.js of your project.

```js
import { applyPolyfills, defineCustomElements as initQuestionnaireRenderer } from "@molit/questionnaire-renderer/loader";

applyPolyfills().then(() => {
//Surrounding defineCustomElemnts() with applyPolyfills() is only needed if older browsers are targeted
initQuestionnaireRenderer()
});
```

### Documentation

You can find more documentation here: 
https://github.com/molit-institute/questionnaire-renderer/blob/master/src/components/questionnaire-renderer/readme.md

### Example project

You can find a demo project using vue.js here: 
https://github.com/molit-institute/questionnaire-renderer-example-vue