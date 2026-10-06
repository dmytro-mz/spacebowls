// Contact form in the footer. Submissions are delivered by Web3Forms (https://web3forms.com)
// to the address the access key was created for (eat@spacebowls.at).
// The key is public by design: it can only send mail to that one address.
const WEB3FORMS_ACCESS_KEY = "REPLACE_WITH_WEB3FORMS_ACCESS_KEY";

const SUCCESS_MESSAGE = "Vielen Dank!";
const ERROR_MESSAGE = "Submission failed, please try again or contact us about this issue.";

document.addEventListener("submit", async (event) => {
  const form = event.target.closest(".js-contact-form");
  if (!form) return;

  event.preventDefault();
  if (!form.reportValidity()) return;

  const button = form.querySelector('button[type="submit"]');
  const content = button.querySelector(".ye-form--btn-content");
  const spinner = button.querySelector(".ye-form--btn-spinner");
  const errors = form.querySelector("[data-form-errors]");

  errors.innerHTML = "";
  button.disabled = true;
  content.classList.add("uk-invisible");
  spinner.classList.remove("uk-hidden");

  const data = new FormData(form);
  data.append("access_key", WEB3FORMS_ACCESS_KEY);
  data.append("subject", "Kontaktformular spacebowls.at");
  data.append("from_name", "spacebowls.at");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    form.reset();
    UIkit.modal.alert(SUCCESS_MESSAGE);
  } catch (error) {
    console.error(error);
    errors.innerHTML =
      '<div class="uk-alert-danger uk-margin-top uk-text-small" uk-alert>' +
      '<a class="uk-alert-close" uk-close></a><b>Submission failed</b><br/>' +
      ERROR_MESSAGE +
      "</div>";
  } finally {
    button.disabled = false;
    content.classList.remove("uk-invisible");
    spinner.classList.add("uk-hidden");
  }
});
