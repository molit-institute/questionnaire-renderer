/**
 * This Component adds a single Decimal-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'decimal-question',
  styleUrl: 'decimal-question.css',
  shadow: false,
  scoped: true,
})
export class DecimalQuestion {
  @Element() element: HTMLElement;
  decimalInput!: HTMLInputElement;
  @Prop() variant: any = null;
  @Prop() enableErrorConsoleLogging: boolean;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
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
      if (!this.naN) {
        object = {
          type: 'decimal',
          question: this.question,
          value: [this.selected],
        };
      } else {
        object = {
          type: 'decimal',
          question: this.question,
          value: [],
        };
      }
      this.emitAnswer.emit(object);
    }
  }

  @Prop() question: any;
  @State() reset: Boolean = false;
  @Watch('question')
  watchQuestion() {
    /**Note: This code prevents the input from showing the invalid value as long as the type of the question
     * doesnt change. If a invalid Number is entered, selected is "" - the code will then force the input
     * to have the value "" aswell
     **/
    if (this.selected === '') {
      this.decimalInput.value = '';
    }
    this.setSelected();

    setTimeout(() => {
      this.reset = false;
    }, 5);
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
  @Prop() enableInformalLocale: boolean;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }

  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;
  started: boolean = false;
  naN: boolean = null; //TODO

  /* methods */
  /**
   *  Handles KeyPresses by adding Eventlisteners
   */
  @Event() emitNext: EventEmitter;
  @Listen('keyup')
  handleKeyPress(ev: KeyboardEvent) {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      this.emitNext.emit('next');
    }
  }
  /**
   *
   */
  setSelected() {
    try {
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'decimal');

    } catch (error) {
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
      this.emitError(error);
    }
  }

  checkInput(input) {
    this.naN = isNaN(parseFloat(input));
  }

  handleChange(event) {
    this.selected = event.target.value;
  }

  /**
   * Emits an error-event
   */
  @Event() errorLog: EventEmitter;
  emitError(error) {
    this.errorLog.emit(error);
  }

  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
      await this.setSelected();
      this.allow_events = true;
    } catch (e) {
      if (this.enableErrorConsoleLogging) {
        console.error(e);
      }
      this.emitError(e);
    }
  }

  render() {
    return (
      <div class="qr-question-container">
        {this.variant === 'touch' ? (
          <div>
            <div class="card">
              <div class="qr-question-title">
                <div class={this.reset ? 'qr-question-hidden' : ''}>
                  <span class="qr-question-prefix">{this.question.prefix}</span>
                  <span class="qr-question-text" innerHTML={textToHtml(this.question.text)}></span>
                </div>
              </div>
              <div class="qr-question-mandatoryQuestion">
                {this.strings ? (
                  <div style={{ color: this.danger }} class={this.selected || !this.question.required ? 'qr-question-hidden' : ''}>
                    {this.strings.mandatory_question}
                  </div>
                ) : null}
              </div>
            </div>
            <hr />
            <div class="card qr-question-optionCard">
              <div class="form-row">
                <div id={'decimal' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                  <label class="qr-question-inputLabel qr-decimalQuestion-inputLabel" htmlFor="decimalInput">
                    {this.strings.decimal.text}:
                  </label>
                  <input
                    ref={el => (this.decimalInput = el as HTMLInputElement)}
                    class="form-control qr-question-input qr-decimalQuestion-input"
                    id="decimal"
                    step="any"
                    type="number"
                    value={this.selected}
                    onInput={e => this.handleChange(e)}
                  />
                  {this.strings ? (
                    <div style={{ color: this.danger }} class={this.naN === false ? 'qr-question-hidden my-invalid-feedback' : this.naN === null ? 'qr-question-hidden my-invalid-feedback' : 'qr-question-visible my-invalid-feedback'}>
                      {this.strings.decimal.invalid}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {this.variant === 'form' ? (
          <div>
            <div class="form-row">
              <div id={'decimal' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                <label class="" htmlFor="decimalInput">
                  {this.question.text}:
                </label>
                <input ref={el => (this.decimalInput = el as HTMLInputElement)} class="form-control" id="decimal" step="any" type="number" value={this.selected} onInput={e => this.handleChange(e)} />
                {this.strings ? (
                  <div style={{ color: this.danger }} class={this.naN === false ? 'hidden my-invalid-feedback' : this.naN === null ? 'hidden my-invalid-feedback' : 'visible my-invalid-feedback'}>
                    {this.strings.decimal.invalid}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {this.variant === 'compact' ? (
          <div>
            <div class="form-row">
              <div id={'decimal' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                <label class="" htmlFor="decimalInput">
                  {this.question.text}:
                </label>
                <input ref={el => (this.decimalInput = el as HTMLInputElement)} class="form-control" id="decimal" step="any" type="number" value={this.selected} onInput={e => this.handleChange(e)} />
                {this.strings ? (
                  <div style={{ color: this.danger }} class={this.naN === false ? 'hidden my-invalid-feedback' : this.naN === null ? 'hidden my-invalid-feedback' : 'visible my-invalid-feedback'}>
                    {this.strings.decimal.invalid}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
