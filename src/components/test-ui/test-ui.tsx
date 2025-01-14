import { Component, h, State } from '@stencil/core';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import * as examplePatient from '../../assets/fhir/resources/patient-example.js';
import enableQuestionnaire from '../../assets/fhir/resources/questionnaire-lang-enable.js';
import everyTypeQuestionnaire from '../../assets/fhir/resources/questionnaire-every-type.js';
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
  // baseUrl: string = 'https://equ.molit-service.de/fhir';
  // baseUrl: string = 'https://dev.lion-app.de/fhir';
  baseUrl: string = 'https://vitu-dev-app.molit-service.de/fhir';
  questionnaireUrl: string = this.baseUrl + '/Questionnaire/56';
  questionnaire: any = null;
  questionnaires: Array<any> = [enableQuestionnaire, everyTypeQuestionnaire, repeatedQuestionnaire, qlq_c30, q_5d_5l, vomit, lion, dropdown_test];
  token: string ='eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtTmZsdHEyMVhOd19Fdk1uQXlaX2E0Sjk5Zm5kX2JJbjY5NzljMGZNT0JRIn0.eyJleHAiOjE3MzY4NjU0MTgsImlhdCI6MTczNjg2NDgxOCwiYXV0aF90aW1lIjoxNzM2ODQ4MDQ4LCJqdGkiOiIwMzIxNmZkMC0xNmE5LTQ5MWQtYjc1MS02MTk0YzZlYmI3MjAiLCJpc3MiOiJodHRwczovL3ZpdHUtZGV2LWFwcC5tb2xpdC1zZXJ2aWNlLmRlL2F1dGgvcmVhbG1zL3ZpdHUtcmVhbG0iLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiNzEyNzU3ZGUtOWRhMC00MDRiLWJjYzAtYjlhMzJiNGVlODNhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidml0dS1hdXRoIiwic2lkIjoiMDgxZGVkMmMtMWQ4Zi00NzRiLTkzMWQtYTBmYThiNjY2YThkIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3QqIiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaHR0cDovL2xvY2FsaG9zdDo0MTczIiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyIsImh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyIsImh0dHA6Ly9sb2NhbGhvc3Q6NTE3My8iLCJodHRwczovL3ZpdHUtZGV2LWFwcC5tb2xpdC1zZXJ2aWNlLmRlIiwiaHR0cDovL2xvY2FsaG9zdDo0MTczLyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidml0dS1jYXNlLW1hbmFnZXIiLCJkZWZhdWx0LXJvbGVzLXZpdHUtcmVhbG0iLCJ2aXR1LW1vZGVyYXRvciIsInZpdHUtdXNlciIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ2aXR1LWFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIiwibWFuYWdlLXVzZXJzIiwidmlldy11c2VycyIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIiwicXVlcnktdXNlcnMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkphbiBSb8OfIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiamFuLnJvc3NAbW9saXQtc2VydmljZS5kZSIsImdpdmVuX25hbWUiOiJKYW4iLCJmYW1pbHlfbmFtZSI6IlJvw58iLCJ2aXR1LWdyb3VwIjpbInRlc3QyM2VyZDIzIl0sImVtYWlsIjoiamFuLnJvc3NAbW9saXQtc2VydmljZS5kZSJ9.m4AiFpoJsUx7QBqvnm6JYj7Cf7x_iWbZ8FdxOAESi5EBUKMWwXJMAvkmS1G3kaMhdaGg4i7U3nbHiSloeHi6zdO-CF_2hjIycIxBt9Sk5JoJKCFNulnMp_hvw3ouHmhdSl4ImXiq_Wzo6fkFkHiU2MMqlJv0GqyEevsrLIR0Ao2W9Zi_94wnvONJPjmQEzecivWoRfut5vXti7dPS6irt7ZPbn5S8fGFiykXIFBrEVvUfKFSizNjUVUzTY2FXBcjfAdwLlrSLpbWkMBQlRMOkNjEnFK_S41I5zqB9k3tn3WJ0Myt67UV0NVSOUYGX2eIi0HX5rovNQEwdnm9vQDM_w';
  testResp: object = null
  /* computed */
  examplePatient() {
    return examplePatient;
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
              enableNext={true}
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
