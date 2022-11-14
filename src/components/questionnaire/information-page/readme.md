# information-page



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                      | Description                                                                | Type      | Default     |
| --------------------------- | ------------------------------ | -------------------------------------------------------------------------- | --------- | ----------- |
| `enableErrorConsoleLogging` | `enable-error-console-logging` |                                                                            | `boolean` | `undefined` |
| `enableInformalLocale`      | `enable-informal-locale`       |                                                                            | `boolean` | `false`     |
| `filteredItemList`          | --                             |                                                                            | `any[]`   | `undefined` |
| `informationPageText`       | --                             |                                                                            | `String`  | `''`        |
| `locale`                    | `locale`                       | Language property of the component. </br> Currently suported: [de, en, es] | `string`  | `'en'`      |
| `questionnaire`             | `questionnaire`                |                                                                            | `any`     | `null`      |
| `trademarkText`             | `trademark-text`               |                                                                            | `string`  | `null`      |


## Events

| Event                | Description | Type               |
| -------------------- | ----------- | ------------------ |
| `startQuestionnaire` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [questionnaire-renderer](../../questionnaire-renderer)

### Graph
```mermaid
graph TD;
  questionnaire-renderer --> information-page
  style information-page fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
