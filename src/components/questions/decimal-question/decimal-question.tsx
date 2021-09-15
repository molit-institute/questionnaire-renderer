/**
 * This Component adds a single Decimal-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';

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
    this.strings = await getLocaleComponentStrings(this.element, newValue);
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
    this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'decimal');
  }

  checkInput(input) {
    this.naN = isNaN(parseFloat(input));
  }

  handleChange(event) {
    this.selected = event.target.value;
  }

  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale);
      await this.setSelected();
      this.allow_events = true;
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div>
        {this.variant === 'touch' ? (
          <div>
            <div class="card">
              <h2>
                {this.question.prefix} {this.question.text}
              </h2>
              {this.strings ? (
                <div style={{ color: this.danger }} class={this.selected || !this.question.required ? 'hidden' : ''}>
                  {this.strings.mandatory_question}
                </div>
              ) : null}
            </div>
            <hr />
            <div class="card option-card">
              <div class="form-row">
                <div id={'decimal' + this.question.linkId} class={this.selected !== '' && this.selected ? 'size was-validated' : 'size'}>
                  <label class="" htmlFor="decimalInput">
                    {this.strings.decimal.text}:
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
          </div>
        ) : null}
        {this.variant === 'form' ? <div>Decimal form</div> : null}
        {this.variant === 'compact' ? <div></div> : null}
      </div>
    );
  }
}
