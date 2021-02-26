/**
 * This Component adds a single Url-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from "../../../utils/questionnaireResponseController";
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
    tag: 'url-question',
    styleUrl: 'url-question.css',
    shadow: false,
    scoped: true
})
export class UrlQuestion {

    @Element() element: HTMLElement;
    /**
     *  String containing the translations for the current locale
     */
    @State() strings: any;

    @Prop() question: any;
    @Watch('question')
    watchQuestion() {
        this.setSelected();
    }

    @Prop() mode: string;
    @Prop() questionnaireResponse: Object = null;
    @Watch('questionnaireResponse')
    async watchQuestionnaireResponse() {
        this.allow_events = false;
        await this.setSelected();
        this.allow_events = true;
    }
    /**
     * Primary color
     */
    @Prop() primary: string;
    /**
     * Secondary color
     */
    @Prop() secondary: string;
    /**
     * Color used to symbolise danger
     */
    @Prop() danger: string;
    /**
     * Language property of the component. </br>
     * Currently suported: [de, en, es]
     */
    @Prop() locale: string = 'en';
    @Watch('locale')
    async watchLocale(newValue: string) {
        console.log(newValue);
        this.strings = await getLocaleComponentStrings(this.element, newValue);
    }

    /**
     * Variable to store the value of the input
     */
    @State() selected: any = null;
    @Event() emitAnswer: EventEmitter;
    @Watch('selected')
    watchSelected() {
        if (this.allow_events) {
            let object = null;
            this.checkInput(this.selected);
            if (this.selected) {
                this.selected = this.selected.trimLeft();
                object = {
                    type: "url",
                    question: this.question,
                    value: [this.selected]
                };
            } else {
                object = {
                    type: "url",
                    question: this.question,
                    value: []
                };
            }
            this.emitAnswer.emit(object);
        }
    }
    /**
     * Allows events to be emitted if true
     */
    allow_events: boolean = false;
    naUrl: boolean = null;

    /* computed */
    validate() {
        return this.selected || this.selected === [];
    }

    /* methods */
    validateUrl() {
        if (this.selected) {
            let regex = new RegExp("^\\S*$");
            return this.selected.match(regex) ? true : false;
        }
    }

    checkInput(input) {
        this.naUrl = isNaN(parseFloat(input));
    }

    handleChange(event) {
        this.selected = event.target.value;
    }

    setSelected() {
        this.selected = "";
        this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "url");
    }

    /**
     *  Handles KeyPresses by adding Eventlisteners
     */
    @Event() emitNext: EventEmitter;
    handleKeyPress() {
        let input = document.getElementById('url' + this.question.linkId);
        let object = this;
        input.addEventListener('keyup', function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                object.emitNext.emit('next');
            }
        });
    }

    /* Lifecycle Methods */
    @Event() emitRemoveRequiredAnswer: EventEmitter;
    async componentWillLoad(): Promise<void> {
        try {
            this.strings = await getLocaleComponentStrings(this.element, this.locale);
            this.emitRemoveRequiredAnswer.emit(this.question);
            await this.setSelected();
            this.allow_events = true;
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        return (
            <div>
                <div class="">
                    <h2>{this.question.prefix} {this.question.text}</h2>
                    {this.strings ?
                        <div style={{ color: this.danger }} class={(this.validate() || !this.question.required) ? 'hidden' : ''} >
                            {this.strings.mandatory_question}
                        </div>
                        : null}
                </div>
                <hr />

                <div class="option-card">
                    <div class="form-row">
                        <div id={'url' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                            <label class="" htmlFor="url-text">
                                {this.strings.url.text}:
                            </label>
                            <input value="selected" type="text" v-model="selected" class="form-control" id="url-text" pattern="\S*" />
                            {this.strings ? (
                                <div style={{ color: this.danger }} class={this.naUrl === false ? 'hidden my-invalid-feedback' : this.naUrl === null ? 'hidden my-invalid-feedback' : 'visible my-invalid-feedback'}>
                                    {this.strings.url.invalid}
                                </div>
                            ) : null}
                            {this.strings ? (
                                <div class={this.naUrl !== false ? 'hidden my-valid-feedback' : this.naUrl !== null ? 'hidden my-valid-feedback' : 'visible my-valid-feedback'}>
                                    {this.strings.url.valid}
                                </div>
                            ) : null} 
                        </div>
                    </div>
                </div>
                <br />
            </div >
        );
    }

}