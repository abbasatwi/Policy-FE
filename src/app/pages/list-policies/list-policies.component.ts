import { map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PolicyService } from '../../services/policy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-list-policies',
  standalone: true,
  imports: [MatPaginatorModule, CommonModule],
  templateUrl: './list-policies.component.html',
  styleUrls: ['./list-policies.component.css'],
})
export class ListPoliciesComponent implements OnInit {
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  policies: any[] = [];

  constructor(
    private _policyService: PolicyService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    // Initial fetch of policies
    this.loadPolicies(this.currentPage, this.pageSize);
  }

  loadPolicies(page: number, size: number) {
    this._policyService.getPolicies(page + 1, size).subscribe({
      next: (response) => {
        this.policies = response.policies;  // Extract policies from the response
        this.totalItems = response.totalItems;  // Set totalItems for pagination
      },
      error: (error) => {
        console.error('Error fetching policies:', error);
      }
    });
  }
  

  pageChanged(event: PageEvent) {
    console.log('Page changed:', event);
    this.currentPage = event.pageIndex;
    this.loadPolicies(this.currentPage, this.pageSize);
  }
  
  

  editPolicy(id: number) {
    this._router.navigate(['/policies/add-update', id]); // Navigate to the add-update component
  }

  deletePolicy(id: number) {
    this._policyService.deletePolicy(id).subscribe(
      () => {
        this.policies = this.policies.filter((policy) => policy.id !== id);
      },
      (error) => {
        console.error('Error deleting policy:', error);
        // Handle error gracefully
      }
    );
  }

  addPolicy() {
    this._router.navigate(['/policies/add-update']); // Navigate to add new policy
  }
}
