const lion_response2 = {
    resourceType: "QuestionnaireResponse",
    questionnaire: "Questionnaire/lionQuestionnaire",
    status: "in-progress",
    subject: {
        reference: "Patient/424"
    },
    authored: "2022-01-02T15:38:37+01:00",
    item: [
        {
            linkId: "0.1",
            text: "Fragebogen bedingte Fragen anzeigen?",
            answer: [{
                valueBoolean: false
            }]
        },
        {
            linkId: "0.2",
            text: "Fragebogen Gewichtszunahme anzeigen?",
            answer: [{
                valueBoolean: false
            }]
        },
        {
            linkId: "0.3",
            text: "Fragebogen Gewichtsabnahme anzeigen?",
            answer: [{
                valueBoolean: false
            }]
        },
        {
            linkId: "0.4",
            text: "Fragebogen für randomisierte Fragen anzeigen?",
            answer: [{
                valueBoolean: false
            }]
        },
        {
            linkId: "1",
            text: "Bedingte Fragen",
            item: [
                {
                    linkId: "1.1",
                    text: "Bedingte Fragen für Bewegung anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.2",
                    text: "Bedingte Fragen für Belastungen anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.3",
                    text: "Bedingte Fragen für Konzentrationsprobleme anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.4",
                    text: "Bedingte Fragen für Schlafqualität anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.5",
                    text: "Bedingte Fragen für Erschöpfung anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.6",
                    text: "Bedingte Fragen für Übelkeit anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.7",
                    text: "Bedingte Fragen für Erbrechen anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.8",
                    text: "Bedingte Fragen für Schmerz anzeigen?",
                    answer: [{
                        valueBoolean: true
                    }]
                },
                {
                    linkId: "1.9",
                    text: "Bedingte Fragen für Kurzatmigkeit anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.10",
                    text: "Bedingte Fragen für Appetitveränderung anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.11",
                    text: "Bedingte Fragen für Verstopfung anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                },
                {
                    linkId: "1.12",
                    text: "Bedingte Fragen für Durchfall anzeigen?",
                    answer: [{
                        valueBoolean: false
                    }]
                }
            ]
        }
    
    ]
}

export default lion_response2;