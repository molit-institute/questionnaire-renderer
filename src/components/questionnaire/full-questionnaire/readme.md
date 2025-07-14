# full-questionnaire



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute                      | Description                                                                | Type      | Default     |
| ---------------------------- | ------------------------------ | -------------------------------------------------------------------------- | --------- | ----------- |
| `baseUrl`                    | `base-url`                     |                                                                            | `string`  | `undefined` |
| `danger`                     | `danger`                       | Color used to symbolise danger                                             | `string`  | `undefined` |
| `enableErrorConsoleLogging`  | `enable-error-console-logging` |                                                                            | `boolean` | `undefined` |
| `enableFinishButton`         | `enable-finish-button`         |                                                                            | `boolean` | `undefined` |
| `enableInformalLocale`       | `enable-informal-locale`       |                                                                            | `boolean` | `undefined` |
| `enableNext`                 | `enable-next`                  |                                                                            | `boolean` | `true`      |
| `enableReturn`               | `enable-return`                |                                                                            | `boolean` | `true`      |
| `filteredItemList`           | --                             |                                                                            | `any[]`   | `undefined` |
| `locale`                     | `locale`                       | Language property of the component. </br> Currently suported: [de, en, es] | `string`  | `'en'`      |
| `primary`                    | `primary`                      | Primary color                                                              | `string`  | `undefined` |
| `questionnaire` _(required)_ | `questionnaire`                |                                                                            | `any`     | `undefined` |
| `questionnaireResponse`      | --                             |                                                                            | `Object`  | `null`      |
| `requiredQuestionList`       | --                             |                                                                            | `any[]`   | `undefined` |
| `secondary`                  | `secondary`                    | Secondary color                                                            | `string`  | `undefined` |
| `startCount`                 | `start-count`                  |                                                                            | `number`  | `undefined` |
| `valueSets`                  | --                             |                                                                            | `any[]`   | `undefined` |
| `variant`                    | `variant`                      |                                                                            | `any`     | `null`      |
| `vasSelectedValueLabel`      | `vas-selected-value-label`     |                                                                            | `string`  | `undefined` |
| `vasShowSelectedValue`       | `vas-show-selected-value`      |                                                                            | `boolean` | `undefined` |
| `vasVertical`                | `vas-vertical`                 | Options for Visual Analog Scale                                            | `boolean` | `undefined` |
| `visibleBooleanNullOption`   | `visible-boolean-null-option`  |                                                                            | `boolean` | `undefined` |


## Events

| Event      | Description          | Type               |
| ---------- | -------------------- | ------------------ |
| `errorLog` | Emits an error-event | `CustomEvent<any>` |
| `finish`   |                      | `CustomEvent<any>` |
| `return`   |                      | `CustomEvent<any>` |
| `summary`  |                      | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
