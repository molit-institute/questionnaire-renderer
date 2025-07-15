# grouped-questionnaire



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute                      | Description                                                                | Type      | Default     |
| ---------------------------- | ------------------------------ | -------------------------------------------------------------------------- | --------- | ----------- |
| `baseUrl`                    | `base-url`                     |                                                                            | `string`  | `undefined` |
| `danger`                     | `danger`                       | Color used to symbolise danger                                             | `string`  | `undefined` |
| `editMode`                   | `edit-mode`                    |                                                                            | `boolean` | `false`     |
| `enableErrorConsoleLogging`  | `enable-error-console-logging` |                                                                            | `boolean` | `undefined` |
| `enableInformalLocale`       | `enable-informal-locale`       |                                                                            | `boolean` | `undefined` |
| `enableReturn`               | `enable-return`                | Language property of the component. </br> Currently suported: [de, en, es] | `boolean` | `true`      |
| `filteredItemList`           | --                             |                                                                            | `any[]`   | `undefined` |
| `lastQuestion`               | `last-question`                |                                                                            | `boolean` | `false`     |
| `locale`                     | `locale`                       |                                                                            | `string`  | `'en'`      |
| `primary`                    | `primary`                      | Primary color                                                              | `string`  | `undefined` |
| `questionnaire` _(required)_ | `questionnaire`                |                                                                            | `any`     | `undefined` |
| `questionnaireResponse`      | --                             |                                                                            | `Object`  | `null`      |
| `requiredQuestionList`       | --                             |                                                                            | `any[]`   | `undefined` |
| `secondary`                  | `secondary`                    | Secondary color                                                            | `string`  | `undefined` |
| `spinner`                    | `spinner`                      |                                                                            | `any`     | `undefined` |
| `startCount`                 | `start-count`                  |                                                                            | `number`  | `undefined` |
| `valueSets`                  | --                             |                                                                            | `any[]`   | `undefined` |
| `variant`                    | `variant`                      |                                                                            | `any`     | `null`      |
| `vasSelectedValueLabel`      | `vas-selected-value-label`     |                                                                            | `string`  | `undefined` |
| `vasShowSelectedValue`       | `vas-show-selected-value`      |                                                                            | `boolean` | `undefined` |
| `vasVertical`                | `vas-vertical`                 | Options for Visual Analog Scale                                            | `boolean` | `undefined` |


## Events

| Event      | Description                     | Type               |
| ---------- | ------------------------------- | ------------------ |
| `errorLog` | Emits an error-event            | `CustomEvent<any>` |
| `finish`   | Counts up the Question-Number   | `CustomEvent<any>` |
| `return`   | Counts down the Question-Number | `CustomEvent<any>` |
| `summary`  |                                 | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
