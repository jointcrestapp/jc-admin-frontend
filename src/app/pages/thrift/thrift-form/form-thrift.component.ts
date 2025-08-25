import { Component, ElementRef, HostListener, inject, Inject, Input, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModule, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import {  Store } from '@ngxs/store';
import { Observable, Subject, finalize, mergeMap, of, switchMap, take, takeUntil } from 'rxjs';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, VariationCombination } from '../../../shared/interface/product.interface';
import { MediaConfig, mediaConfig } from '../../../shared/data/media-config';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldsComponent } from '../../../shared/components/ui/form-fields/form-fields.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { NavService } from 'src/app/shared/services/nav.service';
import { Sidebar } from 'src/app/shared/interface/sidebar.interface';
import { RouterModule } from '@angular/router';
import { appConfig } from 'src/app/core/config/config';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoanState } from 'src/app/shared/store/state/loan.state';
import { ThriftsState } from 'src/app/shared/store/state/thrift.state';
import { GetThriftsCategories, GetThriftsTiers, GetFilteredMembers, SetLoadingState, GetActiveThriftForUser, CreateThrifts, EditThrifts, UpdateThrifts } from 'src/app/shared/store/action/thrift.action';
import { currency } from 'src/app/shared/data/currency';
import { GLOBALF } from 'src/app/core/utils/my_library';

function convertToNgbDate(date: NgbDateStruct): NgbDate {
  return new NgbDate(date.year, date.month, date.day);
}

@Component({
  selector: 'app-form-thrift',
  imports: [CommonModule, TranslateModule, FormsModule,
    ReactiveFormsModule, NgbModule, Select2Module, RouterModule,
    NgxEditorModule, FormFieldsComponent, ButtonComponent,
  ],
  templateUrl: './form-thrift.component.html',
  styleUrl: './form-thrift.component.scss'
})
export class FormThriftComponent {
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public text: string;
  public open = false;

  public menuItems: Sidebar[];
  public items: Sidebar[] = [];


  @Input() type: string;
  @ViewChild('nav') nav: NgbNav;
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('dropdownContainer', { static: false }) dropdownContainer: ElementRef;

  member$: Observable<any> = inject(Store).select(ThriftsState.member) as Observable<any>;
  tiers$: Observable<any> = inject(Store).select(ThriftsState.tiers);
  categories$: Observable<any> = inject(Store).select(ThriftsState.categories);
  thrift_tier$: Observable<any> = inject(Store).select(ThriftsState.thrift_tier) as Observable<any>;
  

  showCategoryDropdown = false;
  selectedCategory: any = null;

  public attribute$: Observable<Select2Data>;
  public tabError: string[] | null = [];
  public form: FormGroup;
  public id: number;
  public selectedCategories: number[] = [];
  public selectedTags: number[] = [];
  public variationCombinations: VariationCombination[] = [];
  public retrieveVariants: boolean = false;
  public variantCount: number = 0;
	public fromDate: NgbDate | null;
	public toDate: NgbDate | null;
  public hoveredDate: NgbDate | null = null;
  public collectionProduct: Select2Data;
  public product: Product;
  private destroy$ = new Subject<void>();
  public mediaConfig: MediaConfig = mediaConfig;
  public editor: Editor;
  public selectedMember: any = null;
  public html = '';
  public isCodeEditor = true;
  public years: Select2Data;
  public sharesType: Select2Data = [{
    value: 'Savings',
    label: 'Savings',
  },{
    value: 'Fixed',
    label: 'Fixed',
  },{
    value: 'Special',
    label: 'Special',
  }];

  public months: Select2Data = [
    {
      value: 1,
      label: "January"
    },
    {
      value: 2,
      label: "February"
    },
    {
      value: 3,
      label: "March"
    },
    {
      value: 4,
      label: "April"
    },
    {
      value: 5,
      label: "May"
    },
    {
      value: 6,
      label: "June"
    },
    {
      value: 7,
      label: "July"
    },
    {
      value: 8,
      label: "August"
    },
    {
      value: 9,
      label: "September"
    },
    {
      value: 10,
      label: "October"
    },
    {
      value: 11,
      label: "November"
    },
    {
      value: 12,
      label: "December"
    }
  ]

  public deductionSources: Select2Data = [
  {
    value: '1',
    label: 'Savings',  
  }
];

  public isBrowser: boolean;
  searchState: boolean;
  old_amount: any;
  user_savings_balance: any;
  user_amount: any;
  members_allowed: any;
  thrift_tier: any;
  
  
  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public navServices: NavService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.formBuilder.group({
      user_id: new FormControl('', [Validators.required]),
      amount: new FormControl(''),
      savings_bal: new FormControl('', [Validators.required]),
      tiers_id: new FormControl('', [Validators.required]),
      category_id: new FormControl('', [Validators.required]),
      duration: new FormControl(''),
      currency: new FormControl(''),
      thrift_cat: new FormControl(''),
      members_allowed: new FormControl(''),
      paid_from: new FormControl('', [Validators.required]),
    });
  }

    generateYearOptions(startYear: number = new Date().getFullYear(), numberOfYears: number = 50): any[] {
      return Array.from({ length: numberOfYears }, (_, i) => {
        const year = startYear + i;
        return {
          value: year,
          label: year.toString(),
        };
      });
    }

    closeSearch() {
      this.navServices.search = false;
    }

    selectMember(member: any) {
      console.log("SelectedMember :::::::::::", member);
      this.selectedMember = member;
      this.text = member.title; // Display the name in the input
      this.form.controls['user_id'].setValue(member.id); // Set the ID as form value
      this.form.controls['savings_bal'].setValue(member.savings_bal);
      this.user_savings_balance = member.savings_bal;
      this.removeFix(); // Close the dropdown
    }
  
    openDropDown(text: string) {
      text && (this.searchResult = !this.searchResult);
      var element = document.getElementsByTagName("body")[0];
      element.classList.toggle("overlay-search");
    }
  
    searchTerm(term?: string)  {
      if(term){
        this.addFix()
        this.store.dispatch(new GetFilteredMembers({search: term})).subscribe(() => {
          this.member$.pipe(take(1)).subscribe((response: any) => {
            console.log("Response :::::", response);
            if (response) {
              this.items = response.map((member: any) => ({
                id: member.value,
                title: member.label,
                member_id: member.memberId,
                savings_bal: member.savings_bal,
                type: 'link',
                path: '#',
                rawData: member // Store original data if needed
              }));
              this.checkSearchResultEmpty(this.items);
            } else {
              this.items = [];
              this.checkSearchResultEmpty([]);
            }
          });
        });
      }else {
        this.removeFix();
        return this.menuItems = []
      }
      return this.menuItems;
    }
  
  
    checkSearchResultEmpty(items: Sidebar[]) {
      if (!items.length) this.searchResultEmpty = true;
      else this.searchResultEmpty = false;
    }
  
    addFix() {
      this.searchResult = true;
      document.getElementsByTagName("body")[0].classList.add("overlay-search");
    }
  
    removeFix() {
      this.searchResult = false;
      // this.text = "";
      document.getElementsByTagName("body")[0].classList.remove("overlay-search");
    }
  
    clickOutside(): void {
      this.searchResult = false
    }

  ngOnInit() {
    this.years = this.generateYearOptions();
    this.store.dispatch(new GetThriftsTiers({}));
    if(this.isBrowser) {
      this.editor = new Editor();
    }
  
    // Dispatch action to get loan types and wait for them to load
    this.store.dispatch(new GetThriftsTiers({})).pipe(
      take(1),
      switchMap(() => this.tiers$),
      takeUntil(this.destroy$)
    ).subscribe(tiers => {
      // Now that loan types are loaded, handle the route params
      this.route.params.pipe(
        switchMap(params => {
          if(!params['id']) return of(null);
          return this.store.dispatch(new EditThrifts(params['id']))
            .pipe(mergeMap(() => this.store.select(ThriftsState.selectedThrifts)));
        }),
        takeUntil(this.destroy$)
      ).subscribe(thrift => {
        if(thrift){
          this.id = thrift.id,
          this.old_amount = thrift.amount,
          console.log("Loan :::::", thrift);
          let patchData: any = {
            user_id: thrift.user_id,
            amount: thrift.amount,
            savings_bal: thrift.savings_bal,
            tiers_id: thrift.tiers_id,
            category_id: thrift.category_id,
            duration: thrift.duration,
            paid_from: thrift.paid_from.toString()
          }
          
          if(thrift.full_name){
            this.text = thrift?.full_name;
            console.log("Text :::::::::;;;", this.text);
          }
          
          // Patch the form values after loan types are loaded
          this.form.patchValue(patchData);

          if(this.type === 'edit'){
            this.form.get('user_id')?.disable();
            this.form.get('amount')?.disable();
            this.searchState = true;
          }
        }
      });
    });
  
    // Set up the loan_offer_id change listener
    this.form.get('tiers_id').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(selectedTiersId => {
      if (selectedTiersId) {
        this.store.dispatch(new GetThriftsCategories(selectedTiersId));
        this.selectedCategory = null; // Reset selected category when tier changes
        this.thrift_tier$.pipe(takeUntil(this.destroy$)).subscribe(thrift_tier => {
          this.thrift_tier = thrift_tier
        })
        this.form.get('category_id').reset();
      }
    });
  }

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }
  
  selectCategory(category: any) {
    // Prevent selection if no slots available
    if (category.available_slots === 0) {
      this.notificationService.showError('This category has no available slots');
      return;
    }

    console.log("Category selected :::::::::::::::", category);
    this.form.get('category_id').setValue(category.value);
    this.form.get('currency').setValue(category.currency);
    this.form.get('thrift_cat').setValue(category.label);
    this.form.get('members_allowed').setValue(category.members_allowed);
    this.user_amount = category.amount;
    this.members_allowed = category.members_allowed;
    this.selectedCategory = category;
    this.showCategoryDropdown = false;

    if(!this.form.valid){
      return
    }

    this.form.get('duration')?.setValidators([Validators.required, Validators.min(1)]);
    this.form.get('duration')?.updateValueAndValidity();

    this.form.get('amount')?.setValidators([Validators.required, Validators.min(1)]);
    this.form.get('amount')?.updateValueAndValidity();

    if (this.type === 'edit') {
      this.form.get('user_id')?.enable();
      this.form.get('amount')?.enable();
    }

    let payload = {...this.form.value};
    console.log("Payload ::::::::::", payload);
    this.store.dispatch(new SetLoadingState(true));
    let action: any;

    action = new GetActiveThriftForUser(payload)

    this.store.dispatch(action).pipe(
      finalize(() => this.store.dispatch(new SetLoadingState(false))),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        console.log("Response :::::", res);
        const response = res?.thrifts?.response;
        let is_active = res?.thrifts?.is_active;
        if (response?.status === appConfig.statusCode.ok) {
          const successMessage = is_active ? response.message : "User does not have active thrift";
          this.notificationService.showSuccess(successMessage);
          if (is_active === false) this.form.get('duration').setValue(category.duration);
          this.tabError = [];
        } else {
          this.tabError = [];
          this.notificationService.showError(response?.message || 'Update failed');
        }
      },
      error: (err) => {
        this.notificationService.showError(err?.message || 'An unexpected error occurred');
      }
    })

  }
  
  // Add click outside handler
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-card-dropdown')) {
      this.showCategoryDropdown = false;
    }
  }

  

  

  submit() {
    this.form.markAllAsTouched();
    if(!this.form.valid){
      return
    }

    if(this.type === 'create'){
      if(this.user_savings_balance < ((this.user_amount * this.members_allowed * 50)/100)){
        this.notificationService.showError('User does not have the required amount for this Ttrift Category');
        return;
      }
    }


    if (this.type === 'edit') {
      this.form.get('user_id')?.enable();
      this.form.get('amount')?.enable();

      if((this.user_savings_balance + this.old_amount) < ((this.user_amount * this.members_allowed * 50)/100)){
        this.notificationService.showError('User does not have the required amount for this Ttrift Category');
        return;
      }
    }

    let payload = {...this.form.value};
    console.log("Payload ::::::::::", payload);
    this.store.dispatch(new SetLoadingState(true));
    let action: any;

    if(this.type == 'edit' && this.id) {
      action = new UpdateThrifts({...payload, thrift_tier: this.thrift_tier, old_amount: this.old_amount},  this.id);
    }

    if(this.type === 'create'){
      action = new CreateThrifts({...payload, thrift_tier: this.thrift_tier}) //paid from savings equals "1"
    }

    this.store.dispatch(action).pipe(
      finalize(() => this.store.dispatch(new SetLoadingState(false))),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        console.log("Response :::::", res);
        const response = res?.thrifts?.response;
        const successStatus = this.type === 'edit' ? appConfig.statusCode.ok : appConfig.statusCode.created;
        if (response?.status === successStatus) {
          const successMessage = this.type === 'edit' ? 'Thrift updated successfully' : 'Thrift created successfully';
          this.notificationService.showSuccess(response?.message || successMessage);
          this.router.navigateByUrl('/thrift');
          this.tabError = [];
        } else {
          this.tabError = [];
          this.notificationService.showError(response?.message || 'Update failed');
        }
      },
      error: (err) => {
        this.notificationService.showError(err?.message || 'An unexpected error occurred');
      }
    })
  }
  onAmountInput(event: Event, controlName: string) {
    GLOBALF.handleAmountInput(event, this.form, controlName);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.form.reset();
    this.renderer.removeClass(this.document.body, 'loader-none');
  }
}
