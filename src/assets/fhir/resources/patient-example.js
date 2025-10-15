export default {
  resourceType: 'Patient',
  id: 222,
  meta: {
    profile: ['http://fhir.de/StructureDefinition/patient-de-basis/0.2'],
  },
  identifier: [
    {
      system: 'http://example.org/sampleepisodeofcare-identifier',
      value: '123',
    },
  ],
  name: [
    {
      use: 'official',
      text: 'Martina Mustermann',
      family: 'Mustermann',
      given: ['Martina'],
    },
  ],
  birthDate: '2018-10-11',
  address: [
    {
      use: 'home',
      type: 'physical',
      text: 'Musterweg 42, Hinterhof 2. Etage, 10787 Berlin, Deutschland',
      line: ['Musterweg 42', 'Hinterhof 2. Etage'],
      _line: [
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-streetName',
              valueString: 'Musterweg',
            },
            {
              url: 'http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-houseNumber',
              valueString: '42',
            },
          ],
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-additionalLocator',
              valueString: 'Hinterhof 2. Etage',
            },
          ],
        },
      ],
      city: 'Berlin',
      state: 'DE-BE',
      postalCode: '10787',
      country: 'DE',
    },
    {
      use: 'home',
      type: 'postal',
      text: 'Postfach 74656, 76297 Spöck, Deutschland',
      line: ['Postfach 74656'],
      _line: [
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/iso21090-ADXP-postBox',
              valueString: 'Postfach 74656',
            },
          ],
        },
      ],
      city: 'Spöck',
      state: 'DE-BW',
      postalCode: '76297',
      country: 'DE',
    },
  ],
};
