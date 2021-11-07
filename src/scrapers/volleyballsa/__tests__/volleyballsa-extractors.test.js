const extractor = require('../volleyballsa-extractors');
const testData = require('./volleyballsa-extractors.data');

describe('volleyballsa', () => {
  describe('extractors', () => {
    describe('extractDateFromTr', () => {
      it('Must extract match date from social tr', () => {
        const tr = `
          <tr class="result">
            <td class="team-schedule__date">Wednesday, Jan 22</td>
            <td class="team-schedule__time">18:45pm</td>
          </tr>
        `;
        const timezone = 'Australia/Adelaide';

        const expected = new Date(`${(new Date()).getFullYear()}-01-22T08:15:00.000Z`);

        const actual = extractor.extractDateTimeFromTr(tr, timezone);

        expect(actual).toEqual(expected);
      });
      it('Must extract match date from state league tr', () => {
        const tr = `
          <tr class="result">
            <td class="team-schedule__date">Saturday, Jul 4</td>
            <td class="team-schedule__time">09:20am</td>
          </tr>
        `;
        const timezone = 'Australia/Adelaide';

        const expected = new Date(`${(new Date()).getFullYear()}-07-03T23:50:00.000Z`);

        const actual = extractor.extractDateTimeFromTr(tr, timezone);

        expect(actual).toEqual(expected);
      });
    });
    describe('extractTeamsFromTr', () => {
      it('Must extract team names from social tr', () => {
        const tr = `
          <tr class="result">
            <td class="team-schedule__versus">
              <b>Won Direction</b> <span>v</span> <b>2nd Game Anyone?</b>
            </td>
            <td class="team-schedule__duty"></td>
          </tr>
        `;

        const expected = {
          home: { name: 'Won Direction', isExternal: false },
          away: { name: '2nd Game Anyone?', isExternal: false },
          duty: undefined,
        };

        const actual = extractor.extractTeamsFromTr(tr);

        expect(actual).toEqual(expected);
      });
      it('Must extract team names from state league tr', () => {
        const tr = `
        <tr class="result">
          <td class="team-schedule__versus">
            <b><a href="#duty-21476-3335" onclick="document.getElementById('duty-21476-3335').classList.toggle('hidden');return false">HENLEY</a></b> <span>v</span> <b>AUSTRAL</b>
            <div id="duty-21476-3335" class="hidden" style="border:1px solid #ccc;padding:0.5em;background:white">
              <small>
                <b>HENLEY Duty:</b>
                <br>
                <span>
                  11:20am Mt Lofty Community Centre / Court 1
                  <br>
                  HENLEY v AUSTRAL
                </span>
                <br>
              </small>
            </div>
          </td>
          <td class="team-schedule__duty">MEN / LM / AUSTRAL</td>
        </tr>
        `;

        const expected = {
          home: { name: 'HENLEY', isExternal: false },
          away: { name: 'AUSTRAL', isExternal: false },
          duty: { name: 'MEN / LM / AUSTRAL', isExternal: true },
        };

        const actual = extractor.extractTeamsFromTr(tr);

        expect(actual).toEqual(expected);
      });
    });
    describe('extractDutiesFromTr', () => {
      it('Must extract single duty from tr', async () => {
        const timezone = 'Australia/Adelaide';
        const duration = 60;
        const round = 'Bonus Round';
        const tr = `
        <tr class="result">
          <td class="team-schedule__date">Wednesday, Jan 22</td>
          <td class="team-schedule__versus">
            <b><a href="#duty-21476-3335" onclick="document.getElementById('duty-21476-3335').classList.toggle('hidden');return false">HENLEY</a></b> <span>v</span> <b>AUSTRAL</b>
            <div id="duty-21476-3335" class="hidden" style="border:1px solid #ccc;padding:0.5em;background:white">
              <small>
                <b>HENLEY Duty:</b>
                <br>
                <span>
                  11:20am Mt Lofty Community Centre / Court 1
                  <br>
                  HENLEY v AUSTRAL
                </span>
                <br>
              </small>
            </div>
          </td>
          <td class="team-schedule__duty">MEN / LM / AUSTRAL</td>
        </tr>
        `;

        const expected = [{
          type: 'duty',
          time: new Date(`${(new Date()).getFullYear()}-01-22T00:50:00.000Z`),
          timezone,
          duration,
          court: 'Court 1',
          venue: 'Mt Lofty Community Centre',
          home: { name: 'HENLEY', isExternal: true },
          away: { name: 'AUSTRAL', isExternal: true },
          duty: { name: 'HENLEY', isExternal: false },
          round,
        }];

        const actual = extractor.extractDutiesFromTr(tr, round, timezone, duration);

        expect(actual).toEqual(expected);
      });
      it('Must return empty array if no duty in tr', async () => {
        const timezone = 'Australia/Adelaide';
        const tr = `
          <tr class="result">
            <td class="team-schedule__date">Wednesday, Jan 22</td>
            <td class="team-schedule__versus">
              <b>Won Direction</b> <span>v</span> <b>2nd Game Anyone?</b>
            </td>
            <td class="team-schedule__duty"></td>
          </tr>
        `;

        const expected = [];

        const actual = extractor.extractDutiesFromTr(tr, timezone);

        expect(actual).toEqual(expected);
      });
    });
    describe('extractVenueFromTr', () => {
      it('Must extract venue from social tr', () => {
        const tr = `
          <tr class="result">
            <td class="team-schedule__venue">Port Noarlunga / Court 1</td>
          </tr>
        `;

        const expected = 'Port Noarlunga';

        const actual = extractor.extractVenueFromTr(tr);

        expect(actual).toEqual(expected);
      });
      it('Must extract venue from state league tr', () => {
        const tr = `
          <tr class="result">
            <td class="team-schedule__venue">Mt Lofty Community Centre / Court 1</td>
          </tr>
        `;

        const expected = 'Mt Lofty Community Centre';

        const actual = extractor.extractVenueFromTr(tr);

        expect(actual).toEqual(expected);
      });
    });
    describe('extractCourtFromTr', () => {
      it('Must extract court from social tr', () => {
        const tr = `
          <tr class="result">
            <td class="team-schedule__venue">Port Noarlunga / Court 1</td>
          </tr>
        `;

        const expected = 'Court 1';

        const actual = extractor.extractCourtFromTr(tr);

        expect(actual).toEqual(expected);
      });
      it('Must extract court from social tr', () => {
        const tr = `
          <tr class="result">
            <td class="team-schedule__venue">Mt Lofty Community Centre / Court 1</td>
          </tr>
        `;

        const expected = 'Court 1';

        const actual = extractor.extractCourtFromTr(tr);

        expect(actual).toEqual(expected);
      });
    });
    describe('extractGradesFromPage', () => {
      it('Must extract grades from social page', () => {
        const expected = [
          { id: 414, name: 'Henley / A' },
          { id: 415, name: 'Pt Noarlunga / A' },
        ];

        const actual = extractor.extractGradesFromPage(testData.socialBasePage);

        expect(actual).toEqual(expected);
      });
    });
    describe('isTrBye', () => {
      it('Must identify when a Tr is a bye', () => {
        const tr = `
          <tr class="result last past">
              <td class="team-schedule__versus">
                <b>USC LION</b> <span>v</span> <b><a href="#duty-21681-0" onclick="document.getElementById('duty-21681-0').classList.toggle('hidden');return false">(bye)</a></b>
              </td>
              <td class="team-schedule__duty"></td>
              <td class="team-schedule__venue"></td>
              <td class="team-schedule__time"></td>
            </tr>
          `;

        const expected = true;

        const actual = extractor.isTrBye(tr);

        expect(actual).toEqual(expected);
      });
      it('Must identify when a Tr is not a bye', () => {
        const tr = `
          <tr class="result past">
						<td class="team-schedule__date">Saturday, Jul 4</td>
						<td class="team-schedule__versus">
              <b>AUSTRAL</b>
              <span>v</span>
              <b><a href="#duty-21680-3353" onclick="document.getElementById('duty-21680-3353').classList.toggle('hidden');return false">HENLEY</a></b>
            </td>
						<td class="team-schedule__duty">WOMEN / RW / HENLEY</td>
						<td class="team-schedule__venue">Mt Lofty Community Centre / Court 3</td>
						<td class="team-schedule__time">09:20am</td>
					</tr>
        `;

        const expected = false;

        const actual = extractor.isTrBye(tr);

        expect(actual).toEqual(expected);
      });
    });
  });
});
