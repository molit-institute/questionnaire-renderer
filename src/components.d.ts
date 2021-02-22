/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface BooleanQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger": string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale": string;
        "mode": string;
        /**
          * Primary color
         */
        "primary": string;
        "question": any;
        "questionnaireResponse": Object;
        /**
          * Secondary color
         */
        "secondary": string;
    }
    interface DateQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger": string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale": string;
        "mode": string;
        /**
          * Primary color
         */
        "primary": string;
        "question": any;
        "questionnaireResponse": Object;
        /**
          * Secondary color
         */
        "secondary": string;
    }
    interface DateTimeQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger": string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale": string;
        "mode": string;
        /**
          * Primary color
         */
        "primary": string;
        "question": any;
        "questionnaireResponse": Object;
        /**
          * Secondary color
         */
        "secondary": string;
    }
    interface DecimalQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger": string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale": string;
        "mode": string;
        /**
          * Primary color
         */
        "primary": string;
        "question": any;
        "questionnaireResponse": Object;
        /**
          * Secondary color
         */
        "secondary": string;
    }
    interface DisplayQuestion {
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale": string;
        "mode": string;
        "question": any;
    }
    interface IntegerQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger": string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale": string;
        "mode": string;
        /**
          * Primary color
         */
        "primary": string;
        "question": any;
        "questionnaireResponse": Object;
        /**
          * Secondary color
         */
        "secondary": string;
    }
    interface TimeQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger": string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale": string;
        "mode": string;
        /**
          * Primary color
         */
        "primary": string;
        "question": any;
        "questionnaireResponse": Object;
        /**
          * Secondary color
         */
        "secondary": string;
    }
    interface VasQuestion {
        "labelLower": String;
        "labelUpper": String;
        "max": number;
        "min": number;
        "selected": number;
        "step": number;
    }
}
declare global {
    interface HTMLBooleanQuestionElement extends Components.BooleanQuestion, HTMLStencilElement {
    }
    var HTMLBooleanQuestionElement: {
        prototype: HTMLBooleanQuestionElement;
        new (): HTMLBooleanQuestionElement;
    };
    interface HTMLDateQuestionElement extends Components.DateQuestion, HTMLStencilElement {
    }
    var HTMLDateQuestionElement: {
        prototype: HTMLDateQuestionElement;
        new (): HTMLDateQuestionElement;
    };
    interface HTMLDateTimeQuestionElement extends Components.DateTimeQuestion, HTMLStencilElement {
    }
    var HTMLDateTimeQuestionElement: {
        prototype: HTMLDateTimeQuestionElement;
        new (): HTMLDateTimeQuestionElement;
    };
    interface HTMLDecimalQuestionElement extends Components.DecimalQuestion, HTMLStencilElement {
    }
    var HTMLDecimalQuestionElement: {
        prototype: HTMLDecimalQuestionElement;
        new (): HTMLDecimalQuestionElement;
    };
    interface HTMLDisplayQuestionElement extends Components.DisplayQuestion, HTMLStencilElement {
    }
    var HTMLDisplayQuestionElement: {
        prototype: HTMLDisplayQuestionElement;
        new (): HTMLDisplayQuestionElement;
    };
    interface HTMLIntegerQuestionElement extends Components.IntegerQuestion, HTMLStencilElement {
    }
    var HTMLIntegerQuestionElement: {
        prototype: HTMLIntegerQuestionElement;
        new (): HTMLIntegerQuestionElement;
    };
    interface HTMLTimeQuestionElement extends Components.TimeQuestion, HTMLStencilElement {
    }
    var HTMLTimeQuestionElement: {
        prototype: HTMLTimeQuestionElement;
        new (): HTMLTimeQuestionElement;
    };
    interface HTMLVasQuestionElement extends Components.VasQuestion, HTMLStencilElement {
    }
    var HTMLVasQuestionElement: {
        prototype: HTMLVasQuestionElement;
        new (): HTMLVasQuestionElement;
    };
    interface HTMLElementTagNameMap {
        "boolean-question": HTMLBooleanQuestionElement;
        "date-question": HTMLDateQuestionElement;
        "date-time-question": HTMLDateTimeQuestionElement;
        "decimal-question": HTMLDecimalQuestionElement;
        "display-question": HTMLDisplayQuestionElement;
        "integer-question": HTMLIntegerQuestionElement;
        "time-question": HTMLTimeQuestionElement;
        "vas-question": HTMLVasQuestionElement;
    }
}
declare namespace LocalJSX {
    interface BooleanQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger"?: string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale"?: string;
        "mode"?: string;
        "onEmitAnswer"?: (event: CustomEvent<any>) => void;
        /**
          * Primary color
         */
        "primary"?: string;
        "question"?: any;
        "questionnaireResponse"?: Object;
        /**
          * Secondary color
         */
        "secondary"?: string;
    }
    interface DateQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger"?: string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale"?: string;
        "mode"?: string;
        "onEmitAnswer"?: (event: CustomEvent<any>) => void;
        /**
          * Primary color
         */
        "primary"?: string;
        "question"?: any;
        "questionnaireResponse"?: Object;
        /**
          * Secondary color
         */
        "secondary"?: string;
    }
    interface DateTimeQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger"?: string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale"?: string;
        "mode"?: string;
        "onEmitAnswer"?: (event: CustomEvent<any>) => void;
        /**
          * Primary color
         */
        "primary"?: string;
        "question"?: any;
        "questionnaireResponse"?: Object;
        /**
          * Secondary color
         */
        "secondary"?: string;
    }
    interface DecimalQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger"?: string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale"?: string;
        "mode"?: string;
        "onEmitAnswer"?: (event: CustomEvent<any>) => void;
        /**
          * Handles KeyPresses by adding Eventlisteners
         */
        "onEmitNext"?: (event: CustomEvent<any>) => void;
        /**
          * Primary color
         */
        "primary"?: string;
        "question"?: any;
        "questionnaireResponse"?: Object;
        /**
          * Secondary color
         */
        "secondary"?: string;
    }
    interface DisplayQuestion {
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale"?: string;
        "mode"?: string;
        "question"?: any;
    }
    interface IntegerQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger"?: string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale"?: string;
        "mode"?: string;
        "onEmitAnswer"?: (event: CustomEvent<any>) => void;
        /**
          * Handles KeyPresses by adding Eventlisteners
         */
        "onEmitNext"?: (event: CustomEvent<any>) => void;
        /**
          * Primary color
         */
        "primary"?: string;
        "question"?: any;
        "questionnaireResponse"?: Object;
        /**
          * Secondary color
         */
        "secondary"?: string;
    }
    interface TimeQuestion {
        /**
          * Color used to symbolise danger
         */
        "danger"?: string;
        /**
          * Language property of the component. </br> Currently suported: [de, en]
         */
        "locale"?: string;
        "mode"?: string;
        "onEmitAnswer"?: (event: CustomEvent<any>) => void;
        /**
          * Primary color
         */
        "primary"?: string;
        "question"?: any;
        "questionnaireResponse"?: Object;
        /**
          * Secondary color
         */
        "secondary"?: string;
    }
    interface VasQuestion {
        "labelLower"?: String;
        "labelUpper"?: String;
        "max"?: number;
        "min"?: number;
        "onEmitSelected"?: (event: CustomEvent<any>) => void;
        "selected"?: number;
        "step"?: number;
    }
    interface IntrinsicElements {
        "boolean-question": BooleanQuestion;
        "date-question": DateQuestion;
        "date-time-question": DateTimeQuestion;
        "decimal-question": DecimalQuestion;
        "display-question": DisplayQuestion;
        "integer-question": IntegerQuestion;
        "time-question": TimeQuestion;
        "vas-question": VasQuestion;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "boolean-question": LocalJSX.BooleanQuestion & JSXBase.HTMLAttributes<HTMLBooleanQuestionElement>;
            "date-question": LocalJSX.DateQuestion & JSXBase.HTMLAttributes<HTMLDateQuestionElement>;
            "date-time-question": LocalJSX.DateTimeQuestion & JSXBase.HTMLAttributes<HTMLDateTimeQuestionElement>;
            "decimal-question": LocalJSX.DecimalQuestion & JSXBase.HTMLAttributes<HTMLDecimalQuestionElement>;
            "display-question": LocalJSX.DisplayQuestion & JSXBase.HTMLAttributes<HTMLDisplayQuestionElement>;
            "integer-question": LocalJSX.IntegerQuestion & JSXBase.HTMLAttributes<HTMLIntegerQuestionElement>;
            "time-question": LocalJSX.TimeQuestion & JSXBase.HTMLAttributes<HTMLTimeQuestionElement>;
            "vas-question": LocalJSX.VasQuestion & JSXBase.HTMLAttributes<HTMLVasQuestionElement>;
        }
    }
}
