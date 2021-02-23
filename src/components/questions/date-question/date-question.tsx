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
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    console.log(newValue);
    this.strings = await getLocaleComponentStrings(this.element, newValue);
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
        <div class="card">
          <h2>
            {this.question.prefix} {this.question.text}
          </h2>
          {this.strings ? (
            <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'hidden' : ''}>
              {this.strings.mandatory_question}
            </div>
          ) : null}
        </div>
        <hr />
        <div class="option-card">
          {this.strings ? (
            <label class="" htmlFor="date">
              {this.strings.date.text}:
            </label>
          ) : null}
          <input id="date" type="date" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
        </div>
        <br />
      </div>
    );
  }
}
