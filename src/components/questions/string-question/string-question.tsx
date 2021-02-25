/**
 * This Component adds a String-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from "../../../utils/questionnaireResponseController";
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'string-question',
  styleUrl: 'string-question.css',
  shadow: false,
  scoped: true
})
export class StringQuestion {

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
  @Prop()questionnaireResponse: Object = null;
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
      if (this.selected !== null) {
        let object = {
          type: "string",
          question: this.question,
          value: [this.selected]
        };
        this.emitAnswer.emit(object);
      }
    }
  }
  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;

  /* computed */
  validate() {
    return this.selected || this.selected === [];
    // return false;
  }

  /* methods */
  handleChange(event) {
    this.selected = event.target.value;
  }

  setSelected() {
    let value = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "string");
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
          <div class="">
            <h2>{ this.question.prefix } { this.question.text }</h2>
            { this.strings ? 
              <div style={{ color: this.danger }} class={ (this.validate() || !this.question.required) ? 'hidden' : ''} >           
                { this.strings.mandatory_question }
              </div>
            : null}            
          </div>
          <hr />

          <div class="option-card">
          {this.strings ? (
            <label class="" htmlFor="string">
              {this.strings.text.text}:
            </label>
          ) : null}
          <input id="string" type="text" class="form-control" value={this.selected} onInput={e => this.handleChange(e)} />
        </div>
          <br />
        </div>
    );
  }

}