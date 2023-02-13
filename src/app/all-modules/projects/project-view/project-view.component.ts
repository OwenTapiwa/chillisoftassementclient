import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { map, mergeMap } from "rxjs/operators";
import { MeetingItem } from "src/app/_models/meetingItem";
import { SysUsers } from "src/app/_models/sysUsers";
import { MeetingItemService } from "src/app/_services/meetingItem.service";
import { UserService } from "src/app/_services/user.service";
import { Modal } from 'bootstrap';
import { Observable } from "rxjs";
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: "app-project-view",
  templateUrl: "./project-view.component.html",
  styleUrls: ["./project-view.component.css"],
})
export class ProjectViewComponent implements OnInit {
  meetingItems: MeetingItem[] | undefined;
  meetingId: any;
  users:SysUsers[] | undefined;
  addMeetingItemForm: FormGroup;
  editMeetingItemForm: FormGroup;
  meetingItems$: Observable<MeetingItem[]> | undefined;
  isSubmit: boolean = false;
  public pipe = new DatePipe("en-US");
  date: Date;
  meetingItemId: string = "";
  minDate: Date;
  maxDate: Date;


  constructor(
    private route: ActivatedRoute,
    private meetingItemService:MeetingItemService,
    private usersService:UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.pipe(map((id) => {this.meetingId = id.id; })).subscribe();
    this.getMeetingsItems(this.meetingId);
    console.log(this.meetingItems);
    this.getUsers();
    this.meetingItems$ = this.meetingItemService.getMeetingItems(this.meetingId);

     //Add Meeting form
     this.addMeetingItemForm = this.formBuilder.group({
      personResponsible: ["", [Validators.required]],
      action: ["", [Validators.required]],
      dueDate: ["", [Validators.required]],
      meetingItemId: [""],
    });
    //Edit Meeting form
    this.editMeetingItemForm = this.formBuilder.group({
      personResponsible: ["", [Validators.required]],
      action: ["", [Validators.required]],
      dueDate: ["", [Validators.required]],
      meetingItemId: [""],
    });

    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 186);

  }

  getMeetingsItems(meetingId:string) {
    this.meetingItemService.getMeetingItems(meetingId).subscribe(meetingItems =>{
      this.meetingItems = meetingItems;
      console.log(meetingItems)
    })
  }
  
  getUsers() {
    this.usersService.getUsers().subscribe(val =>
      {
        this.users = val;
      });
  }

  //Create New Meeting
  public addMeetingItem() {
    let dateDue = this.pipe.transform(
      this.addMeetingItemForm.value.dueDate,
      "yyyy-MM-dd"
    );
    let newMeetingItem = {
      meetingId: this.meetingId,
      personResponsible: this.addMeetingItemForm.value.personResponsible,
      action: this.addMeetingItemForm.value.action,
      dueDate: dateDue,
      meetingItemId: ''
    };
    this.isSubmit = true;
    if (this.addMeetingItemForm.invalid) {
      this.openModal();
      return;
    }
    this.meetingItemService.addMeetingItem(newMeetingItem).subscribe();
    this.addMeetingItemForm.reset();
    this.isSubmit = false;
    this.refreshForm();
    this.closeModal("Add");
    this.ref.detectChanges();
    this.alertWithSuccess("Meeting Item added sucessfully...!");
  }

   //edit New Meeting
   public editMeetingItem() {
    debugger;
    let dateDue = this.pipe.transform(
      this.editMeetingItemForm.value.dueDate,
      "yyyy-MM-dd"
    );
    let newMeetingItem = {
      meetingId: this.meetingId,
      personResponsible: this.editMeetingItemForm.value.personResponsible,
      action: this.editMeetingItemForm.value.action,
      dueDate: dateDue,
      meetingItemId: this.meetingItemId
    };
    this.isSubmit = true;
    if (this.editMeetingItemForm.invalid) {
      this.openEditModal(null);
      return;
    }
    this.meetingItemService.editMeetingItem(newMeetingItem).subscribe();
    this.ngOnInit();
    this.isSubmit = false;
    this.meetingItems$ = this.meetingItemService.getMeetingItems(this.meetingId);
    this.closeModal("Edit");
   
    this.alertWithSuccess("Meeting Item edited sucessfully...!");
  }

  //Mark Complete
  markComplete(meetingItemId:string)
  {
    debugger;
    let newMeetingItemStatus = {
      id: meetingItemId.toString(),
      status: 'Completed'
    };
    this.meetingItemService.markComplete(newMeetingItemStatus).subscribe();
    this.ngOnInit();
    this.isSubmit = false;
    this.meetingItems$ = this.meetingItemService.getMeetingItems(this.meetingId);
    this.closeModal("Edit");
    window.location.reload();
    this.alertWithSuccess("Meeting Item marked Completed...!");
  }

  openEditModal(meetingItem:MeetingItem){
    if(meetingItem !== null){
      this.editMeetingItemForm.controls.action.setValue(meetingItem.action);
      this.editMeetingItemForm.controls.personResponsible.setValue(meetingItem.personResponsible.emailAddress);
      this.parseDate(meetingItem.dueDate);
      this.editMeetingItemForm.controls.dueDate.setValue(this.date);
      this.meetingItemId = meetingItem.id.toString();
    }
    const element = document.getElementById('edit_item') as HTMLElement;
    const myModal = new Modal(element);
    myModal.show();

  }

  openModal(){
    const element = document.getElementById('add_item') as HTMLElement;
    const myModal = new Modal(element);
    myModal.show();
  }

  closeModal(type:string){
    if(type === "Add"){
      document.getElementById("ModalClose")?.click();
    } else{
      document.getElementById("ModalEditClose")?.click();
    }    
  }

  public parseDate(e) {
    this.date = new Date(e);
  }
  
  refreshForm(){
    this.ngOnInit();
    this.addMeetingItemForm.controls.action.setValue('');
    this.addMeetingItemForm.controls.personResponsible.setValue('');
    this.addMeetingItemForm.controls.dueDate.setValue('');
  }

  alertWithSuccess(message:string){
    Swal.fire(message, 'success')
  }

  alertWithError(message:string){
    Swal.fire(message, 'error')
  }

  

}
