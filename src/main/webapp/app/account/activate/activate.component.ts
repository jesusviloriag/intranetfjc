import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { ActivateService } from './activate.service';

@Component({
  selector: 'jhi-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['activate.scss']
})
export class ActivateComponent implements OnInit {
  error: string;
  success: string;

  constructor(private activateService: ActivateService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(flatMap(params => this.activateService.get(params.key))).subscribe(
      () => {
        this.error = null;
        this.success = 'OK';
      },
      () => {
        this.success = null;
        this.error = 'ERROR';
      }
    );
  }
}
