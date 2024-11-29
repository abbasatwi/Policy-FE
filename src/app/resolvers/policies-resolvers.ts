import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PolicyService } from '../services/policy.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoliciesResolver implements Resolve<any> {
  constructor(private _policyService: PolicyService) {}

  resolve(): Observable<any> {
    const page = 0;
    const pageSize = 10;
    return this._policyService.getPolicies(page, pageSize);
  }
}
