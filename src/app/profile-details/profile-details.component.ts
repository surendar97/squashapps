import { Component, OnInit } from '@angular/core';
import { ProfileDetailsService } from './profile-details.service'
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import * as $ from 'jquery';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {
  userDetails: FormGroup;
  selectedLocation: string;

  constructor(private readonly formBuilder: FormBuilder, private readonly route: Router, private readonly service: ProfileDetailsService) { }

  selectedCountry: any;
  selectedIndex: number;
  userProfileTab = false;
  companyProfileTab = false;
  isMale = false;
  isFemale = false;
  isOthers = false;
  url: any = "https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png";
  isProfileValidation = false;
  countries: any;
  otp: number;s
  selectedState: string;
  state : [];
  selectedCountriesFlag: string;

  config = {
    allowNumbersOnly: false,
    length: 5,
    inputStyles: {
      'margin': '20px 10px'
    }
  }

  ngOnInit() {
    this.userDetails = this.formBuilder.group({
      fullName: ['', Validators.required],
      gender: [''],
      country: [''],
      state: [''],
      teleCode: [''],
      mobileNumber: ['', Validators.required],
      companyName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      jobTitle: ['', Validators.required],
      experience: ['', Validators.required],
      termsAndCondition: [false, Validators.requiredTrue]
    });
    this.getCountries();
    this.selectGender('male');
  } 
  

  setTelephoneCode(county) {
    this.selectedCountry = county;
    this.userProfileControl['country'].setValue(this.selectedCountry.name)
    this.userProfileControl['teleCode'].setValue('+' + this.selectedCountry.callingCodes)
    this.selectedCountriesFlag = this.selectedCountry.flag;
    this.fiterStates ();
  }  

  fiterStates (){
    for (let i =0; i< this.states.length;i++) {
      if( this.selectedCountry.name === this.states[i].country){
          this.state = this.states[i].states;
          this.selectedState = this.states[0];
          return;
      }
    }    
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.fieldValidation();
    this.selectedIndex = tabChangeEvent.index;
  }

  moveToSelectedTab(tab: number) {
    this.fieldValidation();
    this.selectedIndex = tab;
  }

  fileUpload() {
    $('input[type=file]').trigger('click');
  }

  selectGender(gender) {
    switch (gender) {
      case 'others':
        this.isMale = false;
        this.isFemale = false;
        this.isOthers = true;
        this.userProfileControl['gender'].setValue('others');
        break;
      case 'female':
        this.isMale = false;
        this.isFemale = true;
        this.isOthers = false;
        this.userProfileControl['gender'].setValue('female');
        break;
      default:
        this.isMale = true;
        this.isFemale = false;
        this.isOthers = false;
        this.userProfileControl['gender'].setValue('male');
    }
  }

  fieldValidation() {
    if (!this.userProfileControl.fullName.errors &&
      !this.userProfileControl.mobileNumber.errors) {
      this.userProfileTab = true;
    }
    if (this.userDetails.valid) {
      this.companyProfileTab = true;
    }
  }  
 
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = event.target.result;
      }
    }
  }

  onOtpChange (event) {
    this.otp = event;
  }

  get userProfileControl() {
    return this.userDetails.controls;
  }   

  getCountries() {
    this.service.getCountries().subscribe(res => {
      this.countries = res;
      this.getStates();      
    })
  }

  states : any[] = [];

  getStates() {
    this.service.getStates().subscribe(res => {
      this.states = res.countries;
      this.setTelephoneCode(this.countries[0]);
    })
  }

  saveData () {
    this.fieldValidation ();
    localStorage.setItem('value', JSON.stringify(this.userDetails.value));
    this.route.navigate(['dashboard']); 
  }
  
  resend() {

  } 
}
