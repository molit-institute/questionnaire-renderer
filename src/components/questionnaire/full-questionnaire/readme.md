# full-questionnaire



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute       | Description                                                                | Type     | Default     |
| ---------------------------- | --------------- | -------------------------------------------------------------------------- | -------- | ----------- |
| `baseUrl`                    | `base-url`      |                                                                            | `string` | `undefined` |
| `danger`                     | `danger`        | Color used to symbolise danger                                             | `string` | `undefined` |
| `filteredItemList`           | --              |                                                                            | `any[]`  | `undefined` |
| `locale`                     | `locale`        |                                                                            | `string` | `'en'`      |
| `primary`                    | `primary`       | Primary color                                                              | `string` | `undefined` |
| `questionnaire` _(required)_ | `questionnaire` |                                                                            | `any`    | `undefined` |
| `questionnaireResponse`      | --              |                                                                            | `Object` | `null`      |
| `requiredQuestionList`       | --              |                                                                            | `any[]`  | `undefined` |
| `secondary`                  | `secondary`     | Secondary color                                                            | `string` | `undefined` |
| `spinner`                    | `spinner`       | Language property of the component. </br> Currently suported: [de, en, es] | `any`    | `undefined` |
| `startCount`                 | `start-count`   |                                                                            | `number` | `undefined` |
| `valueSets`                  | --              |                                                                            | `any[]`  | `undefined` |


## Events

| Event     | Description | Type               |
| --------- | ----------- | ------------------ |
| `return`  |             | `CustomEvent<any>` |
| `summary` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [simple-spinner](../../ui/simple-spinner)

### Graph
```mermaid
graph TD;
  full-questionnaire --> simple-spinner
  style full-questionnaire fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*