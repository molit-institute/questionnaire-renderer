/**
 * This Component adds a single Date-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import questionnaireController from '../../../utils/questionnaireController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';
import moment from 'moment';

@Component({
  tag: 'date-question',
  styleUrl: 'date-question.css',
  shadow: false,
  scoped: true,
})
export class DateQuestion {
  @Element() element: HTMLElement;
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
  @State() reset: Boolean = false;
  @Watch('question')
  watchQuestion() {
    this.setSelected();
    this.handleMaxValue();
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
  /**
   * Official FHIR-Date Regex
   */
  dateRegex: '^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$';

  /* computed */
  validate() {
    let regex = new RegExp(this.dateRegex);
    return (this.selected ? true : false) && regex.test(this.selected);
  }

  /* methods */
  setSelected() {
    this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'date');
  }
  handleChange(event) {
    this.selected = event.target.value;
  }

  preventKeyDown(event) {
    event.preventDefault();
  }

  async handleMaxValue() {
    let extension = await questionnaireController.lookForExtension('http://molit-service.de/fhir/isMaxValueCurrentDate', this.question);
    let input = await document.getElementById(this.question.linkId + '-dateInput');
    if (input) {
      if (extension && extension.valueBoolean) {
        input.addEventListener('keydown', this.preventKeyDown);
        input.setAttribute('max', moment(new Date()).format('YYYY-MM-DD'));
      } else {
        input.removeEventListener('keydown', this.preventKeyDown);
        input.setAttribute('max', '9999-12-31');
      }
    }
  }

  createDateInputId() {
    return this.question.linkId + '-dateInput';
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

  componentDidRender() {
    this.handleMaxValue();
  }

  render() {
    return (
      <div class="qr-question-container">
        <div class="qr-question qr-question-date">
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
          <div class="qr-question-optionCard">
            {this.strings ? (
              <label class="qr-question-inputLabel qr-dateQuestion-inputLabel" htmlFor="date">
                {this.strings.date.text}:
              </label>
            ) : null}
            <input id={this.createDateInputId()} type="date" class="form-control qr-question-input qr-dateQuestion-input" value={this.selected} onInput={e => this.handleChange(e)} disabled={this.question.readOnly} />
          </div>
          <br />
        </div>
      </div>
    );
  }
}
