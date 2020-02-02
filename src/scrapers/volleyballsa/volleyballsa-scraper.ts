import { Observable } from 'rxjs';

import { Target } from '@vcalendars/models/raw';
import { ScrapedSeason } from '@vcalendars/models/processed';

import { Scraper } from '../../scraper';
import * as collectors from './volleyballsa-collectors';

export class VolleyballSAScraper extends Scraper {
  constructor() {
    super('volleyball-sa');
  }

  public PerformScrape(target: Target): Observable<ScrapedSeason> {
    return collectors
      .collectGradeList(target.url)
      .pipe(
        collectors.transformGradesListToGradePages(target.url),
        collectors.transformGradePagesToScrapedSeasons(target),
      );
  }
}
