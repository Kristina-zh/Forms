const getNextSibling = (elem, selector) => {
  let sibling = elem.nextElementSibling;

  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }
};

class FormValidate {
  constructor() {
    this.texts();
  }
  texts() {
    this.errorName = "Будь ласка, введіть не менше 3-x символів";
    this.errorEmailEmpty = "Поле email не може бути порожнім";
    this.errorEmail = "Помилка в адресі електронної пошти";
    this.errorPhoneEmpty = "Поле телефону не може бути порожнім";
    this.errorPhone = "Помилка в телефоні";
  }
  validate(fields) {
    const nameField = [...fields].find(v => v.name === "name");
    const emailField = [...fields].find(v => v.name === "email");
    const phoneField = [...fields].find(v => v.name === "phone");

    let isValid = true;

    if (nameField) {
      const value = nameField.value;

      if (value.length < 3) {
        const errorDiv = getNextSibling(nameField, ".error");
        errorDiv.textContent = this.errorName;
        isValid = false;
      }
    }

    if (emailField) {
      const value = emailField.value;
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      console.log("TEST", re.test(value));

      if (!value) {
        const errorDiv = getNextSibling(emailField, ".error");
        errorDiv.textContent = this.errorEmailEmpty;
        isValid = false;
      }

      if (value && !re.test(value)) {
        const errorDiv = getNextSibling(emailField, ".error");
        errorDiv.textContent = this.errorEmail;
        isValid = false;
      }
    }

    if (phoneField) {
      const value = phoneField.value;
      const re = /\+38[0-9]{10}$/;

      if (!value) {
        const errorDiv = getNextSibling(phoneField, ".error");
        errorDiv.textContent = this.errorPhoneEmpty;
        isValid = false;
      }

      if (value && !re.test(value)) {
        const errorDiv = getNextSibling(phoneField, ".error");
        errorDiv.textContent = this.errorPhone;
        isValid = false;
      }
    }

    return isValid;
  }
}

class Form extends FormValidate {
  constructor(id) {
    super();

    this.id = id;
    this.form = document.getElementById(id);
    this.fields = this.form.querySelectorAll(".js_required");

    this.form.addEventListener("submit", event => this.onSubmit(event));

    this.handleInputChange();
  }

  onSubmit(event) {
    event.preventDefault();
    const isValid = super.validate(this.fields);
    if (isValid) {
      this.onSuccess();
    }
  }

  onSuccess() {
    const successBlock = document.createElement("div");
    successBlock.classList.add("success");
    successBlock.textContent = "Форма відправлена";

    this.form.parentNode.insertBefore(successBlock, this.form.nextSibling);
    this.form.remove();
  }

  onChange() {
    const errorDiv = getNextSibling(this, ".error");
    errorDiv.textContent = "";
  }

  handleInputChange() {
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].addEventListener("input", this.onChange);
      this.fields[i].addEventListener("focus", this.onFocus);
      this.fields[i].addEventListener("blur", this.onBlur);
    }
  }

  onFocus() {
    this.classList.add("focused");
  }

  onBlur() {
    this.classList.remove("focused");
  }
}

const form1 = new Form("form1");
const form2 = new Form("form2");
