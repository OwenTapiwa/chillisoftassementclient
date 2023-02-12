import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MeetingItem } from '../_models/meetingItem';


@Injectable({
  providedIn: 'root'
})

export class MeetingItemService {
  baseUrl = environment.apiUrl
  

  constructor(private http: HttpClient) { }

  getMeetingItems(id:string){
    return this.http.get<MeetingItem[]>(this.baseUrl + 'MeetingItems/meetingItems/meetingId?meetingId=' + id).pipe(
      map(meetingItems => {
        console.log(meetingItems);
        return meetingItems;
      })
    )
  }
  
  addMeetingItem(model: any) {
    return this.http.post(this.baseUrl + 'meetingItems/addMeetingItem', model);
  }

  editMeetingItem(model: any) {
    return this.http.post(this.baseUrl + 'meetingItems/editMeetingItem', model);
  }

  markComplete(model: any) {
    return this.http.post(this.baseUrl + 'meetingItemStatus/addMeetingItemStatus', model);
  }

}
