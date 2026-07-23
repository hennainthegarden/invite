const body = document.body;

const menuSeal = document.getElementById('menuSeal');
const menuClose = document.getElementById('menuClose');
const menuBackdrop = document.getElementById('menuBackdrop');
const actionSheet = document.getElementById('actionSheet');
const goToRsvp = document.getElementById('goToRsvp');

const courtyardPage = document.getElementById('courtyardPage');
const backToInvitation = document.getElementById('backToInvitation');
const formSeal = document.getElementById('formSeal');
const formBackdrop = document.getElementById('formBackdrop');
const formSheet = document.getElementById('formSheet');
const formClose = document.getElementById('formClose');

const rsvpForm = document.getElementById('rsvpForm');
const formView = document.getElementById('formView');
const successView = document.getElementById('successView');
const formMessage = document.getElementById('formMessage');
const successBack = document.getElementById('successBack');
const successClose = document.getElementById('successClose');

function haptic() {
  if (navigator.vibrate) navigator.vibrate(12);
}

function setMainMenu(open) {
  actionSheet.classList.toggle('open', open);
  menuBackdrop.classList.toggle('open', open);
  actionSheet.setAttribute('aria-hidden', String(!open));
  menuSeal.setAttribute('aria-expanded', String(open));
  body.classList.toggle('locked', open);
}

function setCourtyard(open) {
  courtyardPage.classList.toggle('open', open);
  courtyardPage.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('locked', open);

  if (!open) {
    setForm(false);
  }
}

function setForm(open) {
  formSheet.classList.toggle('open', open);
  formBackdrop.classList.toggle('open', open);
  formSheet.setAttribute('aria-hidden', String(!open));
  formSeal.setAttribute('aria-expanded', String(open));
  body.classList.toggle('locked', open || courtyardPage.classList.contains('open'));

  if (open && !formView.hidden) {
    window.setTimeout(() => {
      document.getElementById('fullName').focus();
    }, 380);
  }
}

/* Hiçbir popup otomatik açılmaz. */
menuSeal.addEventListener('click', () => {
  haptic();
  setMainMenu(true);
});
menuClose.addEventListener('click', () => setMainMenu(false));
menuBackdrop.addEventListener('click', () => setMainMenu(false));

goToRsvp.addEventListener('click', () => {
  setMainMenu(false);
  window.setTimeout(() => setCourtyard(true), 160);
});

backToInvitation.addEventListener('click', () => setCourtyard(false));

formSeal.addEventListener('click', () => {
  haptic();
  setForm(true);
});
formClose.addEventListener('click', () => setForm(false));
formBackdrop.addEventListener('click', () => setForm(false));
successClose.addEventListener('click', () => setForm(false));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  if (formSheet.classList.contains('open')) {
    setForm(false);
  } else if (courtyardPage.classList.contains('open')) {
    setCourtyard(false);
  } else if (actionSheet.classList.contains('open')) {
    setMainMenu(false);
  }
});

rsvpForm.addEventListener('submit', event => {
  event.preventDefault();

  const data = new FormData(rsvpForm);
  const name = String(data.get('Ad Soyad') || '').trim();
  const attendance = String(data.get('Katılım') || '');

  if (!name || !attendance) {
    formMessage.textContent = 'Lütfen adınızı ve katılım durumunuzu seçin.';
    return;
  }

  fetch(rsvpForm.action,{
    method:'POST',
    headers:{'Accept':'application/json'},
    body:new FormData(rsvpForm)
  }).finally(()=>{
    formView.hidden=true;
    successView.hidden=false;
  });
});

successBack.addEventListener('click', () => {
  setForm(false);
  window.setTimeout(() => setCourtyard(false), 160);
});
