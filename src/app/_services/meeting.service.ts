import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Meeting } from '../_models/meeting';
import { MeetingType } from '../_models/meetingType';


@Injectable({
  providedIn: 'root'
})

export class MeetingService {
  baseUrl = environment.apiUrl
  

  constructor(private http: HttpClient) { }

  getMeetings(){
    return this.http.get<Meeting[]>(this.baseUrl + 'meeting').pipe(
      map(meeting => {
        return meeting;
      })
    )
  }

  getMeetingTypes(){
    return this.http.get<MeetingType[]>(this.baseUrl + 'meetingtype').pipe(
      map(meetingType => {
        return meetingType;
      })
    )
  }
  addMeeting(model: any) {
    return this.http.post(this.baseUrl + 'meeting/addMeeting', model);
  }

}
