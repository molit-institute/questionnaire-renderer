import { Component, h, State } from '@stencil/core';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import * as examplePatient from '../../assets/fhir/resources/patient-example.js';
import enableQuestionnaire from '../../assets/fhir/resources/questionnaire-lang-enable.js';

@Component({
  tag: 'test-ui',
  styleUrl: 'test-ui.css',
  shadow: true,
})
export class TestUi {
  @State() questionnaireMode: string = 'StepperQuestionnaire';
  questionnaireResponse: Object = null;
  @State() show_questionnaire_list: boolean = true;
  @State() show_renderer: boolean = false;
  @State() show_summary: boolean = false;
  lastQuestion: boolean = false;
  edit: boolean = false;
  indexQuestion: Object = null;
  baseUrl: string = 'https://fhir.molit.eu/fhir/';
  questionnaire: any = null;
  questionnaires: Array<any> = [enableQuestionnaire];

  /* computed */
  examplePatient() {
    return examplePatient;
  }

  /* methods */
  setQuestionnaireMode(selectedMode) {
    console.log(selectedMode)
    this.questionnaireMode = selectedMode;
  }
  setQuestionnaireResponse(response) {
    this.questionnaireResponse = response;
  }
  openSelectedQuestionnaire(questionnaire) {
    this.questionnaire = questionnaire;
    this.show_renderer = true;
    this.show_questionnaire_list = false;
    this.show_summary = false;
  }
  getItemList(object) {
    return questionnaireResponseController.createItemList(object);
  }
  updateQR(newqr) {
    this.questionnaireResponse = newqr;
  }
  editQuestion(question) {
    this.show_summary = false;
    this.edit = true;
    this.indexQuestion = question;
    this.lastQuestion = false;
    this.show_renderer = true;
  }
  toQuestionnaireList() {
    this.show_renderer = false;
    this.show_summary = false;
    this.show_questionnaire_list = true;
    this.lastQuestion = false;
  }
  toSummary(newQr) {
    this.questionnaireResponse = newQr;
    this.show_renderer = false;
    this.edit = false;
    // this.index = null;
    this.show_summary = true;
    this.indexQuestion = null;
    this.lastQuestion = false;
  }
  backToRenderer() {
    this.show_summary = false;
    this.lastQuestion = true;
    this.show_renderer = true;
    this.edit = false;
    this.indexQuestion = null;
  }

  render() {
    return (
      <div>
        <div class="container-fluid">
          {/* QUESTIONNAIRE RENDERER */}
          <span class="flex">
            <div onClick={() => this.setQuestionnaireMode('StepperQuestionnaire')} class={this.questionnaireMode === 'StepperQuestionnaire' ? 'item item-selected' : 'item'}>
              Stepper
            </div>
            <div onClick={() => this.setQuestionnaireMode('GroupedQuestionnaire')} class={this.questionnaireMode === 'GroupedQuestionnaire' ? 'item item-selected' : 'item'}>
              Grouped
            </div>
            <div onClick={() => this.setQuestionnaireMode('FullQuestionnaire')} class={this.questionnaireMode === 'FullQuestionnaire' ? 'item item-selected' : 'item'}>
              Full
            </div>
          </span>

          {this.show_questionnaire_list
            ? this.questionnaires.map(questionnaire => (
                <div onClick={() => this.openSelectedQuestionnaire(questionnaire)}>
                  <div>{questionnaire.title}</div>
                </div>
              ))
            : null}
          {this.show_renderer ? (
            <questionnaire-renderer
              onFinished={event => this.toSummary(event)}
              onUpdated={event => this.updateQR(event)}
              onExit={() => this.toQuestionnaireList()}
              questionnaireResponse={this.questionnaireResponse}
              questionnaire={this.questionnaire}
              baseUrl={this.baseUrl}
              lastQuestion={this.lastQuestion}
              locale="de"
              mode={this.questionnaireMode}
              editMode={this.edit}
              startQuestion={this.indexQuestion}
            ></questionnaire-renderer>
          ) : null}
          {this.show_summary ? (
            <div class="row">
              <div class="col-sm-4" style={{ backgroundColor: 'lightgrey', cursor: 'pointer' }}>
                <div onClick={() => this.backToRenderer()}>
                  <pre>{this.questionnaireResponse}</pre>
                </div>
              </div>
              <div class="col-sm-4" style={{ backgroundColor: 'lightgrey', cursor: 'pointer' }}>
                <div onClick={() => this.backToRenderer()}>
                  <pre>{this.questionnaire}</pre>
                </div>
              </div>
              <div class="col-sm-4">
                <div>
                  {this.getItemList(this.questionnaire).map((item, index) => (
                    <div>
                      {item.text}
                      <div>
                        {this.getItemList(this.questionnaireResponse)[index] && this.getItemList(this.questionnaire)[index].type !== 'group'}
                        <pre style={{ cursor: 'pointer' }} onClick={() => this.editQuestion(item)}>
                          {this.getItemList(this.questionnaireResponse)[index].answer}
                        </pre>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
