import { atom } from "recoil";


export const credentialState = atom({
    key:"credentials",
    default:{clientId:"", clientSecret:"", url:"", code:""}
})