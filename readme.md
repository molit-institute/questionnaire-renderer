## Questionnaire-Renderer

![build](https://github.com/molit-institute/questionnaire-renderer/workflows/Build/badge.svg)
![publish](https://github.com/molit-institute/questionnaire-renderer/workflows/Publish/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/molitinstitute/questionnaire-renderer/badge.svg?branch=master)](https://coveralls.io/github/molitinstitute/questionnaire-renderer?branch=master)
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

Using unpkg:

you can use the following link: https://unpkg.com/@molit/questionnaire-renderer@1.0.14/dist/questionnaire-renderer/questionnaire-renderer.esm.js 

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

Using unpkg in html

```html
<head>
    <script type="module" src="https://unpkg.com/@molit/questionnaire-renderer@1.0.14/dist/questionnaire-renderer/questionnaire-renderer.esm.js"></script>
</head>

<body>
    <questionnaire-renderer id="questionnaire-renderer"></questionnaire-renderer>
</body>

```

### Documentation

See documentation about properties