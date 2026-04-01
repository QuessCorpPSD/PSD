export interface Company {
  company_Id: number
  companyCode: string
  companyName: string
  displayName: string
  companyId:number
}

export interface Frequency {
  frequencey_Id: number
  financial_Year_Id: number
  pay_Period: string
}
export interface State {
  state_Id: number
  state_Name: string
}
export interface Payperiodclass {
  payfrequencyid: number
  paySequenceNo: string
  payPeriod: string
  displayName: string;
  start_At: string;
  end_At: string;

}

export interface Mapnameclass {
  mapNameId: number
  mapName: string
}
export interface citynameclass {
  city_Id: number
  city_Name: string
}

export interface InputTypeclass {
  inputId: number
  inputType: string
}

export interface Groupnameclass {
  siteCode: string
  siteName: string
}

export interface Cityclass {
  city_Id: string
  city_Name: string
}

export interface Paycodelist {
  paycode_Id: number
  paycode_Code: string
  description: string
}

export interface ChatMessage {
  message: string;
  type: string;
  givenBy: string;
  time: string;
}

export interface ChatWindow {
  req_No: string;
  messages: ChatMessage[];
}
export interface citynameclass {
  city_Id: number
  city_Name: string
}

export interface statenameclass {
  state_Id: number
  state_Name: string
}
