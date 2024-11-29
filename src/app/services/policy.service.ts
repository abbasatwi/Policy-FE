import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { policy } from '../interfaces/policy';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private baseUrl = 'https://localhost:5001/api/policy';

  constructor(private _httpClient: HttpClient) { }

  // Get paginated list of policies
  public getPolicies(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', pageSize);
    return this._httpClient.get<any>(this.baseUrl, { params });
  }

  // Get a single policy by ID
  public getPolicyById(id: number): Observable<any> {
    return this._httpClient.get<any>(`${this.baseUrl}/${id}`);
  }

  // Create a new policy
  public createPolicy(policy: policy): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl, policy);
  }

  // Update an existing policy
  public updatePolicy(id: number, policy: policy): Observable<any> {
    return this._httpClient.put<any>(`${this.baseUrl}/${id}`, policy);
  }

  // Delete a policy by ID
  public deletePolicy(id: number): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
