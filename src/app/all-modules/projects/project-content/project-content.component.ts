import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { DataTableDirective } from "angular-datatables";
import { MeetingService } from "src/app/_services/meeting.service";
import { UserService } from "src/app/_services/user.service";
import { SysUsers } from "src/app/_models/sysUsers";
import { Meeting, MeetingType } from "src/app/_models/meeting";
import Swal from 'sweetalert2/dist/sweetalert2.js';


declare const $: any;
@Component({
  selector: "app-project-content",
  templateUrl: "./project-content.component.html",
  styleUrls: ["./project-content.component.css"],
})
export class ProjectContentComponent implements OnInit, OnDestroy {
  meetingTypes: MeetingType[] | undefined;
  users:SysUsers[] | undefined;
  isSubmit: boolean = false;
  meetings$: Observable<Meeting[]> | undefined;
  meetings: Meeting[] | undefined;
  minDate: Date;
  maxDate: Date;

  addMeetingForm: FormGroup;
  private editMeetingForm: FormGroup;
  public pipe = new DatePipe("en-US");
  
  constructor(
    private meetingService: MeetingService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private usersService: UserService,
    private ref: ChangeDetectorRef

  ) {}

  ngOnInit() {
    // for data table configuration
   
    this.meetings$ = this.meetingService.getMeetings();
    this.getMeetingTypes();
    this.getUsers();
    
    //Add Meeting form
    this.addMeetingForm = this.formBuilder.group({
      meetingType: ["", [Validators.required]],
      dateHeld: ["", [Validators.required]],
      minutesTaker: ["", [Validators.required]],
      meetingId: [""],
    });

    //Edit Meeting Form
    this.editMeetingForm = this.formBuilder.group({
      meetingType: ["", [Validators.required]],
      dateHeld: ["", [Validators.required]],
      minutesTaker: ["", [Validators.required]],
      meetingId: [""],
    });

    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 30);
    this.maxDate.setDate(this.maxDate.getDate());
  }


  getMeetings() {
    this.meetingService.getMeetings().subscribe(meeting =>{
      this.meetings = meeting;
    })
    
  }
  getMeetingTypes() {
    this.meetingService.getMeetingTypes().subscribe(val =>
      {
        this.meetingTypes = val;
      });
  }

  getUsers() {
    this.usersService.getUsers().subscribe(val =>
      {
        this.users = val;
      });
  }

  //Create New Meeting
  public addMeeting() {
    debugger;
    let heldDate = this.pipe.transform(
      this.addMeetingForm.value.dateHeld,
      "yyyy-MM-dd"
    );
    let newMeeting = {
      meetingType: this.addMeetingForm.value.meetingType,
      dateHeld: heldDate,
      minutesTaker: this.addMeetingForm.value.minutesTaker,
      meetingId: '',
    };
    this.isSubmit = true;
    if (this.addMeetingForm.invalid) {
      $("#create_project").modal("show");
      return;
    }
    this.meetingService.addMeeting(newMeeting).subscribe();
    $("#create_project").modal("hide");
    this.ref.detectChanges();
    this.addMeetingForm.reset();
    this.addMeetingForm.value.meetingtype = '';
    this.isSubmit = false;
    window.location.reload();
    this.alertWithSuccess("Meeting added sucessfully...!");
    
  }

  

  //Edit Meeting
  // editProject(id: any) {
  //   this.tempId = id;
  //   const index = this.meetings.findIndex((item) => {
  //     return item.id === id;
  //   });
  //   let toSetValues = this.meetings[index];
  //   this.editProjectForm.setValue({
  //     editProjectName: toSetValues.name,
  //     editProjectDescription: toSetValues.description,
  //     editProjectEndDate: toSetValues.endDate,
  //     editProjectStartDate: toSetValues.startDate,
  //     editProjectPriority: toSetValues.priority,
  //     editaddTeamMembers: toSetValues.teamMember,
  //     editProjectId: toSetValues.projectId,
  //     editId: toSetValues.id,
  //   });
  // }

 
  alertWithSuccess(message:string){
    Swal.fire(message, 'success')
  }

  alertWithError(message:string){
    Swal.fire(message, 'error')
  }

  // for unsubscribe datatable
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }

  
}
