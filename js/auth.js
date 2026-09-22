import {
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase-config.js";


const userForm =
    document.getElementById("userForm");

const otpSection =
    document.getElementById("otpSection");

const otpCode =
    document.getElementById("otpCode");

const verifyOtpButton =
    document.getElementById("verifyOtpButton");


let confirmationResult = null;
let registrationData = null;


/* =========================================================
   RECAPTCHA
========================================================= */

const recaptchaVerifier =
    new RecaptchaVerifier(
        auth,
        "userdetails",
        {
            size: "invisible",

            callback: () => {
                console.log("reCAPTCHA verified");
            },

            "expired-callback": () => {
                console.log("reCAPTCHA expired");
            }
        }
    );


/* =========================================================
   SEND OTP
========================================================= */

userForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document.getElementById("userName")
                .value.trim();

        const phone =
            document.getElementById("userPhone")
                .value.trim();


        if (!name) {
            alert("Please enter your name.");
            return;
        }


        if (!phone) {
            alert("Please enter your phone number.");
            return;
        }


        registrationData = {
            name,
            phone
        };


        try {

            console.log(
                "Sending OTP to:",
                phone
            );


            confirmationResult =
                await signInWithPhoneNumber(
                    auth,
                    phone,
                    recaptchaVerifier
                );


            console.log(
                "OTP sent successfully."
            );


            userForm.style.display =
                "none";

            otpSection.style.display =
                "block";


            alert(
                "OTP sent to your phone."
            );


        } catch (error) {

            console.error(
                "OTP ERROR:",
                error
            );


            alert(
                error.message
            );

        }

    }
);


/* =========================================================
   VERIFY OTP
========================================================= */

verifyOtpButton.addEventListener(
    "click",
    async () => {

        const code =
            otpCode.value.trim();


        if (!code) {

            alert(
                "Please enter the OTP."
            );

            return;
        }


        if (!confirmationResult) {

            alert(
                "Please request a new OTP."
            );

            return;
        }


        try {

            const result =
                await confirmationResult
                    .confirm(code);


            const user =
                result.user;


            console.log(
                "Phone verified.",
                user.uid
            );


            /* =================================================
               CHECK IF USER ALREADY EXISTS
            ================================================= */

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const userSnapshot =
                await getDoc(userRef);


            if (!userSnapshot.exists()) {

                /* =============================================
                   NEW USER
                ============================================= */

                await setDoc(
                    userRef,
                    {
                        name:
                            registrationData.name,

                        phone:
                            registrationData.phone,

                        createdAt:
                            serverTimestamp()
                    }
                );


                console.log(
                    "New user profile created."
                );


            } else {

                console.log(
                    "Existing user logged in."
                );

            }


            alert(
                "Phone verified successfully!"
            );


            /*
             * We'll replace this alert later with:
             *
             * close modal
             * update user profile
             * show logged-in state
             */


        } catch (error) {

            console.error(
                "OTP VERIFY ERROR:",
                error
            );


            alert(
                error.message
            );

        }

    }
);