import { Component, ElementRef, inject, Inject, Input, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModule, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import {  Store } from '@ngxs/store';
import { ProductState } from '../../../shared/store/state/product.state';
import { Observable, Subject, debounceTime, distinctUntilChanged, finalize, map, mergeMap, of, switchMap, take, takeUntil } from 'rxjs';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, VariationCombination } from '../../../shared/interface/product.interface';
import { MediaConfig, mediaConfig } from '../../../shared/data/media-config';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CreateProduct, UpdateProduct } from '../../../shared/store/action/product.action';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldsComponent } from '../../../shared/components/ui/form-fields/form-fields.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { NavService } from 'src/app/shared/services/nav.service';
import { Sidebar } from 'src/app/shared/interface/sidebar.interface';
import { RouterModule } from '@angular/router';
import { SavingsState } from 'src/app/shared/store/state/savings.state';
import { CreateSavings, EditSavings, GetFilteredMembers, SetLoadingState, UpdateSavings } from 'src/app/shared/store/action/savings.action';
import { appConfig } from 'src/app/core/config/config';
import { NotificationService } from 'src/app/shared/services/notification.service';

function convertToNgbDate(date: NgbDateStruct): NgbDate {
  return new NgbDate(date.year, date.month, date.day);
}

@Component({
    selector: 'app-batch-form-shares',
    imports: [CommonModule, TranslateModule, FormsModule,
      ReactiveFormsModule, NgbModule, Select2Module, RouterModule,
      NgxEditorModule, FormFieldsComponent, ButtonComponent,
    ],
    templateUrl: './batch-form-shares.component.html',
    styleUrl: './batch-form-shares.component.scss'
})
export class BatchFormSharesComponent {
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

  member$: Observable<any> = inject(Store).select(SavingsState.member) as Observable<any>;

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
  public templateGenerated = false;
  public templateData: any;
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
      label: "Feburary"
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

  public deductionSources: Select2Data = [{
    value: '1',
    label: 'Cash',
  },{
    value: '2',
    label: 'Other',
  }];

  public isBrowser: boolean;
  
  
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
      shares_type: new FormControl('Savings', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      month: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      transferred_from: new FormControl('', [Validators.required]),
      narration: new FormControl(''),
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
      this.selectedMember = member;
      this.text = member.title; // Display the name in the input
      this.form.controls['user_id'].setValue(member.id); // Set the ID as form value
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
            if (response) {
              this.items = response.map((member: any) => ({
                id: member.value,
                title: member.label,
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
    if(this.isBrowser) {
      this.editor = new Editor();
    }
    this.route.params
    .pipe(
      switchMap(params => {
        if(!params['id']) return of();
          return this.store
          .dispatch(new EditSavings(params['id']))
          .pipe(mergeMap(() => this.store.select(SavingsState.selectedSavings)))
        }
      ),
      takeUntil(this.destroy$)
    )
    .subscribe(saving => {
      if(saving){
        this.id = saving.id;
        let patchData: any = {
          user_id: saving.user_id,
          savings_type: saving.savings_type,
          amount: saving.amount,
          month: saving.month,
          year: saving.year,
          narration: saving?.narration,
          transferred_from: saving?.transferred_from.toString(),
        }
        
        if(saving.full_name){
          this.text = saving?.full_name
        }
        this.form.patchValue(patchData);
      }
    });
  }

  

  submit() {
    this.form.markAllAsTouched();
    if(!this.form.valid){
      return
    }

    let payload = {...this.form.value};
    this.store.dispatch(new SetLoadingState(true));
    let action: any;

    if(this.type == 'edit' && this.id) {
      action = new UpdateSavings(payload, this.id);
    }

    if(this.type === 'create'){
      action = new CreateSavings(payload)
    }

    this.store.dispatch(action).pipe(
      finalize(() => this.store.dispatch(new SetLoadingState(false))),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        console.log("Response :::::", res);
        const response = res?.savings?.response;
        const successStatus = this.type === 'edit' ? appConfig.statusCode.ok : appConfig.statusCode.created;
        if (response?.status === successStatus) {
          const successMessage = this.type === 'edit' ? 'Savings updated successfully' : 'Savings created successfully';
          this.notificationService.showSuccess(response?.message || successMessage);
          this.router.navigateByUrl('/savings');
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

  generateTemplate() {
    // Generate template structure
    this.templateData = {
      headers: ['Member ID', 'Amount', 'Date', 'Reference'],
      sampleData: ['M001', '5000', '2023-01-15', 'REF123']
    };
    this.templateGenerated = true;
    this.notificationService.showSuccess('Template generated successfully');
  }
  
  downloadTemplate() {
    if (!this.templateGenerated) return;
    
    // Implement download logic using a service like FileSaver.js
    // Example:
    // const blob = new Blob([this.templateData], {type: 'application/vnd.ms-excel'});
    // saveAs(blob, 'savings_template.xlsx');
    this.notificationService.showSuccess('Template downloaded successfully');
  }
  
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check file size (900KB limit)
      if (file.size > 900 * 1024) {
        this.form.controls['file'].setErrors({'fileSize': true});
        return;
      }
      // Process the file
    }
  }
  

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.form.reset();
    this.renderer.removeClass(this.document.body, 'loader-none');
  }
}
