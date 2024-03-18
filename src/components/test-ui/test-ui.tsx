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
  baseUrl: string = 'https://equ.molit-service.de/fhir';
  // baseUrl: string = 'https://dev.lion-app.de/fhir';
  questionnaireUrl: string = this.baseUrl + '/Questionnaire/56'
  questionnaire: any = null;
  questionnaires: Array<any> = [enableQuestionnaire, everyTypeQuestionnaire, repeatedQuestionnaire, qlq_c30, q_5d_5l, vomit, lion];
  token: string = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJWUkFjb0VJV2JNTlkwNzJLMGFyaTFpUkxqM1dmVUhuWHpWRmd3bDAyVkdzIn0.eyJleHAiOjE2NTIwODc2MzMsImlhdCI6MTY1MTY1NTYzMywiYXV0aF90aW1lIjoxNjUxNDkyNDUzLCJqdGkiOiJmN2EwZjczMS0zOWI2LTQ0NmItODU2Ni1hMDkyOGY2NmFkNjIiLCJpc3MiOiJodHRwczovL2Rldi5saW9uLWFwcC5kZS9hdXRoL3JlYWxtcy9saW9uLXJlYWxtIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjVjMWRiZWQxLTg5YWEtNGM1MS1iZTkxLWM0YTA5NGIxYWIwYiIsInR5cCI6IkJlYXJlciIsImF6cCI6Imxpb24tYXBwIiwibm9uY2UiOiJHOVdaMTBkakFRRWRZY0ZuMWlQTmhnIiwic2Vzc2lvbl9zdGF0ZSI6IjA3MDI3NTQxLTg4ZDItNDY0ZC1iOGZhLTE4MGZiZWI0NzBkOCIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWxpb24tcmVhbG0iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiIwNzAyNzU0MS04OGQyLTQ2NGQtYjhmYS0xODBmYmViNDcwZDgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VuZGVyIjoiZmVtYWxlIiwicGF0aWVudElkIjoiMTkiLCJuYW1lIjoiS2F0aGFyaW5hcyBUZXN0bnV0emVyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoia2F0aGFyaW5hLnplbGxlckBtb2xpdC5ldSIsImdpdmVuX25hbWUiOiJLYXRoYXJpbmFzIiwiZmFtaWx5X25hbWUiOiJUZXN0bnV0emVyIiwiZW1haWwiOiJrYXRoYXJpbmEuemVsbGVyQG1vbGl0LmV1In0.k6JVgOwPG65MROEDhNrFB8NUYPfBDFF-0TXSAwTaUS12ySSf6h6A68Gdm0znD8p7WP_llcG_j9zyYKp1lMGZBiHfA_Q4gj6pqQ0ssABMI-jpi2UrHwo3anzRnu0ntJRhrbkX1wRFbiGXvYtXV7QKXBB5nGwrXFkDxn9Mz414Tid6fAkZQNja_DzNpCb7L6cQ2hmIpNe9rEYwcQXOymvXJW0PN_PeaeIk6WZToXxmHxrM3TDuK7S4Jbm-kab4Bc0pycV7tth1GqRBQCI0_3i0r1_Z9JOKY547JyCCJWcdYO-aQGYv7zZtKMooKIyNTmHzbWSoB_iUkBQjk4LgzBk9bA'
  testResp: object = {
    "resourceType": "QuestionnaireResponse",
    "id": 22,
    "status": "completed",

    "subject": null,
    "authored": "2022-11-28T17:45:28+01:00",
    "questionnaire":"http://fhir.molit.eu/fhir/Questionnaire/test",
    "source": null,
    "item": [
      {
        "linkId": "1",
        "text": "Have you ever worked with HL7 FHIR?",
        "answer": [
          {
            "valueBoolean": false
          }
        ],
        "item": null,
        "type": ""
      },
      {
        "linkId":"1.1",
        "text":"Have you ever",
        "answer":[
          {
            "valueCoding": {
                "code": "A1",
                "display": "1"
            }
        }
        ]
      },
      {
        "linkId": "3",
        "text": "Fraaaaage 3",
        "answer": [
          {
            "valueString": "huhu"
          }
        ],
        "item": null,
        "type": ""
      }
    ]
  }
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
              trademarkText='Dont copy meeeeee'
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
              enableErrorConsoleLogging={false}
              questionnaireResponseStatus="amended"
              onErrorLog={error => console.info(error)}
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
