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
  isMale = false;
  isFemale = false;
  isOthers = false;
  isOtpValidation = false;  
  countries: any;
  countryStates: any[] = [];
  states: any[] = [];
  otp: any;
  selectedState: string;
  selectedCountriesFlag: string;
  submitted = false;
  emailRegEx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  url: any = "https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png";
  
  config = {
    allowNumbersOnly: false,
    length: 5,
    inputStyles: {
      'margin': '20px 10px'
    }
  }

  ngOnInit() {
    this.userDetails = this.formBuilder.group({
      personalDetail: this.formBuilder.group({
        fullName: ['', Validators.required],
        gender: [''],
        country: [''],
        states: [''],
        teleCode: [''],
        mobileNumber: ['', [Validators.required, Validators.minLength(10)]]
      }),
      companyDetail: this.formBuilder.group({
        companyName: ['', Validators.required],
        emailId: ['', [Validators.required, Validators.pattern(this.emailRegEx)]],
        jobTitle: ['', Validators.required],
        experience: ['', Validators.required],
        termsAndCondition: [false, Validators.requiredTrue]
      })
    });
    this.getCountries();
    this.selectGender('male');
  }

  get personalDetailControles() {
    return (this.userDetails.get('personalDetail') as FormGroup).controls;
  }
  get companyDetailControles() {
    return (this.userDetails.get('companyDetail') as FormGroup).controls;
  }
  get personalDetail() {
    return this.userDetails.get('personalDetail');
  }
  get companyDetail() {
    return this.userDetails.get('companyDetail');
  }

  setTelephoneCode(county) {
    this.selectedCountry = county;
    this.personalDetailControles['country'].setValue(this.selectedCountry.name)
    this.personalDetailControles['teleCode'].setValue('+' + this.selectedCountry.callingCodes)
    this.selectedCountriesFlag = this.selectedCountry.flag;
    this.fiterStates();
  }

  fiterStates() {
    for (let i = 0; i < this.countryStates.length; i++) {
      if (this.selectedCountry.name === this.countryStates[i].country) {
        this.states = this.countryStates[i].states;
        this.selectedState = this.states[0];
        return;
      }
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
  }

  moveToSelectedTab(tab: number) {
    this.selectedIndex = tab;
  }

  selectGender(gender) {
    switch (gender) {
      case 'others':
        this.isMale = false;
        this.isFemale = false;
        this.isOthers = true;
        this.personalDetailControles['gender'].setValue('others');
        break;
      case 'female':
        this.isMale = false;
        this.isFemale = true;
        this.isOthers = false;
        this.personalDetailControles['gender'].setValue('female');
        break;
      default:
        this.isMale = true;
        this.isFemale = false;
        this.isOthers = false;
        this.personalDetailControles['gender'].setValue('male');
    }
  }

  fileUpload() {
    $('input[type=file]').trigger('click');
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

  sendOtp (){
    this.submitted = true;
  }

  onOtpChange(event) {
    this.otp = event;
    if (this.otp.length === 5) {
      this.isOtpValidation = true;
    } else {
      this.isOtpValidation = false;
    }
  } 

  getCountries() {
    this.service.getCountries().subscribe(res => {
      this.countries = res;
      this.getStates();
    })
  }

  getStates() {
    this.service.getStates().subscribe(res => {
      this.countryStates = res.countries;
      this.setTelephoneCode(this.countries[0]);
    })
  }

  saveData() {
    if (this.isOtpValidation) {
      localStorage.setItem('value', JSON.stringify(this.userDetails.value));
      const data = localStorage.getItem('value');
      console.log(data);
      this.route.navigate(['dashboard']);
    }
  }

  personalDetailValidation() {
    if (this.personalDetail.valid) {
      this.moveToSelectedTab(1);
    }
  }

  companyDetailValidation() {
    if (this.companyDetail.valid) {
      this.moveToSelectedTab(2);
    }
  }

}
