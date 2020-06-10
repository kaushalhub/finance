import { Beneficiary } from './beneficiary.model';
import { DocumentModel } from './documentModel.model';
import { Payment } from './payment.model';

export class User {
    id: string = "";
    uid: string = "";
    type: number = 2;
    approvedAt: string = "";
    createdAt: string = "";
    firstName: string = "";
    lastName: string = "";
    policyId: string = "";
    stepCompleted: number = 0;
    profile: {
        middleName: string;
        email: string;
        phone: string;
        gender: string;
        height: string;
        weight: number;
        dateOfBirth: string;
        useNicotine: string;
        address: string;
        apt: string;
        zip: string;
        city: string;
        state: string;
        image: string;
    };
    answers: {
        declinedLifeInsurance: string;
        criminalHistory: string;
        currentlyDisabled: string;
        groupLifeInsurance: string;
        complexMedical: string;
        filledBankcruptcy: string;
        accountOwnerSame: string;
    };
    termLength: string = "";
    coverageAmount: number = 0;
    monthly: number = 0;
    startDate: string = "";
    nextPaymentDate: string = "";
    beneficiaries: Beneficiary[] = [];
    billingInfo: {
        bankImage?: string;
        bankName: string;
        routingNumber: string;
        accountNumber: string;
        accountNumberEnding: string;
        accountType: string;
    };
    documents: DocumentModel[] = [];
    payments: string[] = [];
}