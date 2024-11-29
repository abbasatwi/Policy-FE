import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../services/policy.service';
import { PolicyType } from '../../enums/policyTypes.enum';
import { policy } from '../../interfaces/policy';

@Component({
  selector: 'app-policy-add-update',
  standalone: true,
  templateUrl: './policy-add-update.component.html',
  styleUrls: ['./policy-add-update.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ]
})
export class PolicyAddUpdateComponent implements OnInit {
  policyForm!: FormGroup;
  isUpdateMode = false;
  policyId: number | null = null;
  policyType: PolicyType | null = null;
  policyMembers: string[] = [];
  loading = false;
  errorMessage: string | null = null;

  policyTypes = Object.keys(PolicyType)
    .filter(key => isNaN(Number(key))) // Filter out numeric keys
    .map(key => ({
      id: PolicyType[key as keyof typeof PolicyType], // Get the numeric id using the key
      name: key // The key represents the name of the policy type
    }));

  constructor(
    private _formBuilder: FormBuilder,
    private policyService: PolicyService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.policyId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.isUpdateMode = this.policyId > 0;

    this.policyForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      effectiveDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      policyTypeId: [null, Validators.required] // Use the policyTypeId control
    });

    if (this.isUpdateMode && this.policyId) {
      this.loadPolicy();
    }
  }

  loadPolicy() {
    this.loading = true;
    this.policyService.getPolicyById(this.policyId!).subscribe({
      next: (data) => {
        this.policyForm.patchValue({
          name: data.name,
          description: data.description,
          effectiveDate: this.formatDate(data.effectiveDate),
          expiryDate: this.formatDate(data.expiryDate),
          policyTypeId: data.policyType.id // Ensure that we're using the policyTypeId here
        });

        this.policyType = data.policyType.id; // Store policy type ID
        this.policyMembers = this.getMemberNames(data.policyMembers);

        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load policy details';
        this.loading = false;
      }
    });
  }

  getMemberNames(members: any[]): string[] {
    return members.map(member => member.name);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Ensures 'yyyy-MM-dd' format
  }

  onSubmit(): void {
    if (this.policyForm.invalid) {
      return;
    }
  
    const formValues = this.policyForm.value;
    const currentDate = new Date();
  
    // Convert form dates to Date objects
    const effectiveDate = new Date(formValues.effectiveDate);
    const expiryDate = new Date(formValues.expiryDate);
  
    // Ensure the date is in 'yyyy-MM-dd' format
    const formattedEffectiveDate = effectiveDate.toISOString().split('T')[0];
    const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
  
    // Check if the effective date is after the expiry date
    if (effectiveDate > expiryDate) {
      this.errorMessage = 'Effective date cannot be after expiry date.';
      return; // Prevent form submission
    }
  
    this.loading = true;
  
    // Prepare the policy data with Date objects for creationDate, effectiveDate, and expiryDate
    const policyData: policy = {
      name: formValues.name,
      description: formValues.description,
      creationDate: this.isUpdateMode ? undefined : new Date().toISOString().split('T')[0], // Format creation date to 'yyyy-MM-dd' for creation
      effectiveDate: formattedEffectiveDate,
      expiryDate: formattedExpiryDate,
      policyTypeId: formValues.policyTypeId,  // Use the ID for policy type
    };
  
    // Send the request to either update or create the policy
    const request = this.isUpdateMode
      ? this.policyService.updatePolicy(this.policyId!, policyData)
      : this.policyService.createPolicy(policyData);
  
    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/policies']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'An error occurred while saving the policy. Try Again Later.';
      }
    });
  }

  onCancel() {
    this.router.navigate(['/policies']);
  }
}
