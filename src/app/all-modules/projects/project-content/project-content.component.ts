import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { DataTableDirective } from "angular-datatables";
import { MeetingService } from "src/app/_services/meeting.service";
import { UserService } from "src/app/_services/user.service";
import { SysUsers } from "src/app/_models/sysUsers";
import { MeetingType } from "src/app/_models/meeting";

declare const $: any;
@Component({
  selector: "app-project-content",
  templateUrl: "./project-content.component.html",
  styleUrls: ["./project-content.component.css"],
})
export class ProjectContentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public meetings = [];
  meetingTypes: MeetingType[] | undefined;
  users:SysUsers[] | undefined;
  isSubmit: boolean = false;

  public addMeetingForm: FormGroup;
  public editMeetingForm: FormGroup;
  public tempId: any;

  public rows = [];
  public srch = [];
  public dtTrigger: Subject<any> = new Subject();
  public statusValue;
  public pipe = new DatePipe("en-US");
  constructor(
    private meetingService: MeetingService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private usersService: UserService
  ) {}

  ngOnInit() {
    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
    $(document).ready(function () {
      $('[data-bs-toggle="tooltip"]').tooltip();
    });
    debugger;
    this.getMeetings();
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
  }


  getMeetings() {
    this.meetingService.getMeetings().subscribe(meeting =>{
      this.meetings = meeting;
      this.dtTrigger.next();
      this.rows = meeting;
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
     $("#datatable").DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
    this.getMeetings();
    this.getMeetingTypes();
    this.getUsers();
    this.addMeetingForm.reset();
    this.addMeetingForm.value.meetingtype = '';
    this.isSubmit = false;
    $("#create_project").modal("hide");
    this.toastr.success("Meeting added sucessfully...!", "Success");
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


  // for unsubscribe datatable
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
