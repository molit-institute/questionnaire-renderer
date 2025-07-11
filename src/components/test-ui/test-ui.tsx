import { Component, h, State } from '@stencil/core';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import * as examplePatient from '../../assets/fhir/resources/patient-example.js';
import enableQuestionnaire from '../../assets/fhir/resources/questionnaire-lang-enable.js';
import everyTypeQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type.js';
// import everyTypeWithInitialQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type_with_initial.js';
import repeatedQuestionnaire from '../../assets/fhir/resources/questionnaire-repeat.js';
import qlq_c30 from '../../assets/fhir/resources/qlq-c30.js';
import q_5d_5l from '../../assets/fhir/resources/5q-5d-5l.js';
import vomit from '../../assets/fhir/resources/vomit.js';
import lion from '../../assets/fhir/resources/lion_questionnaire.js';
import dropdown_test from '../../assets/fhir/resources/dropdown_test_questionnaire.js';
// import lion_response from '../../assets/fhir/resources/lion_questionnaire_response2.js';
// import qlq30_response from '../../assets/fhir/resources/qlq30_response.js';

@Component({
  tag: 'test-ui',
  styleUrl: 'test-ui.css',
  shadow: false,
  scoped: true,
})
export class TestUi {
  @State() questionnaireMode: string = 'stepper-questionnaire';
  @State() questionnaireVariant: string = 'Touch';
  questionnaireResponse: any = null;
  @State() show_questionnaire_list: boolean = true;
  @State() show_renderer: boolean = false;
  @State() show_summary: boolean = false;
  lastQuestion: boolean = false;
  edit: boolean = false;
  indexQuestion: Object = null;
  // baseUrl: string = 'https://fhir.molit.eu/fhir';
  @State() baseUrl: string = 'https://equ.molit-service.de/fhir';
  // baseUrl: string = 'https://dev.lion-app.de/fhir';
  // baseUrl: string = 'https://vitu-dev-app.molit-service.de/fhir';
  // questionnaireUrl: string = this.baseUrl + '/Questionnaire/56';
  questionnaireUrl: any = null;
  questionnaire: any = null;
  @State() questionnaireUrlIdentifier: any = "https://molit.eu/fhir/Questionnaire/qlq30";
  questionnaires: Array<any> = [enableQuestionnaire, everyTypeQuestionnaire, repeatedQuestionnaire, qlq_c30, q_5d_5l, vomit, lion, dropdown_test];
  @State() token: string = null
  testResp: object = null
  /* computed */
  examplePatient() {
    return examplePatient;
  }
  task: any = {
  resourceType: "Task",
  meta: {
    tag: [
      {
        code: "pre-OP",
        display: "vor OP"
      }
    ]
  },
  status: "active",
  intent: "order",
code: {
    coding: [
      {
        system: "http://molit.eu/fhir/CodeSystem/taskTypes",
        code: "eQuestionnaire",
        display: "eQU Questionnaire"
      }
    ],
    text: "PatientQuestionnaireTask"
  },
  focus: {
    reference: "Questionnaire/1",
    display: "QLQ-C30"
  },
  for: {
    reference: "Patient/14",
    display: "Maier, Peter"
  },
  executionPeriod: {
    start: "2023-10-25T10:38:49.378Z",
    end: "2025-01-01T09:00:05+01:00"
  }
}

  /* methods */
  setQuestionnaireMode(selectedMode) {
    this.questionnaireMode = selectedMode;
  }
  setQuestionnaireVariant(selectedVariant) {
    this.questionnaireVariant = selectedVariant;
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
  startQuestionnaire(){
    this.show_renderer = true;
    this.show_questionnaire_list = false;
    this.show_summary = false;
  }
  getItemList(object) {
    return questionnaireResponseController.createItemList(object);
  }
  updateQR(newqr) {
    this.questionnaireResponse = newqr.detail;
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
    this.questionnaireResponse = newQr.detail;
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

  handleTokenInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.token = input.value;
  };

  handleUrlInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.questionnaireUrlIdentifier = input.value;
  };
  handleBaseUrlInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.baseUrl = input.value;
  };

  render() {
    return (
      <div>
        <div class="container-fluid">
          {/* QUESTIONNAIRE RENDERER */}
          <div class="flex">
            <div onClick={() => this.setQuestionnaireMode('stepper-questionnaire')} class={this.questionnaireMode === 'stepper-questionnaire' ? 'item item-selected' : 'item'}>
              Stepper
            </div>
            <div onClick={() => this.setQuestionnaireMode('grouped-questionnaire')} class={this.questionnaireMode === 'grouped-questionnaire' ? 'item item-selected' : 'item'}>
              Grouped
            </div>
            <div onClick={() => this.setQuestionnaireMode('full-questionnaire')} class={this.questionnaireMode === 'full-questionnaire' ? 'item item-selected' : 'item'}>
              Full
            </div>
          </div>
          <div class="flex">
            <div onClick={() => this.setQuestionnaireVariant('Form')} class={this.questionnaireVariant === 'Form' ? 'item item-selected' : 'item'}>
              Form
            </div>
            <div onClick={() => this.setQuestionnaireVariant('Compact')} class={this.questionnaireVariant === 'Compact' ? 'item item-selected' : 'item'}>
              Compact
            </div>
            <div onClick={() => this.setQuestionnaireVariant('Touch')} class={this.questionnaireVariant === 'Touch' ? 'item item-selected' : 'item'}>
              Touch
            </div>
          </div>
          <br />
          <div>
            Token: <input type="text" style={{'min-width':'50%', margin:'0 0 10px 0'}} value={this.token} onInput={this.handleTokenInput}/>
          </div>
          <div>
            Questionnaire Url: <input type="text" style={{'min-width':'50%', margin:'0 0 10px 0'}} value={this.questionnaireUrlIdentifier} onInput={this.handleUrlInput}></input>
          </div>
          <div>
            Fhir Base Url: <input type="text" style={{'min-width':'50%'}} value={this.baseUrl} onInput={this.handleBaseUrlInput}></input>
          </div>
          <br />
          <button onClick={() => this.startQuestionnaire()}>Start via Url</button>
          <br />
          <br />
          {this.show_questionnaire_list
            ? this.questionnaires.map(questionnaire => (
                <div onClick={() => this.openSelectedQuestionnaire(questionnaire)}>
                  <div class="padding">{questionnaire.title}</div>
                </div>
              ))
            : null}
          {this.show_renderer ? (
            <questionnaire-renderer
              onFinished={event => this.toSummary(event)}
              onUpdated={event => this.updateQR(event)}
              onExit={() => this.toQuestionnaireList()}
              trademarkText="Dont copy meeeeee"
              enableInformationPage={true}
              informationPageText="<u>Test</u> Information <br> PageText"
              // questionnaireResponse={this.questionnaireResponse}
              // questionnaireResponse={lion_response}
              questionnaireResponse={this.testResp}
              questionnaire={this.questionnaire}
              // questionnaireUrl={this.questionnaireUrl}
              baseUrl={this.baseUrl}
              // lastQuestion={this.lastQuestion}
              locale="de"
              // danger="red"
              mode={this.questionnaireMode}
              // editMode={this.edit}
              // startQuestion={this.indexQuestion}
              enableFullQuestionnaireResponse={false}
              enableSummary={true}
              enableReturn={false}
              enableNext={false}
              enableFinishButton={true}
              // variant={this.questionnaireVariant}
              enableInformalLocale={true}
              showOnlySummary={false}
              enableExpand={true}
              enableGroupDescription={false}
              summaryText="Ihre Antworten werden nachfolgend abgebildet. Über den Button unterhalb dieser Übersicht gelangen Sie direkt zur Auswertung des Fragebogens"
              vasVertical={true}
              vasShowSelectedValue={true}
              token={this.token}
              enableErrorConsoleLogging={true}
              questionnaireResponseStatus="amended"
              onErrorLog={error => console.info(error)}
              visibleBooleanNullOption={true}
              questionnaireUrlIdentifier={this.questionnaireUrlIdentifier}
              task={this.task}
            ></questionnaire-renderer>
          ) : null}
          {this.show_summary ? (
            <div class="row">
              <div class="col-sm-4" style={{ backgroundColor: 'lightgrey', cursor: 'pointer' }}>
                <div onClick={() => this.backToRenderer()}>
                  <pre>{`${JSON.stringify(this.questionnaireResponse, null, 2)}`}</pre>
                </div>
              </div>
              <div class="col-sm-4" style={{ backgroundColor: 'lightgrey', cursor: 'pointer' }}>
                <div onClick={() => this.backToRenderer()}>
                  <pre>{`${JSON.stringify(this.questionnaire, null, 2)}`}</pre>
                </div>
              </div>
              <div class="col-sm-4">
                <div>
                  {this.getItemList(this.questionnaireResponse).map(item =>
                    item.hasOwnProperty('extension') && item.type === 'display' ? null : (
                      <div>
                        {item.text}
                        <div>
                          {item && !item.item ? (
                            <pre style={{ cursor: 'pointer' }} onClick={() => this.editQuestion(item)}>
                              {`${JSON.stringify(item.answer, null, 2)}`}
                            </pre>
                          ) : null}
                        </div>
                        <hr />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
