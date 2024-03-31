import otpGenerator from 'otp-generator'

// export const generateOtp=()=>{
//     return(Math.floor(Math.random()*10000)+1000000).toString().substring(1)
// }




export const otpGenerators = ()=>{
    otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false }); 
}