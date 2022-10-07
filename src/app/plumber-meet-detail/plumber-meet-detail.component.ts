import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorage } from '../localstorage.service';
import { PearlService } from '../pearl.service';
import { Location } from '@angular/common'
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-plumber-meet-detail',
  templateUrl: './plumber-meet-detail.component.html',
  styleUrls: ['./plumber-meet-detail.component.scss']
})
export class PlumberMeetDetailComponent implements OnInit {

  plumber_meet_id: any = '';
  loader: any;
  plumber_meet_detail: any = {};
  participents_list:any = [];
  plumber_meet_images:any=[];
  plumber_meet_videos:any=[];
  currentPlayingVideo: HTMLVideoElement;
  active_tab:any = 'Image';
  add_plumber_meet_images:any=[];

  constructor(public route: ActivatedRoute,public dialog: MatDialog,public location: Location,public serve: PearlService,public session:LocalStorage) {

    this.route.params.subscribe( params => {
      console.log(params);
      this.plumber_meet_id = params.id;
      console.log(this.plumber_meet_id);
      this.get_plumber_meet_data();

    });

  }

  ngOnInit() {
  }

  back(): void {
    console.log("location back method calls");
    console.log(this.location);
    this.location.back()
  }

  get_plumber_meet_data(){

    this.loader = 1;
    this.serve.fetchData({'meet_id': this.plumber_meet_id}, 'PlumberMeet/plumber_meet_detail_for_web').subscribe((result => {
      console.log(result);
      this.plumber_meet_detail = result['plumber_meet_detail'];
      this.participents_list = result['participents_list'];

      this.plumber_meet_images = result['plumber_image_file_listing'];
      this.plumber_meet_videos = result['plumber_video_file_listing'];
      this.add_plumber_meet_images = result['add_plumber_meet_images'];

      setTimeout (() => {
        this.loader = '';

      }, 700);
    }));

  }

  imageModel(image){
    const dialogRef = this.dialog.open( StatusModalComponent, {
      data:{
        image,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');

    });
  }

  change_organiser_name(organiserName){
    console.log(organiserName);
    const dialogRef = this.dialog.open(StatusModalComponent,{
      width:'500px',
      data : {
        'plumber_meet_id' : this.plumber_meet_id,
         name : organiserName,
         from: "plumber_meet_detail_page"
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      console.log(result);
      this.get_plumber_meet_data();
      console.log('The dialog was closed');
    })
    
  }
  onPlayingVideo(event) {
    event.preventDefault();
    // play the first video that is chosen by the user
    if (this.currentPlayingVideo === undefined) {
      this.currentPlayingVideo = event.target;
      this.currentPlayingVideo.play();
    } else {
      // if the user plays a new video, pause the last one and play the new one
      if (event.target !== this.currentPlayingVideo) {
        this.currentPlayingVideo.pause();
        this.currentPlayingVideo = event.target;
        this.currentPlayingVideo.play();
      }
    }
  }

  change_plumber_meet_status(plumber_meet_id,plumber_meet_status){
    console.log("change_plumber_meet_status method calls");
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px', data: {
        'plumber_meet_id' : plumber_meet_id,
        'plumber_meet_status' : plumber_meet_status,
        'from' : 'plumber-meet-detail-page'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.get_plumber_meet_data();
    });

  }





}
