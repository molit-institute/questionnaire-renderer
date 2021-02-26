/**
 * This Component adds a Boolean-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from "../../../utils/questionnaireResponseController";
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'boolean-question',
  styleUrl: 'boolean-question.css',
  shadow: false,
  scoped: true
})
export class BooleanQuestion {

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
          type: "boolean",
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
  onCardClick(selectedValue) {
    this.selected = selectedValue;
  }

  setSelected() {
    let value = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "boolean");
    if (value === true) {
      this.selected = "yes";
    } else if (value === false) {
      this.selected = "no";
    } else {
      this.selected = null;
    }
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
          <div>
            { this.question ? (
              <div class="form-group" id={'radio-boolean-' + this.question.linkId}>
                {/* <b-form-radio-group v-model="selected"> */}
                <div class={ this.selected && 'yes' === this.selected ? 'card radio-button-card card-selected' : 'card radio-button-card'} >
                  <div class="form-check">
                    <input id={'radioYes' + this.question.linkId} class="form-check-input radio-button" type="radio" name={'Radio' + this.question.linkId} onClick={() => this.onCardClick('yes')} value="yes" />
                    { this.strings ? 
                      <label class="form-check-label title" htmlFor={'radioYes' + this.question.linkId} onClick={() => this.onCardClick('yes')} >
                        { this.strings.yes }
                      </label>
                    : null}                    
                  </div>
                </div>
                <div class={ this.selected && 'no' === this.selected ? 'card radio-button-card card-selected' : 'card radio-button-card'}>
                  <div class="form-check">
                    <input id={'radioNo' + this.question.linkId} class="form-check-input radio-button" type="radio" name={'Radio' + this.question.linkId} onClick={() => this.onCardClick('no')} value="no" />
                    { this.strings ? 
                      <label class="form-check-label title" htmlFor={'radioNo' + this.question.linkId} onClick={() => this.onCardClick('no')}>
                        { this.strings.no }
                      </label>
                    : null}                    
                  </div>
                </div>
              </div>
            ): null}      
          </div>
          <br />
        </div>
    );
  }

}
