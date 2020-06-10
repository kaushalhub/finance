import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocusignService {
  paymentAll = 'https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=4440803e-3a74-4ac1-a2d8-652c20750014&env=na1&acct=5cd1a81a-8c33-4367-9375-fd5449443263';
  paymentAlaska = 'https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=700d81fe-7a60-4cb6-93c7-78d8256429b9&env=na1&acct=5cd1a81a-8c33-4367-9375-fd5449443263';
  paymentConnecticut = 'https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=fa1747db-4ad8-4f07-ae02-f93e50518c31&env=na1&acct=5cd1a81a-8c33-4367-9375-fd5449443263';
  paymentKansas = 'https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=e54d397b-803b-4948-b7d2-d9fe5e742c93&env=na1&acct=5cd1a81a-8c33-4367-9375-fd5449443263';

  editionAll = 'https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=55ace7fc-38b5-46d3-afc4-8b8fb925df13&env=na1&acct=5cd1a81a-8c33-4367-9375-fd5449443263'
  editionConneticut = 'https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=25f8602b-2e84-462c-89b0-b429c5937538&env=na1&acct=5cd1a81a-8c33-4367-9375-fd5449443263'

  beneficiaryAll = 'https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=44349103-d71b-452a-8fcf-6c513385aeb3&env=na1&acct=5cd1a81a-8c33-4367-9375-fd5449443263'
  beneficiaryConneticut = 'https://www.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=13b09b9e-3bf2-4c3f-a3e4-12ada0787443&env=na1&acct=5cd1a81a-8c33-4367-9375-fd5449443263'

  public USA_states = [
    {
      name: 'State',
      abbreviation: 'State',
    },
    {
      name: "Alabama",
      abbreviation: "AL"
    },
    {
      name: "Alaska",
      abbreviation: "AK"
    },
    {
      name: "American Samoa",
      abbreviation: "AS"
    },
    {
      name: "Arizona",
      abbreviation: "AZ"
    },
    {
      name: "Arkansas",
      abbreviation: "AR"
    },
    {
      name: "California",
      abbreviation: "CA"
    },
    {
      name: "Colorado",
      abbreviation: "CO"
    },
    {
      name: "Connecticut",
      abbreviation: "CT"
    },
    {
      name: "Delaware",
      abbreviation: "DE"
    },
    {
      name: "District Of Columbia",
      abbreviation: "DC"
    },
    {
      name: "Federated States Of Micronesia",
      abbreviation: "FM"
    },
    {
      name: "Florida",
      abbreviation: "FL"
    },
    {
      name: "Georgia",
      abbreviation: "GA"
    },
    {
      name: "Guam",
      abbreviation: "GU"
    },
    {
      name: "Hawaii",
      abbreviation: "HI"
    },
    {
      name: "Idaho",
      abbreviation: "ID"
    },
    {
      name: "Illinois",
      abbreviation: "IL"
    },
    {
      name: "Indiana",
      abbreviation: "IN"
    },
    {
      name: "Iowa",
      abbreviation: "IA"
    },
    {
      name: "Kansas",
      abbreviation: "KS"
    },
    {
      name: "Kentucky",
      abbreviation: "KY"
    },
    {
      name: "Louisiana",
      abbreviation: "LA"
    },
    {
      name: "Maine",
      abbreviation: "ME"
    },
    {
      name: "Marshall Islands",
      abbreviation: "MH"
    },
    {
      name: "Maryland",
      abbreviation: "MD"
    },
    {
      name: "Massachusetts",
      abbreviation: "MA"
    },
    {
      name: "Michigan",
      abbreviation: "MI"
    },
    {
      name: "Minnesota",
      abbreviation: "MN"
    },
    {
      name: "Mississippi",
      abbreviation: "MS"
    },
    {
      name: "Missouri",
      abbreviation: "MO"
    },
    {
      name: "Montana",
      abbreviation: "MT"
    },
    {
      name: "Nebraska",
      abbreviation: "NE"
    },
    {
      name: "Nevada",
      abbreviation: "NV"
    },
    {
      name: "New Hampshire",
      abbreviation: "NH"
    },
    {
      name: "New Jersey",
      abbreviation: "NJ"
    },
    {
      name: "New Mexico",
      abbreviation: "NM"
    },
    {
      name: "New York",
      abbreviation: "NY"
    },
    {
      name: "North Carolina",
      abbreviation: "NC"
    },
    {
      name: "North Dakota",
      abbreviation: "ND"
    },
    {
      name: "Northern Mariana Islands",
      abbreviation: "MP"
    },
    {
      name: "Ohio",
      abbreviation: "OH"
    },
    {
      name: "Oklahoma",
      abbreviation: "OK"
    },
    {
      name: "Oregon",
      abbreviation: "OR"
    },
    {
      name: "Palau",
      abbreviation: "PW"
    },
    {
      name: "Pennsylvania",
      abbreviation: "PA"
    },
    {
      name: "Puerto Rico",
      abbreviation: "PR"
    },
    {
      name: "Rhode Island",
      abbreviation: "RI"
    },
    {
      name: "South Carolina",
      abbreviation: "SC"
    },
    {
      name: "South Dakota",
      abbreviation: "SD"
    },
    {
      name: "Tennessee",
      abbreviation: "TN"
    },
    {
      name: "Texas",
      abbreviation: "TX"
    },
    {
      name: "Utah",
      abbreviation: "UT"
    },
    {
      name: "Vermont",
      abbreviation: "VT"
    },
    {
      name: "Virgin Islands",
      abbreviation: "VI"
    },
    {
      name: "Virginia",
      abbreviation: "VA"
    },
    {
      name: "Washington",
      abbreviation: "WA"
    },
    {
      name: "West Virginia",
      abbreviation: "WV"
    },
    {
      name: "Wisconsin",
      abbreviation: "WI"
    },
    {
      name: "Wyoming",
      abbreviation: "WY"
    }
  ];

  paymentInfo = [
    // CLIENT
    "&client_UserName=",
    "&client_Email=",

    // INFORMATION NEEDED
    "&insured_full_name=",
    "&payment_frequency=",
    "&account_owner_full_name=",
    "&street_address=",
    "&state_address=",
    "&bank_name=",
    "&bank_number=",
    "&account_number=",
    "&account_type=",

    // DATES
    "&date_1=",
    "&date_2="
  ]

  editionInfo = [
    // CLIENT
    "&client_UserName=",
    "&client_Email=",

    // NEEDED
    "&policy_number=",    // Full name
    "&insured_name=",     // Full name
    "&policyowner_name=", // Full name

    // NAME CHANGE
    "&name_change=",      // Checked
    "&ownership_change=", // Insured
    "&before_name=",      // Name before
    "&after_name=",       // Name after

    // ADDRESS CHANGE 
    "&address_change=",   // Checked
    "&change_mailing=",   // Checked
    "&full_address=",     // Street, Apt, Zip, City, State
    "&phone_change=",     // Phone

    // DATES
    "&date_1=",
    "&date_2="
  ]

  // Beneficiary Start Format
  beneficiarytStart = [
    // CLIENT
    "&client_UserName=",
    "&client_Email=",

    // NEEDED
    "&policy_number=",
    "&insured_name=",
    "&policyowner_name="
  ]

  // Beneficiary All States
  beneficiaryAllBeneficiary = [
    "&primary_name_",
    "&primary_address_",       	// Required we don’t have it
    "&primary_percentage_",
    "&primary_relationship_",
    "&primary_security_"	      // Required and we don’t have it
  ]

  // Contingent All States
  beneficiaryAllContingent = [
    "&contingent_name_",
    "&contingent_address_",
    "&contingent_percentage_",
    "&contingent_relationship_",
    "&contingent_security_"
  ]

  // Footer All States
  beneficiaryAllFooter = [
    "&time_clause=",
    "&date_1=",
    "&date_2=",
    "&date_3="
  ]

  // Ownership changed Conneticut
  beneficiaryConneticutOwnership = [
    "&primary_name_",		        // Required
    "&primary_address_",        // Required we don’t have it
    "&primary_age_",		        // 
    "&primary_class_",		      // Primary or Contingent
    "&primary_relationship_", 	// Required we have it
    "&primary_security_",		    // Required and we don’t have it
  ]

  // Beneficiary Conneticut
  beneficiaryConneticutBeneficiary = [
    "&bene_name_",		          // Required
    "&bene_address_",       	  // Required we don’t have it
    "&bene_class_",       		  // Required we don’t have it
    "&bene_percentage_",	      // Optional and we have it
    "&bene_relationship_", 	  // Required we have it
    "&bene_security_",		      // Required and we don’t have it
  ]

  // Footer Conneticut
  beneficiaryConneticutFooter = [
    "&date_1=",
    "&date_2=",
    "&date_3=",
    "&date_4="
  ]

  constructor() { }

  getPaymentsFormURLByState(state: string) {
    if (state === 'AK') return this.paymentAlaska;
    if (state === 'CT') return this.paymentConnecticut;
    if (state === 'KS') return this.paymentKansas;
    else return this.paymentAll;
  }

  getBeneficiaryFormURLByState(state: string) {
    if (state === 'CT') return this.beneficiaryConneticut;
    else return this.beneficiaryAll;
  }

  getEditionFormURLByState(state: string) {
    if (state === 'CT') return this.editionConneticut;
    else return this.editionAll;
  }

  getBeneficiaryMockByState(state: string) {
    if (state === 'CT') return this.beneficiaryConneticutBeneficiary;
    else return this.beneficiaryAllBeneficiary;
  }

  getFooterMockByState(state: string) {
    if (state === 'CT') return this.beneficiaryConneticutFooter;
    else return this.beneficiaryAllFooter;
  }

  createPaymentsForm(information: any, state: string) {
    let paymentInfoMock = this.paymentInfo;
    let url = this.getPaymentsFormURLByState(state);
    for (let index = 0; index < paymentInfoMock.length; index++) {
      paymentInfoMock[index] += information[index];
      url += paymentInfoMock[index]
    };
    this.paymentInfo = [
      "&client_UserName=",
      "&client_Email=",
      "&insured_full_name=",
      "&payment_frequency=",
      "&account_owner_full_name=",
      "&street_address=",
      "&state_address=",
      "&bank_name=",
      "&bank_number=",
      "&account_number=",
      "&account_type=",
      "&date_1=",
      "&date_2="
    ];
    url = encodeURI(url);
    return url;
  }


  createChangesForm(information: any, state: string) {
    var editionInfoMock = this.editionInfo;
    let url = this.getEditionFormURLByState(state);
    for (let index = 0; index < editionInfoMock.length; index++) {
      editionInfoMock[index] += information[index];
      url += editionInfoMock[index]
    };
    this.editionInfo = [
      "&client_UserName=",
      "&client_Email=",
      "&policy_number=",
      "&insured_name=",
      "&policyowner_name=",
      "&name_change=",
      "&ownership_change=",
      "&before_name=",
      "&after_name=",
      "&address_change=",
      "&change_mailing=",
      "&full_address=",
      "&phone_change=",
      "&date_1=",
      "&date_2="
    ];
    url = encodeURI(url);
    return url;
  }

  createBeneficiaryForm(header: any, beneficiaries: any, time: string, state: string) {
    let url = this.getBeneficiaryFormURLByState(state);
    var headerMock = this.beneficiarytStart;
    var beneficiaryMock = this.getBeneficiaryMockByState(state);
    var footerMock = this.getFooterMockByState(state);

    for (let index = 0; index < headerMock.length; index++) {
      headerMock[index] += header[index];
      url += headerMock[index]
    };

    if (state === 'CT') {
      for (let index = 0; index < beneficiaries.length; index++) {
        beneficiaryMock[0] += `${(index + 1).toString()}=${beneficiaries[index].firstName} ${beneficiaries[index].lastName}`;
        beneficiaryMock[1] += `${(index + 1).toString()}=`;
        beneficiaryMock[2] += `${(index + 1).toString()}=`;
        beneficiaryMock[3] += `${(index + 1).toString()}=${beneficiaries[index].percentage.toString()}`;
        beneficiaryMock[4] += `${(index + 1).toString()}=${beneficiaries[index].relation}`;
        beneficiaryMock[5] += `${(index + 1).toString()}=`;
        url += `${beneficiaryMock[0]}${beneficiaryMock[1]}${beneficiaryMock[2]}${beneficiaryMock[3]}${beneficiaryMock[4]}${beneficiaryMock[5]}`;
        beneficiaryMock = [
          "&bene_name_",
          "&bene_address_",
          "&bene_class_",
          "&bene_percentage_",
          "&bene_relationship_",
          "&bene_security_"
        ];
      };
      this.beneficiaryAllBeneficiary = [
        "&bene_name_",
        "&bene_address_",
        "&bene_class_",
        "&bene_percentage_",
        "&bene_relationship_",
        "&bene_security_"
      ];
      for (let index = 0; index < footerMock.length; index++) {
        footerMock[index] += time;
        url += footerMock[index]
      };
      this.beneficiaryConneticutFooter = [
        "&date_1=",
        "&date_2=",
        "&date_3=",
        "&date_4="
      ];
    } else {
      for (let index = 0; index < beneficiaries.length; index++) {
        beneficiaryMock[0] += `${(index + 1).toString()}=${beneficiaries[index].firstName} ${beneficiaries[index].lastName}`;
        beneficiaryMock[1] += `${(index + 1).toString()}=`;
        beneficiaryMock[2] += `${(index + 1).toString()}=${beneficiaries[index].percentage.toString()}`;
        beneficiaryMock[3] += `${(index + 1).toString()}=${beneficiaries[index].relation}`;
        beneficiaryMock[4] += `${(index + 1).toString()}=`;
        url += `${beneficiaryMock[0]}${beneficiaryMock[1]}${beneficiaryMock[2]}${beneficiaryMock[3]}${beneficiaryMock[4]}`;
        beneficiaryMock = [
          "&primary_name_",
          "&primary_address_",
          "&primary_percentage_",
          "&primary_relationship_",
          "&primary_security_"
        ];
      };
      this.beneficiaryAllBeneficiary = [
        "&primary_name_",
        "&primary_address_",
        "&primary_percentage_",
        "&primary_relationship_",
        "&primary_security_"
      ];
      for (let index = 0; index < footerMock.length; index++) {
        footerMock[index] += time;
        url += footerMock[index]
      };
      this.beneficiaryAllFooter = [
        "&date_1=",
        "&date_2=",
        "&date_3="
      ];
    }

    this.beneficiarytStart = [
      "&client_UserName=",
      "&client_Email=",
      "&policy_number=",
      "&insured_name=",
      "&policyowner_name="
    ];

    url = encodeURI(url);
    return url;
  }

}
