import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return pattern.test(value) ? null : { emailInvalid: true };
}

export function nameValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').trim();
  const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;

  return pattern.test(value) ? null : { nameInvalid: true };
}

export function surnameValidator(control: AbstractControl): ValidationErrors | null {
  return nameValidator(control) ? { surnameInvalid: true } : null;
}

const MIN_LOWERCASE = 1;
const MIN_UPPERCASE = 1;
const MIN_NUMBERS = 1;
const MIN_SPECIAL = 1;
const MIN_LENGTH = 8;

const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;':\",.<>/?";

export function passwordValidatorSignUp(control: AbstractControl): ValidationErrors | null {
  const password = (control.value || '').trim();

  let lowercase = 0;
  let uppercase = 0;
  let numbers = 0;
  let special = 0;

  for (const char of password) {
    if (char >= 'a' && char <= 'z') lowercase++;
    else if (char >= 'A' && char <= 'Z') uppercase++;
    else if (char >= '0' && char <= '9') numbers++;
    else if (SPECIAL_CHARS.includes(char)) special++;
  }

  const valid =
    password.length >= MIN_LENGTH &&
    lowercase >= MIN_LOWERCASE &&
    uppercase >= MIN_UPPERCASE &&
    numbers >= MIN_NUMBERS &&
    special >= MIN_SPECIAL;

  return valid ? null : { passwordInvalid: true };
}

export function passwordValidatorLogin(control: AbstractControl): ValidationErrors | null {
  const password = (control.value || '').trim();

  const valid = password.length >= 0;

  return valid ? null : { passwordInvalid: true };
}


