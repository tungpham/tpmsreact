
// class AppValidation extends Validation {
//   // That's how we can add custom validations.
//   superLongPassword() {
//     return this.validate((value, prop) => {
//       const minLength = 500;
//       if (value.length >= minLength) return;
//       throw new ValidationError("superLongPassword", { minLength, prop });
//     });
//   }
// }
//
// const validate = json => new AppValidation(json);
//
// export default validate;
