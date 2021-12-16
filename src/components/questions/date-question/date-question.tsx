/**
 * This Component adds a single Date-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'date-question',
  styleUrl: 'date-question.css',
  shadow: false,
  scoped: true,
})
export class DateQuestion {
  @Element() element: HTMLElement;
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
    let object = null;
    if (this.validate) {
      object = {
        type: 'date',
        question: this.question,
        value: [this.selected],
      };
    } else {
      object = {
        type: 'date',
        question: this.question,
        value: [],
      };
    }
    this.emitAnswer.emit(object);
  }

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
  /**
   * Official FHIR-Date Regex
   */
  dateRegex: '^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$';

  /* computed */
  validate() {
    let regex = new RegExp(this.dateRegex);
    return (this.selected || this.selected === []) && regex.test(this.selected);
  }

  /* methods */
  setSelected() {
    this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'date');
  }
  handleChange(event) {
    this.selected = event.target.value;
  }

  /* Lifecycle Methods */
  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
      await this.setSelected();
      this.allow_events = true;
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div class="qr-question-container">
        {this.variant === 'touch' ? (
          <div>
            <div class="card">
              <div class="qr-question-title">
                <span class="qr-question-prefix">{this.question.prefix}</span>&nbsp;
                <span class="qr-question-text">{this.question.text}</span>
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
            <div class="qr-question-optionCard">
              {this.strings ? (
                <label class="qr-question-inputLabel qr-dateQuestion-inputLabel" htmlFor="date">
                  {this.strings.date.text}:
                </label>
              ) : null}
              <input id="date" type="date" class="form-control qr-question-input qr-dateQuestion-input" max="9999-12-31" value={this.selected} onInput={e => this.handleChange(e)} />
            </div>
            <br />
          </div>
        ) : null}
        {this.variant === 'form' ? (
          <div>
            <div class="option-card">
              {this.strings ? (
                <label class="" htmlFor="date">
                  {this.question.text}:
                </label>
              ) : null}
              <input id="date" type="date" class="form-control" max="9999-12-31" value={this.selected} onInput={e => this.handleChange(e)} />
            </div>
          </div>
        ) : null}
        {this.variant === 'compact' ? (
          <div>
            <div class="option-card">
              {this.strings ? (
                <label class="" htmlFor="date">
                  {this.question.text}:
                </label>
              ) : null}
              <input id="date" type="date" class="form-control" max="9999-12-31" value={this.selected} onInput={e => this.handleChange(e)} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
