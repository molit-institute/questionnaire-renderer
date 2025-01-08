/**
 * This Component adds a Text-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'text-question',
  styleUrl: 'text-question.css',
  shadow: false,
  scoped: true,
})
export class TextQuestion {
  @Element() element: HTMLElement;
  @Prop() variant: any = null;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;

  @Prop() question: any;
  @Prop() enableErrorConsoleLogging: boolean;
  @State() reset: Boolean = false;
  @Watch('question')
  watchQuestion() {
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
   * Variable to store the value of the input
   */
  @State() selected: any = null;
  @Event() emitAnswer: EventEmitter;
  @Watch('selected')
  watchSelected() {
    if (this.allow_events) {
      let object = null;
      if (this.selected) {
        this.selected = this.selected.trimLeft();
        object = {
          type: 'text',
          question: this.question,
          value: [this.selected],
        };
      } else {
        object = {
          type: 'text',
          question: this.question,
          value: [],
        };
      }
      this.emitAnswer.emit(object);
    }
  }
  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;

  /* computed */
  validate() {
    return this.selected ? true : false;
    // return false;
  }

  /* methods */
  handleChange(event) {
    event.srcElement.parentNode.dataset.replicatedValue = event.target.value;
    this.selected = event.target.value;
  }

  setSelected() {
    try {
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'text');
    } catch (error) {
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
      this.emitError(error);
    }
  }

  setReplicatedValue() {
    let autogrow = [...Array.from(document.querySelectorAll('.grow-wrap'))];
    for (let field of autogrow) field.setAttribute('data-replicated-value', this.selected);
  }

  /**
   * Emits an error-event
   */
  @Event() errorLog: EventEmitter;
  emitError(error) {
    this.errorLog.emit(error);
  }

  /* Lifecycle Methods */

  async componentDidLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
      await this.setSelected();
      if (this.selected) this.setReplicatedValue();
      this.allow_events = true;
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div class="qr-question-container">
        {this.variant === 'touch' ? (
          <div class="qr-question qr-question-text">
            <div class="qr-question-head">
              <div class="qr-question-title">
                <div class={this.reset ? 'qr-question-hidden' : ''}>
                  {this.question.prefix && this.question.prefix != '' ? <span class="qr-question-prefix">{this.question.prefix}</span> : null}
                  <span class="qr-question-text" innerHTML={textToHtml(this.question.text)}></span>
                </div>
              </div>
              <div class="qr-question-mandatoryQuestion">
                {this.strings ? (
                  <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'qr-question-hidden' : ''}>
                    {this.strings.mandatory_question}
                  </div>
                ) : null}
              </div>
            </div>
            <hr />

            <div id={'text' + this.question.linkId} class="qr-question-optionCard">
              {this.strings ? (
                <label class="qr-question-inputLabel qr-textQuestion-inputLabel" htmlFor="textarea">
                  {this.strings.text.text}:
                </label>
              ) : null}
              <div class="grow-wrap">
                <textarea id="textarea" class="form-control qr-question-input qr-textQuestion-input" value={this.selected} onInput={e => this.handleChange(e)} disabled={this.question.readOnly}/>
              </div>
            </div>
            <br />
          </div>
        ) : null}
        {this.variant === 'form' ? (
          <div>
            <div id={'text' + this.question.linkId} class="option-card">
              {this.strings ? (
                <label class="" htmlFor="textarea">
                  {this.question.text}
                </label>
              ) : null}
              <div class="grow-wrap">
                <textarea id="textarea" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
              </div>
            </div>
          </div>
        ) : null}
        {this.variant === 'compact' ? (
          <div>
            <div id={'text' + this.question.linkId} class="option-card">
              {this.strings ? (
                <label class="" htmlFor="textarea">
                  {this.question.text}
                </label>
              ) : null}
              <div class="grow-wrap">
                <textarea id="textarea" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
