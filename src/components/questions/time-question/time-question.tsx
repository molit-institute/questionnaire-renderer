/**
 * This Component adds a single Time-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'time-question',
  styleUrl: 'time-question.css',
  shadow: false,
  scoped: true,
})
export class TimeQuestion {
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
    if (this.allow_events) {
      let object = null;
      if (this.selected) {
        object = {
          type: 'time',
          question: this.question,
          value: [this.selected],
        };
      } else {
        object = {
          type: 'time',
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

  /* computed */
  validate() {
    return this.selected || this.selected === [];
  }

  /* methods */
  setSelected() {
    this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'time');
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
                <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'hidden' : ''}>
                  {this.strings.mandatory_question}
                </div>
              ) : null}
            </div>
            <hr />
            <div class="card option-card">
              <div>
                {this.strings ? (
                  <label class="" htmlFor="time">
                    {this.strings.time.text}:
                  </label>
                ) : null}
                <input id="time" type="time" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
              </div>
            </div>
            <br />
          </div>
        ) : null}
        {this.variant === 'form' ? (
          <div> <div class="card option-card">
            <div>
              {this.strings ? (
                <label class="" htmlFor="time">
                  {this.strings.time.text}:
                </label>
              ) : null}
              <input id="time" type="time" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
            </div>
          </div></div>
        ) : null}
        {this.variant === 'compact' ?
          <div>
            <div class="card option-card">
              <div>
                {this.strings ? (
                  <label class="" htmlFor="time">
                    {this.strings.time.text}:
                  </label>
                ) : null}
                <input id="time" type="time" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
              </div>
            </div>
          </div> : null}
      </div>
    );
  }
}
