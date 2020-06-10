import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupFormToPDFService {
  public allData = [{}, {}, {}, {}, {}];

  constructor() { }

  public getDataFromForm(form, data) {
    form = form - 1;
    this.allData[form] = data;
  }

  public exportData() {
    return this.allData;
  }

  public exportLabels() {
    return [
      [
        'First name: ',
        'Last Name: ',
        'Email: ',
        'Phone: ',
        'Gender: ',
        'Height: ',
        'Weight: ',
        'Date of birth: ',
        'Use of tobacco/Nicotine products: ',
        'State: '
      ], [
        'Estimated monthly premium: ',
        'Coverage amount: ',
        'Years of coverage: '
      ], [
        'Have you been declined for life insurance by another carrier within the last 24 months?  Answer: ',
        'Do you have a history of criminal convictions?  Answer: ',
        'Are you currently disabled, or collecting SSDI benefits?  Answer: ',
        'Do you have life insurance or annuities outside of work or group life insurance?  Answer: '
      ], [
        'Do you have a complex medical or psychiatric history?  Answer: ',
        'Have you filed for bankruptcy within the last two years or have unresolved judgements/liens in excess of $50,000? Answer: '
      ], [
        'Is the bank account owner the same as the policy owner? Answer: ',
        'First name: ',
        'Middle name: ',
        'Last name: ',
        'Phone: ',
        'Email: ',
        'Street address: ',
        'Apt: ',
        'Zip code: ',
        'City: ',
        'State: ',
        'Bank name: ',
        'Routing number: ',
        'Account number: ',
        'Account type: ',
      ]
    ]
  }
}
