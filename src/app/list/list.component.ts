import { Component, OnInit,ChangeDetectorRef,Inject  } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../assets/constants';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations:[
    trigger('load', [
      transition(':enter', [
        style({ opacity: 0,
          transform: 'skewX(-10deg)',
          flex:' 0 0 20%',
          marginBottom: '2%',
          border: 'solid',
          borderColor: 'lightgray',
          borderWidth: '1px',
          marginRight:'100px'
        }),
        animate('800ms', style({ opacity: 1 ,transform: 'skewX(0deg)',marginRight:'0px'})),
      ])
    ]),
  ]
})
export class ListComponent implements OnInit {
  load:boolean=true;
  articles:Array<Article>;
  updateImage:number;
  updateDetails:number;
  newArticle:boolean;
  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('always');
  constructor(@Inject(DOCUMENT) private document: Document,private ref: ChangeDetectorRef,fb: FormBuilder,private http: HttpClient) {
    this.updateImage=-1;
    this.updateDetails=-1;
    this.newArticle=false;
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
    console.log(this.floatLabelControl.value)
    this.articles=[]
    this.ref.markForCheck();
   }
   toggleNew() {
     this.newArticle=!this.newArticle;
     this.ref.detectChanges()
   }
   setupdateImage(i:number){
     this.updateImage=i;
     this.ref.detectChanges()
   }
   setupdateDetails(i:number){
    this.updateDetails=i;
    this.ref.detectChanges()
  }
  async updateImageValue(){
    if(this.updateImage==-1)
    return
    let v=(<HTMLInputElement>this.document.getElementById("updateImage")).value;
    if(!v||v=="")
    return
    this.articles[this.updateImage].pic=v;
    try{
      await new Promise((resolve,reject)=>{
        this.http.post<any>(Constants.BASEURL+"/update",{
          update:"image",
          image:this.articles[this.updateImage].pic,
          id:this.articles[this.updateImage].id
        }).subscribe((data)=>{
          resolve(data)
        })
      })
    }catch(e){
      console.log(e)
    }
    
    this.updateImage=-1
    this.ref.detectChanges()
  }
  async updateDetailsValue(){
    if(this.updateDetails==-1)
    return
    let v=(<HTMLInputElement>this.document.getElementById("updateDetails")).value;
    if(!v||v=="")
    return
    this.articles[this.updateDetails].details=v;
    try{
      await new Promise((resolve,reject)=>{
        this.http.post<any>(Constants.BASEURL+"/update",{
          update:"details",
          details:this.articles[this.updateDetails].details,
          id:this.articles[this.updateDetails].id
        }).subscribe((data)=>{
          resolve(data)
        })
      })
    }catch(e){
      console.log(e)
    }
    this.updateDetails=-1
    this.ref.detectChanges()
 }
 async add(){
  if((!(<HTMLInputElement>this.document.getElementById("details")).checkValidity()||!(<HTMLInputElement>this.document.getElementById("url")).checkValidity()))
  return
  let v1=(<HTMLInputElement>this.document.getElementById("details")).value;
  let v2=(<HTMLInputElement>this.document.getElementById("url")).value;
  try{
    await new Promise((resolve,reject)=>{
      this.http.post<any>(Constants.BASEURL+"/add",{
        image:v2,
        details:v1
      }).subscribe((data)=>{
        if(data.err)
        return
        let art=new Article(data.data.insertId,v2,v1);
        this.articles.push(art)
        resolve(data)
      })
    })
  }catch(e){
    console.log(e)
  }
  this.newArticle=false;
  this.ref.detectChanges()
 }

  async ngOnInit() {
    try{
      let response=await fetch(Constants.BASEURL+"/articles").then(r=> r.json())
      if(response.err)
      {
        console.log(response.msg)
        return
      }
      this.articles=response.data.map(art=>{
        return new Article(art.id,art.image,art.details)
      })
      this.ref.detectChanges()
    }catch(e){
      console.log(e)
    }
  }

}
class Article{
  pic:string;
  details:string;
  id:number;
  constructor(id:number,p:string,d:string) {
    this.id=id
    this.pic=p;
    this.details=d
   }
}
